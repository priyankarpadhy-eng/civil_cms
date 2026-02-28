import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
    Tooltip,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Divider
} from '@mui/material';
import {
    FaceRetouchingNaturalRounded,
    CameraAltRounded,
    CheckCircleRounded,
    VideoCameraFrontRounded,
    RestartAltRounded,
    PersonRounded,
    DownloadForOfflineRounded
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';

import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';

const scanAnimation = keyframes`
  0% { top: 0% }
  50% { top: 100% }
  100% { top: 0% }
`;

const TeacherFaceAttendance = () => {
    const { currentUser } = useSelector(state => state.user);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [students, setStudents] = useState([]);
    const [faceMatcher, setFaceMatcher] = useState(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [identifiedStudents, setIdentifiedStudents] = useState([]); // List of students found in current frame
    const [attendanceLog, setAttendanceLog] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    // Initialize Recognition Engine
    useEffect(() => {
        const loadModels = async () => {
            try {
                await tf.setBackend('webgl');
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setIsModelsLoaded(true);
            } catch (err) {
                console.error("AI Loading Error:", err);
            }
        };
        loadModels();
    }, []);

    const fetchTeacherSubjects = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherSubjects/${currentUser._id}`);
            if (Array.isArray(res.data)) {
                setSubjects(res.data);
                if (res.data.length > 0) {
                    const firstSub = res.data[0];
                    setSelectedSubject(firstSub);
                    setSelectedSection(firstSub.section || 'A');
                }
            }
        } catch (err) {
            console.error("Error fetching teacher subjects:", err);
        }
    };

    const fetchStudents = async () => {
        if (!selectedSubject?.sclassName?._id) return;
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/Sclass/Students/${selectedSubject.sclassName._id}`);
            if (Array.isArray(res.data)) {
                const filtered = res.data.filter(s => s.section === selectedSection);
                setStudents(filtered);

                // Create Face Matcher for this class
                const labeledDescriptors = filtered
                    .filter(s => s.faceDescriptor && s.faceDescriptor.length === 128)
                    .map(s => new faceapi.LabeledFaceDescriptors(
                        s._id,
                        [new Float32Array(s.faceDescriptor)]
                    ));

                if (labeledDescriptors.length > 0) {
                    setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
                }
            }
        } catch (err) {
            console.error("Error fetching students:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeacherSubjects();
    }, []);

    useEffect(() => {
        fetchStudents();
        setAttendanceLog([]);
    }, [selectedSubject, selectedSection]);

    // Real-time Multi-Face Recognition
    const recognizeFaces = useCallback(async () => {
        if (!scanning || !isModelsLoaded || !webcamRef.current || !webcamRef.current.video || webcamRef.current.video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(recognizeFaces);
            return;
        }

        const video = webcamRef.current.video;
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

        if (detections.length > 0 && faceMatcher) {
            const results = detections.map(d => ({
                detection: d.detection,
                match: faceMatcher.findBestMatch(d.descriptor)
            }));

            // Sync with student data
            const recognized = results
                .filter(res => res.match.label !== 'unknown')
                .map(res => {
                    const student = students.find(s => s._id === res.match.label);
                    return {
                        ...student,
                        distance: res.match.distance,
                        box: res.detection.box
                    };
                });

            setIdentifiedStudents(recognized);

            // Auto-mark attendance for newly identified students
            recognized.forEach(student => {
                const alreadyMarked = attendanceLog.some(log => log.rollNum === student.rollNum);
                if (!alreadyMarked) {
                    handleMarkAttendance(student);
                }
            });
        } else {
            setIdentifiedStudents([]);
        }

        requestRef.current = requestAnimationFrame(recognizeFaces);
    }, [scanning, isModelsLoaded, faceMatcher, students, attendanceLog]);

    useEffect(() => {
        if (scanning) {
            requestRef.current = requestAnimationFrame(recognizeFaces);
        } else {
            cancelAnimationFrame(requestRef.current);
            setIdentifiedStudents([]);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [scanning, recognizeFaces]);

    const handleMarkAttendance = async (student) => {
        try {
            // Optimistic Update
            setAttendanceLog(prev => [{
                id: Date.now(),
                name: student.name,
                rollNum: student.rollNum,
                time: new Date().toLocaleTimeString()
            }, ...prev]);

            await axios.put(`${process.env.REACT_APP_BASE_URL}/StudentAttendance/${student._id}`, {
                subName: selectedSubject._id,
                status: 'Present',
                date: selectedDate
            });

            setSnackbar({
                open: true,
                message: `Attendance marked for ${student.name}`,
                severity: 'success'
            });
        } catch (err) {
            console.error("Attendance Recording Error:", err);
            // Optionally rollback or show error
        }
    };

    const exportToExcel = () => {
        if (attendanceLog.length === 0) {
            setSnackbar({ open: true, message: 'No records to export!', severity: 'warning' });
            return;
        }

        const data = attendanceLog.map((log, index) => ({
            'S.No': index + 1,
            'Student Name': log.name,
            'Roll Number': log.rollNum,
            'Detection Time': log.time,
            'Subject': selectedSubject?.subName,
            'Batch': selectedSubject?.sclassName?.sclassName,
            'Section': selectedSection,
            'Date': selectedDate
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Log");

        const fileName = `Attendance_${selectedSubject?.subName}_${selectedSection}_${selectedDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        setSnackbar({ open: true, message: 'Report exported successfully!', severity: 'success' });
    };


    return (
        <Box>
            <HeaderBox>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FaceRetouchingNaturalRounded sx={{ fontSize: '2.5rem', color: 'var(--clr-primary)' }} />
                            Biometric Attendance
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                            Real-time biometric facial recognition system
                        </Typography>
                    </Box>

                    <Paper sx={{ p: 2, borderRadius: '20px', display: 'flex', gap: 2, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', boxShadow: 'none' }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Session Date</Typography>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    display: 'block',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--clr-text-primary)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    padding: '4px 0'
                                }}
                            />
                        </Box>
                    </Paper>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <SelectionCard>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', mb: 1, display: 'block' }}>Subject</Typography>
                            <select
                                value={selectedSubject?._id || ''}
                                onChange={(e) => {
                                    const sub = subjects.find(s => s._id === e.target.value);
                                    setSelectedSubject(sub);
                                    setSelectedSection(sub?.section || 'A');
                                }}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--clr-border)', padding: '10px', borderRadius: '12px', color: 'var(--clr-text-primary)', fontWeight: 600 }}
                            >
                                <option value="" disabled>Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s._id} value={s._id}>{s.subName} ({s.sclassName?.sclassName})</option>
                                ))}
                            </select>
                        </SelectionCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SelectionCard>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', mb: 1, display: 'block' }}>Section</Typography>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--clr-border)', padding: '10px', borderRadius: '12px', color: 'var(--clr-text-primary)', fontWeight: 600 }}
                            >
                                {selectedSubject?.sclassName?.sections?.map(sec => (
                                    <option key={sec} value={sec}>Section {sec}</option>
                                )) || <option value="A">Section A</option>}
                            </select>
                        </SelectionCard>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsCard>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase' }}>Students in Frame</Typography>
                                <Typography variant="h5" fontWeight={900}>{students.length}</Typography>
                            </Box>
                            <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Present</Typography>
                                <Typography variant="h5" fontWeight={900} sx={{ color: '#10b981' }}>{attendanceLog.length}</Typography>
                            </Box>
                        </StatsCard>
                    </Grid>
                </Grid>
            </HeaderBox>

            <Grid container spacing={4}>
                {/* Left: Recognition Interface */}
                <Grid item xs={12} lg={7}>
                    <MainCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" fontWeight={800}>Live Camera Feed</Typography>
                            <StatusChip active={scanning}>
                                {scanning ? "Recognition Active" : "Camera Offline"}
                            </StatusChip>
                        </Box>

                        <CameraContainer>
                            {scanning ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <ScanLine />
                                    <FocusFrame />

                                    <AnimatePresence>
                                        {identifiedStudents.map(student => (
                                            <IdentityCard
                                                key={student._id}
                                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                style={{
                                                    bottom: 'auto',
                                                    top: `${(student.box.y / 640) * 100}%`,
                                                    left: `${(student.box.x / 640) * 100}%`,
                                                    width: 'auto',
                                                    minWidth: '150px'
                                                }}
                                            >
                                                <IdentificationHeader>Identity Verified</IdentificationHeader>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                                                    <Avatar src={student.faceData} sx={{ width: 32, height: 32, border: '2px solid #10b981' }} />
                                                    <Box>
                                                        <Typography variant="caption" fontWeight={900}>{student.name}</Typography>
                                                    </Box>
                                                    <CheckCircleRounded sx={{ ml: 'auto', fontSize: '1.2rem', color: '#10b981' }} />
                                                </Box>
                                            </IdentityCard>
                                        ))}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, background: 'var(--clr-surface-2)' }}>
                                    <VideoCameraFrontRounded sx={{ fontSize: '4rem', opacity: 0.2 }} />
                                    <Typography variant="body2" color="text.secondary">Ready to start high-accuracy biometric session</Typography>
                                </Box>
                            )}
                        </CameraContainer>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            {!scanning ? (
                                <Button
                                    variant="contained"
                                    startIcon={!isModelsLoaded ? <CircularProgress size={20} color="inherit" /> : <CameraAltRounded />}
                                    fullWidth
                                    onClick={() => setScanning(true)}
                                    disabled={!isModelsLoaded || students.length === 0}
                                    sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800, background: 'var(--grad-primary)' }}
                                >
                                    {!isModelsLoaded ? "Loading AI Engine..." : "Start Smart Recognition"}
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={() => { setScanning(false); setIdentifiedStudents([]); }}
                                    sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800, borderStyle: 'dashed' }}
                                >
                                    Stop Session
                                </Button>
                            )}
                        </Box>
                    </MainCard>
                </Grid>

                {/* Right: Roll Call & Logs */}
                <Grid item xs={12} lg={5}>
                    <SideCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={800}>Session Log</Typography>
                            <Button
                                variant="text"
                                color="primary"
                                startIcon={<DownloadForOfflineRounded />}
                                onClick={exportToExcel}
                                sx={{ fontWeight: 800, textTransform: 'none', borderRadius: '10px' }}
                                disabled={attendanceLog.length === 0}
                            >
                                Export Report
                            </Button>
                        </Box>

                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800 }}>Student</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>Roll</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }} align="right">Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceLog.map((log) => (
                                        <TableRow key={log.id} sx={{ '&:hover': { background: 'var(--clr-surface-2)' } }}>
                                            <TableCell sx={{ fontWeight: 700 }}>{log.name}</TableCell>
                                            <TableCell>{log.rollNum}</TableCell>
                                            <TableCell align="right" sx={{ color: 'var(--clr-text-muted)', fontSize: '0.75rem' }}>{log.time}</TableCell>
                                        </TableRow>
                                    ))}
                                    {attendanceLog.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, opacity: 0.5 }}>
                                                No students recorded yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'var(--clr-text-muted)' }}>Class Readiness</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {students.map(s => (
                                <Tooltip key={s._id} title={s.faceCaptured ? "Face Scanned" : "Face Not Scanned"}>
                                    <StudentAvatar
                                        src={s.profilePic}
                                        captured={s.faceCaptured}
                                        marked={attendanceLog.some(log => log.rollNum === s.rollNum)}
                                    >
                                        {!s.profilePic && s.name.charAt(0)}
                                    </StudentAvatar>
                                </Tooltip>
                            ))}
                        </Box>
                    </SideCard>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherFaceAttendance;

const HeaderBox = styled(Box)`
    margin-bottom: 32px;
`;

const MainCard = styled(Paper)`
    padding: 32px;
    border-radius: 28px !important;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: var(--shadow-sm) !important;
`;

const SideCard = styled(Paper)`
    padding: 32px;
    border-radius: 28px !important;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: var(--shadow-sm) !important;
    height: 100%;
`;

const CameraContainer = styled.div`
    width: 100%;
    aspect-ratio: 4/3;
    background: #000;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    border: 2px solid var(--clr-border);
`;

const ScanLine = styled.div`
    position: absolute;
    width: 100%;
    height: 4px;
    background: #10b981;
    z-index: 10;
    box-shadow: 0 0 15px #10b981;
    animation: ${scanAnimation} 5s linear infinite;
`;

const FocusFrame = styled.div`
    position: absolute;
    inset: 60px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 24px;
    z-index: 5;
    &::before, &::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
    }
    border-image: radial-gradient(circle, transparent 70%, rgba(255,255,255,0.5) 100%) 1;
`;

const StatusChip = styled.div`
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 800;
    background: ${p => p.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)'};
    color: ${p => p.active ? '#10b981' : '#ef4444'};
    display: flex;
    align-items: center;
    gap: 6px;
    &::before {
        content: '';
        width: 6px; height: 6px;
        background: currentColor;
        border-radius: 50%;
        animation: ${p => p.active ? 'pulse 1.5s infinite' : 'none'};
    }
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }
`;

const IdentityCard = styled(motion.div)`
    position: absolute;
    background: rgba(18, 18, 42, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(16, 185, 129, 0.5);
    border-radius: 12px;
    color: white;
    overflow: hidden;
    z-index: 20;
    pointer-events: none;
`;

const IdentificationHeader = styled.div`
    background: #10b981;
    color: white;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 6px 16px;
    text-align: center;
`;

const SelectionCard = styled(Paper)`
    padding: 16px;
    border-radius: 20px !important;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: none !important;
    height: 100%;
`;

const StatsCard = styled(SelectionCard)`
    background: var(--clr-surface-2) !important;
    display: flex;
    align-items: center;
`;

const StudentAvatar = styled(Avatar)`
    width: 36px !important;
    height: 36px !important;
    font-size: 0.9rem !important;
    font-weight: 800 !important;
    border: 2px solid ${p => p.marked ? '#10b981' : p.captured ? 'var(--clr-primary)' : 'rgba(255,255,255,0.1)'} !important;
    background: ${p => p.marked ? 'rgba(16, 185, 129, 0.2)' : 'var(--clr-surface-2)'} !important;
    color: ${p => p.marked ? '#10b981' : 'var(--clr-text-secondary)'} !important;
    opacity: ${p => p.captured ? 1 : 0.4};
    transition: all 0.3s;
`;
