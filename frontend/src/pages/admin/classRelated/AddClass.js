import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Paper,
    IconButton,
    Grid,
    Tooltip,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Avatar,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff, bulkAddStudents } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
    CloudUploadRounded,
    DeleteOutlineRounded,
    AddCircleRounded,
    SaveRounded,
    FilePresentRounded,
    SchoolRounded,
    GroupAddRounded,
    CheckCircleRounded,
    ArrowBackRounded
} from '@mui/icons-material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Popup from "../../../components/Popup";

const AddBatch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, tempDetails } = useSelector(state => state.user);

    const [activeStep, setActiveStep] = useState(0);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // Batch Details
    const [batchName, setBatchName] = useState("");
    const [passoutYear, setPassoutYear] = useState("");
    const [batchNumber, setBatchNumber] = useState("");

    // Students Data
    const [students, setStudents] = useState([]);
    const [manualStudent, setManualStudent] = useState({ name: "", rollNum: "", registrationNum: "", currentSemester: 1, password: "" });

    const steps = ['Batch Identity', 'Student Roster'];

    const handleNext = () => {
        if (activeStep === 0) {
            if (!batchName || !passoutYear || !batchNumber) {
                setMessage("Please fill all identity fields");
                setShowPopup(true);
                return;
            }
            setLoader(true);
            const batchFields = {
                sclassName: batchName,
                passoutYear,
                batchNumber,
                adminID: currentUser._id
            };
            dispatch(addStuff(batchFields, "Sclass"));
        } else {
            if (students.length === 0) {
                setMessage("Please add at least one student or skip this step");
                setShowPopup(true);
                return;
            }
            setLoader(true);
            dispatch(bulkAddStudents({
                students,
                adminID: currentUser._id,
                sclassName: tempDetails._id
            }));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            if (activeStep === 0) {
                setActiveStep(1);
                setLoader(false);
                dispatch(underControl());
            } else {
                setLoader(false);
                setMessage("Batch and Students added successfully!");
                setShowPopup(true);
                setTimeout(() => navigate("/Admin/classes"), 1500);
            }
        } else if (status === 'failed' || status === 'error') {
            setMessage(response || "Something went wrong");
            setShowPopup(true);
            setLoader(false);
            dispatch(underControl());
        }
    }, [status, tempDetails, navigate, dispatch, activeStep, response]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
            const mapped = data.map(row => ({
                name: row.name || row.Name || row.StudentName || "",
                rollNum: String(row.rollNum || row.RollNum || row.RollNo || ""),
                registrationNum: String(row.registrationNum || row.RegistrationNum || row.RegNo || ""),
                currentSemester: Number(row.currentSemester || row.CurrentSemester || 1),
                password: String(row.password || "123456")
            })).filter(s => s.name && s.rollNum);
            setStudents([...students, ...mapped]);
        };
        reader.readAsBinaryString(file);
    };

    const addManualStudent = () => {
        if (!manualStudent.name || !manualStudent.rollNum) return;
        setStudents([...students, { ...manualStudent, password: manualStudent.password || "123456" }]);
        setManualStudent({ name: "", rollNum: "", registrationNum: "", currentSemester: 1, password: "" });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--clr-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <StyledPaper elevation={0}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, margin: '0 auto 20px', background: 'var(--grad-primary)', boxShadow: 'var(--shadow-primary)' }}>
                        {activeStep === 0 ? <SchoolRounded sx={{ fontSize: '2.5rem' }} /> : <GroupAddRounded sx={{ fontSize: '2.5rem' }} />}
                    </Avatar>
                    <Typography variant="h4" fontWeight={900} gutterBottom>
                        {activeStep === 0 ? "Initialize Batch" : "Populate Students"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', maxWidth: 500, margin: '0 auto' }}>
                        {activeStep === 0
                            ? "Define the academic cohort structure for your department."
                            : "Enroll students into the newly created batch via bulk upload or manual entry."}
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel
                                StepIconProps={{
                                    sx: { '&.Mui-active': { color: 'var(--clr-primary)' }, '&.Mui-completed': { color: '#10b981' } }
                                }}
                            >
                                <Typography fontWeight={800}>{label}</Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <AnimatePresence mode="wait">
                    {activeStep === 0 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Stack spacing={4}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            label="Full Batch Name"
                                            placeholder="e.g. 43rd Batch Civil Engineering"
                                            fullWidth
                                            value={batchName}
                                            onChange={(e) => setBatchName(e.target.value)}
                                            variant="filled"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            label="Passout Year"
                                            placeholder="e.g. 2028"
                                            fullWidth
                                            value={passoutYear}
                                            onChange={(e) => setPassoutYear(e.target.value)}
                                            variant="filled"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            label="Batch Number / Code"
                                            placeholder="e.g. B-2024"
                                            fullWidth
                                            value={batchNumber}
                                            onChange={(e) => setBatchNumber(e.target.value)}
                                            variant="filled"
                                        />
                                    </Grid>
                                </Grid>

                                <ActionButton
                                    onClick={handleNext}
                                    disabled={loader}
                                    variant="contained"
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Verify & Continue"}
                                </ActionButton>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Stack spacing={4}>
                                <Box sx={{ p: 4, borderRadius: '24px', border: '2px dashed var(--clr-border)', textAlign: 'center', bgcolor: 'var(--clr-surface-2)' }}>
                                    <CloudUploadRounded sx={{ fontSize: '3.5rem', color: 'var(--clr-primary)', mb: 2, opacity: 0.8 }} />
                                    <Typography variant="h6" fontWeight={800} gutterBottom>Excel / CSV Import</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Map your student roster in seconds. Supports .xlsx and .csv formats.
                                    </Typography>
                                    <input type="file" id="bulk-file" hidden onChange={handleFileUpload} accept=".csv, .xlsx, .xls" />
                                    <label htmlFor="bulk-file">
                                        <Button variant="outlined" component="span" startIcon={<FilePresentRounded />} sx={{ borderRadius: '12px', fontWeight: 700 }}>
                                            Select Roster File
                                        </Button>
                                    </label>
                                </Box>

                                <Divider><Typography variant="caption" fontWeight={900} color="text.secondary">MANUAL ENTRY</Typography></Divider>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <StyledTextField size="small" label="Name" fullWidth value={manualStudent.name} onChange={(e) => setManualStudent({ ...manualStudent, name: e.target.value })} variant="filled" />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <StyledTextField size="small" label="Roll No." fullWidth value={manualStudent.rollNum} onChange={(e) => setManualStudent({ ...manualStudent, rollNum: e.target.value })} variant="filled" />
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<AddCircleRounded />}
                                            onClick={addManualStudent}
                                            sx={{ height: '56px', borderRadius: '14px', background: 'var(--grad-primary)', fontWeight: 800 }}
                                        >
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>

                                {students.length > 0 && (
                                    <ListContainer>
                                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleRounded sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                                            Enrolled Students ({students.length})
                                        </Typography>
                                        <Stack spacing={1}>
                                            {students.slice(-5).map((s, i) => (
                                                <StudentListItem key={i}>
                                                    <Typography fontWeight={700} sx={{ flex: 1 }}>{s.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>Roll: {s.rollNum}</Typography>
                                                    <IconButton size="small" color="error" onClick={() => setStudents(students.filter((_, idx) => idx !== i))}><DeleteOutlineRounded fontSize="small" /></IconButton>
                                                </StudentListItem>
                                            ))}
                                            {students.length > 5 && <Typography variant="caption" sx={{ textAlign: 'center', mt: 1, color: 'var(--clr-primary)', fontWeight: 800 }}>+ {students.length - 5} more students</Typography>}
                                        </Stack>
                                    </ListContainer>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 4 }}>
                                    <Button startIcon={<ArrowBackRounded />} onClick={() => setActiveStep(0)} sx={{ fontWeight: 800 }}>Back</Button>
                                    <ActionButton onClick={handleNext} disabled={loader} variant="contained" sx={{ minWidth: 240 }} startIcon={<SaveRounded />}>
                                        {loader ? <CircularProgress size={24} color="inherit" /> : `Finalize & Enroll`}
                                    </ActionButton>
                                </Box>
                            </Stack>
                        </motion.div>
                    )}
                </AnimatePresence>
            </StyledPaper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default AddBatch;

