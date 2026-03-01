import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Stack,
    Alert
} from '@mui/material';
import {
    CloseRounded,
    CheckCircleRounded,
    SecurityRounded,
    LocationOffRounded
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// TensorFlow & MediaPipe & Face-API
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as faceapi from '@vladmandic/face-api';
import { FACEMESH_TESSELATION } from '@mediapipe/face_mesh';

// --------------------------------------------------------------------------
// Anti-Cheat: Geolocation Configuration
// IGIT Sarang Coordinates
const IGIT_LAT = 20.8633;
const IGIT_LON = 85.2536;
const MAX_RADIUS_KM = 5000; // Keep very large for dev bypass. Real-world: change to 5 (5km)

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // earth radius km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// --------------------------------------------------------------------------
// Blink Detection (EAR - Eye Aspect Ratio)
// Indices based on MediaPipe Face Mesh (468 points)
const LEFT_EYE = { outer: 33, inner: 133, top: 159, bottom: 145 };
const RIGHT_EYE = { outer: 362, inner: 263, top: 386, bottom: 374 };

const calculateEAR = (points, eye) => {
    const p_outer = points[eye.outer];
    const p_inner = points[eye.inner];
    const p_top = points[eye.top];
    const p_bottom = points[eye.bottom];
    if (!p_outer || !p_inner || !p_top || !p_bottom) return 1.0;

    // Use vertical distance over horizontal distance
    const height = Math.hypot(p_top.x - p_bottom.x, p_top.y - p_bottom.y);
    const width = Math.hypot(p_outer.x - p_inner.x, p_outer.y - p_inner.y);

    // Safety check to avoid division by zero
    if (width === 0) return 1.0;
    return height / width;
};

const BLINK_THRESHOLD = 0.25; // More lenient threshold (previously 0.20)

const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';

const FaceScanModal = ({ open, onClose, onCapture }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    const requestRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [geoError, setGeoError] = useState(null);

    // State machine: 'Searching', 'Scanning', 'Blink Challenge', 'Success'
    const [machineState, setMachineState] = useState('Searching');
    const [statusMsg, setStatusMsg] = useState('Looking for face...');
    const [blinkDetected, setBlinkDetected] = useState(false);

    // Final Data
    const [imgSrc, setImgSrc] = useState(null);
    const [descriptor, setDescriptor] = useState(null);

    // Track sequential blink frames
    const blinkFrames = useRef(0);
    const scanTimeCounter = useRef(0);

    // Initialize Geolocation + AI
    useEffect(() => {
        if (!open) return;

        console.log("Biometric Scanner Initializing...");

        // 1. Check Geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const distance = getDistanceFromLatLonInKm(IGIT_LAT, IGIT_LON, latitude, longitude);
                    if (distance > MAX_RADIUS_KM) {
                        setGeoError(`Location locked. You are ${Math.round(distance)}km away from campus.`);
                    } else {
                        initAI();
                    }
                },
                (error) => {
                    console.warn("Geo skipped:", error.message);
                    setGeoError(`Location access required for strict mode.`);
                    initAI(); // Bypass for dev
                }
            );
        } else {
            initAI();
        }

        async function initAI() {
            try {
                setLoading(true);
                await tf.ready();
                await tf.setBackend('webgl');
                console.log("TensorFlow Ready. Backend:", tf.getBackend());

                // Load MediaMesh
                const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
                const detectorConfig = {
                    runtime: 'tfjs',
                    refineLandmarks: false, // Turned off for performance boost
                    maxFaces: 1
                };
                detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
                console.log("FaceMesh Detector Loaded.");

                // Load FaceAPI for embedding extraction
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                console.log("Models Loaded Successfully.");

                setLoading(false);
            } catch (err) {
                console.error("AI Initialization Error:", err);
                setStatusMsg('Engine Error. Refresh page.');
                setLoading(false);
            }
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [open]);

    // Handle extraction after blink
    const triggerSuccess = useCallback(async () => {
        setMachineState('Success');
        setStatusMsg('Verified!');
        if (!webcamRef.current) return;

        const video = webcamRef.current.video;
        const imageSrc = webcamRef.current.getScreenshot();

        // Generate Embedding (128 vectors)
        const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            setImgSrc(imageSrc);
            setDescriptor(Array.from(detection.descriptor)); // Convert to simple array for Supabase vector search fallback
            cancelAnimationFrame(requestRef.current);
        } else {
            setMachineState('Searching');
            setStatusMsg('Capture failed. Please try again.');
        }
    }, []);

    // Core Animation & Detection Loop
    const renderLoop = useCallback(async () => {
        if (!detectorRef.current || !webcamRef.current || !webcamRef.current.video || !canvasRef.current || machineState === 'Success') {
            if (machineState !== 'Success') requestRef.current = requestAnimationFrame(renderLoop);
            return;
        }

        const video = webcamRef.current.video;
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(renderLoop);
            return;
        }

        // Setup Canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Estimate face
        // IMPORTANT: flipHorizontal should match the mirrored display logic
        const faces = await detectorRef.current.estimateFaces(video, { flipHorizontal: true });

        if (faces.length > 0) {
            const face = faces[0];
            const pts = face.keypoints;

            // Check if face is close enough (roughly spanning > 25% of the frame)
            const box = face.box;
            const faceArea = box.width * box.height;
            const frameArea = canvas.width * canvas.height;
            const isCloseEnough = (faceArea / frameArea) > 0.05;

            // DRAW MESH: Futuristic Cyan Tesselation
            ctx.strokeStyle = isCloseEnough ? 'rgba(0, 255, 255, 0.4)' : 'rgba(239, 68, 68, 0.4)';
            ctx.lineWidth = 1.0;
            FACEMESH_TESSELATION.forEach(edge => {
                const pt1 = pts[edge[0]];
                const pt2 = pts[edge[1]];
                if (pt1 && pt2) {
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.stroke();
                }
            });

            if (!isCloseEnough) {
                setMachineState('Scanning');
                setStatusMsg('Move closer to the camera');
                requestRef.current = requestAnimationFrame(renderLoop);
                return;
            }

            // SCAN LINE ANIMATION
            const scanSpeed = 1500; // ms
            const currentY = (Date.now() % scanSpeed) / scanSpeed * canvas.height;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
            ctx.fillRect(0, currentY, canvas.width, 3);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.fillRect(0, currentY - 20, canvas.width, 20);

            // STATE MACHINE LOGIC
            // EAR Calculation
            const leftEar = calculateEAR(pts, LEFT_EYE);
            const rightEar = calculateEAR(pts, RIGHT_EYE);
            const avgEar = (leftEar + rightEar) / 2;

            if (machineState === 'Searching') {
                setMachineState('Scanning');
                setStatusMsg('Face detected. Hold still...');
                scanTimeCounter.current = Date.now();
            } else if (machineState === 'Scanning') {
                if (Date.now() - scanTimeCounter.current > 1500) {
                    setMachineState('Blink Challenge');
                    setStatusMsg('Blink Now to Confirm');
                }
            } else if (machineState === 'Blink Challenge') {
                if (avgEar < BLINK_THRESHOLD) {
                    blinkFrames.current++;
                } else if (blinkFrames.current > 0) {
                    // Successfully blinked! The eye opened back up
                    setBlinkDetected(true);
                    triggerSuccess();
                    blinkFrames.current = 0;
                    return; // Halt loop
                }
            }
        } else {
            setMachineState('Searching');
            setStatusMsg('Looking for face...');
        }

        requestRef.current = requestAnimationFrame(renderLoop);
    }, [machineState, triggerSuccess]);

    useEffect(() => {
        if (!loading && open && !imgSrc && !geoError) {
            requestRef.current = requestAnimationFrame(renderLoop);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [loading, open, imgSrc, renderLoop, geoError]);

    const handleSave = () => {
        onCapture({ image: imgSrc, descriptor });
        onClose();
    };

    const reset = () => {
        setImgSrc(null);
        setDescriptor(null);
        setMachineState('Searching');
        setBlinkDetected(false);
        setStatusMsg('Looking for face...');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '24px', overflow: 'hidden' } }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', borderBottom: '1px solid #374151' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SecurityRounded sx={{ color: '#00ffff' }} />
                    <Typography variant="h6" fontWeight={800} color="white">Advanced Biometric Scanner</Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><CloseRounded /></IconButton>
            </Box>

            <DialogContent sx={{ p: 4 }}>
                {geoError && (
                    <Alert severity="warning" icon={<LocationOffRounded />} sx={{ mb: 3, borderRadius: '12px' }}>
                        {geoError} (Proceeding in Dev Mode)
                    </Alert>
                )}

                <CameraContainer>
                    {!imgSrc ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                mirrored={true}
                                videoConstraints={{ width: 640, height: 640, facingMode: "user" }}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            {/* Canvas for Glow Mesh and Scan Line */}
                            <canvas
                                ref={canvasRef}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    pointerEvents: 'none',
                                    transform: 'scaleX(-1)' // Align with mirrored webcam
                                }}
                            />

                            <StatusOverlay state={machineState}>
                                <Typography variant="h6" fontWeight={800}>{statusMsg}</Typography>
                            </StatusOverlay>

                            <HUDCorners>
                                <div className="tl" /><div className="tr" /><div className="bl" /><div className="br" />
                            </HUDCorners>

                            {loading && (
                                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                                    <CircularProgress sx={{ color: '#00ffff' }} />
                                    <Typography color="white" mt={2} fontWeight={700}>Initializing Liveness AI...</Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <AnimatePresence>
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={imgSrc}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                            />
                            <SuccessOverlay>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                    <CheckCircleRounded sx={{ fontSize: '5rem', color: '#10b981' }} />
                                </motion.div>
                                <Typography variant="h5" fontWeight={900} color="white" mt={1}>Liveness Verified!</Typography>
                            </SuccessOverlay>
                        </AnimatePresence>
                    )}
                </CameraContainer>

                <Box sx={{ mt: 4 }}>
                    {!imgSrc ? (
                        <Typography textAlign="center" color="#9ca3af" fontWeight={600}>
                            Position your face within the frame. Keep your lighting clear.
                        </Typography>
                    ) : (
                        <Stack direction="row" spacing={2}>
                            <Button variant="outlined" fullWidth onClick={reset} sx={{ borderRadius: '16px', py: 1.5, fontWeight: 800, color: 'white', borderColor: '#374151' }}>
                                Retake
                            </Button>
                            <Button variant="contained" fullWidth onClick={handleSave} sx={{ borderRadius: '16px', py: 1.5, fontWeight: 800, background: '#00ffff', color: 'black', '&:hover': { background: '#00cccc' } }}>
                                Extract & Save Embedding
                            </Button>
                        </Stack>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FaceScanModal;

/* --- UI Styling for Futuristic Scanner --- */

const pulseGreen = keyframes`
  0% { text-shadow: 0 0 10px #10b981; }
  50% { text-shadow: 0 0 30px #10b981; }
  100% { text-shadow: 0 0 10px #10b981; }
`;

const CameraContainer = styled.div`
    position: relative;
    width: 320px;
    height: 320px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.1);
    border: 1px solid #1f2937;
`;

const StatusOverlay = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    border: 1px solid ${p => p.state === 'Blink Challenge' ? '#f59e0b' : p.state === 'Success' ? '#10b981' : '#00ffff'};
    color: ${p => p.state === 'Blink Challenge' ? '#f59e0b' : p.state === 'Success' ? '#10b981' : '#00ffff'};
    padding: 8px 16px;
    border-radius: 50px;
    white-space: nowrap;
    text-align: center;
    transition: all 0.3s;
    ${p => p.state === 'Success' && css`
        animation: ${pulseGreen} 1s infinite;
    `}
`;

const SuccessOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(16, 185, 129, 0.2);
    backdrop-filter: blur(5px);
    z-index: 10;
`;

const HUDCorners = styled.div`
    position: absolute;
    inset: 10px;
    pointer-events: none;
    div {
        position: absolute;
        width: 30px;
        height: 30px;
        border-color: rgba(0, 255, 255, 0.6);
        border-style: solid;
        border-width: 0;
    }
    .tl { top: 0; left: 0; border-top-width: 4px; border-left-width: 4px; }
    .tr { top: 0; right: 0; border-top-width: 4px; border-right-width: 4px; }
    .bl { bottom: 0; left: 0; border-bottom-width: 4px; border-left-width: 4px; }
    .br { bottom: 0; right: 0; border-bottom-width: 4px; border-right-width: 4px; }
`;
