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
    LinearProgress,
} from '@mui/material';
import {
    CloseRounded,
    CheckCircleRounded,
    SecurityRounded,
    FaceRetouchingNaturalRounded,
    RefreshRounded
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// TensorFlow & MediaPipe
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';

const FaceScanModal = ({ open, onClose, onCapture }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    const requestRef = useRef(null);

    const [imgSrc, setImgSrc] = useState(null);
    const [descriptor, setDescriptor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Initializing AI...');
    const [progress, setProgress] = useState(0);
    const [currentTask, setCurrentTask] = useState('align'); // align, blink, left, right, up, down, complete
    const [faceInCircle, setFaceInCircle] = useState(false);

    // Task Completion States
    const [tasks, setTasks] = useState({
        align: false,
        blink: false,
        left: false,
        right: false
    });

    // Initialize Detectors & Recognition Models
    useEffect(() => {
        const init = async () => {
            try {
                await tf.setBackend('webgl');

                // 1. Load Landmarks Detector for Liveness
                const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
                const detectorConfig = {
                    runtime: 'tfjs',
                    refineLandmarks: true,
                };
                detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);

                // 2. Load Face-API.js models for high-accuracy recognition (embeddings)
                setStatus('Loading Recognition Core...');
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);

                setLoading(false);
                setStatus('Ready to verify');
            } catch (err) {
                console.error("AI Initialization Error:", err);
                setStatus('AI Error. Try again.');
            }
        };
        if (open) init();
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [open]);

    const handleCapture = async () => {
        if (!webcamRef.current) return;

        try {
            setStatus('Computing Biometric ID...');
            const video = webcamRef.current.video;

            // Full-resolution capture for high accuracy
            const imageSrc = webcamRef.current.getScreenshot();

            // Generate Descriptor (Embedding)
            const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

            if (detection) {
                setImgSrc(imageSrc);
                setDescriptor(Array.from(detection.descriptor)); // Convert Float32Array to regular array
                cancelAnimationFrame(requestRef.current);
                setStatus('Identity Verified');
            } else {
                setStatus('Recalibrating... look steady');
                // Re-attempting in a bit if detection fails at capture moment
            }
        } catch (err) {
            console.error("Capture Error:", err);
        }
    };

    // Detection Loop
    const detect = useCallback(async () => {
        if (!detectorRef.current || !webcamRef.current || !webcamRef.current.video || webcamRef.current.video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(detect);
            return;
        }

        const video = webcamRef.current.video;
        const faces = await detectorRef.current.estimateFaces(video, { flipHorizontal: false });

        if (faces.length > 0) {
            const face = faces[0];
            const keypoints = face.keypoints;

            const box = face.box;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            const centerX = box.xMin + box.width / 2;
            const centerY = box.yMin + box.height / 2;
            const isInCenter = centerX > videoWidth * 0.3 && centerX < videoWidth * 0.7 &&
                centerY > videoHeight * 0.3 && centerY < videoHeight * 0.7;
            const isRightSize = box.width > videoWidth * 0.25;

            if (isInCenter && isRightSize) {
                setFaceInCircle(true);
                if (currentTask === 'align') {
                    setTasks(prev => ({ ...prev, align: true }));
                    setCurrentTask('blink');
                    setStatus('Blink your eyes');
                }
            } else {
                setFaceInCircle(false);
                if (!tasks.align) setStatus('Align face in circle');
            }

            if (tasks.align && !tasks.blink) {
                const leftEyeTop = keypoints.find(k => k.name === 'leftEyeLower0');
                const leftEyeBottom = keypoints.find(k => k.name === 'leftEyeUpper0');
                if (leftEyeTop && leftEyeBottom) {
                    const dist = Math.abs(leftEyeTop.y - leftEyeBottom.y);
                    if (dist < 4) {
                        setTasks(prev => ({ ...prev, blink: true }));
                        setCurrentTask('left');
                        setStatus('Turn head LEFT');
                    }
                }
            } else if (tasks.blink && !tasks.left) {
                const nose = keypoints.find(k => k.name === 'noseTip');
                if (nose) {
                    const distToLeft = Math.abs(nose.x - box.xMin);
                    const distToRight = Math.abs(nose.x - (box.xMin + box.width));
                    if (distToRight / distToLeft > 2.5) {
                        setTasks(prev => ({ ...prev, left: true }));
                        setCurrentTask('right');
                        setStatus('Turn head RIGHT');
                    }
                }
            } else if (tasks.left && !tasks.right) {
                const nose = keypoints.find(k => k.name === 'noseTip');
                if (nose) {
                    const distToLeft = Math.abs(nose.x - box.xMin);
                    const distToRight = Math.abs(nose.x - (box.xMin + box.width));
                    if (distToLeft / distToRight > 2.5) {
                        setTasks(prev => ({ ...prev, right: true }));
                        setCurrentTask('complete');
                        handleCapture();
                    }
                }
            }

            // 3. 3D Depth Consistency Check (Anti-Spoofing)
            // Screens are 2D, so landmarks move rigidly. 3D faces have internal parallax.
            const noseTip = keypoints.find(k => k.name === 'noseTip');
            const leftEar = keypoints.find(k => k.name === 'leftEar');
            const rightEar = keypoints.find(k => k.name === 'rightEar');

            if (noseTip && leftEar && rightEar) {
                // Calculate z-depth variance (relative to face box)
                // In MediaPipe FaceMesh, z-coordinates are available.
                const zNose = noseTip.z || 0;
                const zEars = ((leftEar.z || 0) + (rightEar.z || 0)) / 2;
                const depthDiff = Math.abs(zNose - zEars);

                // Screen/2D Photo usually has very low depth variance in the point cloud
                // Threshold for real 3D face depth typically > 15-20 units in normalized space
                if (depthDiff < 12 && tasks.align) {
                    setStatus('⚠️ 2D Spoof Detected! Use a real face.');
                    setFaceInCircle(false);
                    return;
                }
            }

            const completedCount = Object.values(tasks).filter(Boolean).length;
            setProgress((completedCount / 4) * 100);
        }

        requestRef.current = requestAnimationFrame(detect);
    }, [currentTask, tasks]);

    useEffect(() => {
        if (!loading && open && !imgSrc) {
            requestRef.current = requestAnimationFrame(detect);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [loading, open, imgSrc, detect]);

    const handleSave = () => {
        onCapture({ image: imgSrc, descriptor });
        onClose();
    };

    const reset = () => {
        setImgSrc(null);
        setDescriptor(null);
        setTasks({ align: false, blink: false, left: false, right: false });
        setCurrentTask('align');
        setProgress(0);
        setStatus('Ready to verify');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '28px',
                    background: 'var(--clr-bg)',
                    border: '1px solid var(--clr-border)',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--clr-surface-1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)' }}>
                        <SecurityRounded fontSize="small" />
                    </Box>
                    <Typography variant="h6" fontWeight={800}>Biometric ID Capture</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><CloseRounded /></IconButton>
            </Box>

            <DialogContent sx={{ p: 4 }}>
                <ProgressBarContainer>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                        Verification Progress: {Math.round(progress)}%
                    </Typography>
                    <StyledProgress variant="determinate" value={progress} />
                </ProgressBarContainer>

                <CameraWrapper>
                    {!imgSrc ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                mirrored={true}
                                videoConstraints={{ width: 640, height: 640, facingMode: "user" }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Instagram Style Circle UI */}
                            <CircleOverlay active={faceInCircle}>
                                <div className="scanner-line" />
                                <div className="frame-corners" />
                                {currentTask !== 'align' && (
                                    <TaskHint key={currentTask} status={status}>
                                        {status}
                                    </TaskHint>
                                )}
                            </CircleOverlay>

                            {loading && (
                                <LoadingOverlay>
                                    <CircularProgress size={40} thickness={5} />
                                    <Typography sx={{ mt: 2, fontWeight: 700 }}>Initializing Security Engine...</Typography>
                                </LoadingOverlay>
                            )}
                        </>
                    ) : (
                        <AnimatePresence>
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={imgSrc}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '32px' }}
                            />
                            <SuccessOverlay>
                                <CheckCircleRounded sx={{ fontSize: '4rem', color: '#10b981' }} />
                                <Typography variant="h5" fontWeight={900}>Liveness Verified</Typography>
                            </SuccessOverlay>
                        </AnimatePresence>
                    )}
                </CameraWrapper>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {!imgSrc ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'var(--clr-text-secondary)', fontWeight: 600, mb: 2 }}>
                                {tasks.align ? "Follow the on-screen prompts" : "Look directly into the camera to begin"}
                            </Typography>
                            {!faceInCircle && !loading && (
                                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 800 }}>
                                    ⚠️ No face detected in frame
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={reset}
                                startIcon={<RefreshRounded />}
                                sx={{ borderRadius: '16px', py: 1.5, fontWeight: 800, border: '2px solid' }}
                            >
                                Restart Scan
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSave}
                                sx={{ borderRadius: '16px', py: 1.5, fontWeight: 800, background: 'var(--grad-primary)' }}
                            >
                                Save Biometric ID
                            </Button>
                        </Stack>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FaceScanModal;