const StyledPaper = styled(Paper)`
    width: 100%;
    max-width: 800px;
    padding: 64px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 40px !important;
    box-shadow: var(--shadow-xl) !important;
    @media (max-width: 600px) {
        padding: 24px;
    }
`;

const StyledTextField = styled(TextField)`
    .MuiFilledInput-root {
        border-radius: 16px !important;
        background: var(--clr-surface-2) !important;
        border: 1px solid transparent;
        transition: all 0.2s;
        &::before, &::after { display: none; }
        &:hover { background: var(--clr-surface-2) !important; border-color: var(--clr-border); }
        &.Mui-focused { border-color: var(--clr-primary); box-shadow: 0 0 0 4px var(--clr-primary-glow); }
    }
`;

const ActionButton = styled(Button)`
    padding: 16px 48px !important;
    border-radius: 20px !important;
    font-weight: 900 !important;
    font-size: 1.1rem !important;
    text-transform: none !important;
    background: var(--grad-primary) !important;
    box-shadow: var(--shadow-primary) !important;
    transition: all 0.3s !important;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(99, 102, 241, 0.45) !important;
    }
    &:disabled { opacity: 0.7; }
`;

const ListContainer = styled(Box)`
    padding: 24px;
    background: var(--clr-surface-2);
    border-radius: 24px;
    border: 1px solid var(--clr-border);
`;

const StudentListItem = styled(Box)`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    border-radius: 12px;
`;