/* --- Styled Components --- */

const scan = keyframes`
  0% { transform: translateY(-120px) scaleX(0.8); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(120px) scaleX(0.8); opacity: 0; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const CameraWrapper = styled.div`
    position: relative;
    width: 320px;
    height: 320px;
    margin: 0 auto;
    border-radius: 40px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    border: 4px solid var(--clr-surface-2);
`;

const CircleOverlay = styled.div`
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    border: 3px solid ${p => p.active ? '#10b981' : 'rgba(255,255,255,0.2)'};
    box-shadow: 0 0 0 100px rgba(0,0,0,0.5);
    z-index: 5;
    transition: all 0.3s ease;

    .scanner-line {
        position: absolute;
        top: 50%; left: 10%; right: 10%;
        height: 2px;
        background: #10b981;
        box-shadow: 0 0 15px #10b981;
        animation: ${scan} 2.5s infinite linear;
        display: ${p => p.active ? 'block' : 'none'};
    }

    .frame-corners {
        position: absolute;
        inset: -10px;
        border: 4px solid ${p => p.active ? '#10b981' : 'rgba(255,255,255,0.3)'};
        border-radius: 50%;
        clip-path: polygon(0 0, 10% 0, 10% 100%, 0 100%, 0 0, 100% 0, 100% 10%, 0 10%, 0 0, 100% 0, 100% 100%, 90% 100%, 90% 0, 100% 0, 100% 100%, 0 100%, 0 90%, 100% 90%, 100% 100%);
        mask: radial-gradient(circle, transparent 65%, black 100%);
    }

    ${p => p.active && css`
        animation: ${pulse} 2s infinite;
    `}
`;

const TaskHint = styled.div`
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
    border: 1px solid #10b981;
`;

const LoadingOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--clr-bg);
    z-index: 20;
    color: var(--clr-text-primary);
`;

const SuccessOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(16, 185, 129, 0.1);
    backdrop-filter: blur(8px);
    z-index: 10;
    color: #10b981;
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    margin-bottom: 32px;
`;

const StyledProgress = styled(LinearProgress)`
    height: 8px !important;
    border-radius: 4px;
    background-color: var(--clr-surface-2) !important;
    .MuiLinearProgress-bar {
        background: var(--grad-primary) !important;
        border-radius: 4px;
    }
`;
