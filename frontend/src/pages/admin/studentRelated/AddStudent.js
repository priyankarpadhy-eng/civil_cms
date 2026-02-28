import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    Avatar,
    Stack,
    Grid,
    IconButton
} from '@mui/material';
import {
    PersonAddAlt1Rounded,
    ArrowBackRounded,
    SchoolRounded,
    BadgeRounded,
    KeyRounded,
    ClassRounded,
    SegmentRounded
} from '@mui/icons-material';
import styled from "styled-components";
import { motion } from "framer-motion";

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { status, currentUser, response } = useSelector(state => state.user);
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [section, setSection] = useState('A');
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const adminID = currentUser._id;
    const role = "Student";

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const submitHandler = (event) => {
        event.preventDefault();
        if (sclassName === "") {
            setMessage("Please select a target class");
            setShowPopup(true);
            return;
        }
        setLoader(true);
        const fields = { name, rollNum, password, sclassName, adminID, role, attendance: [], section };
        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed' || status === 'error') {
            setMessage(response || "Process failed");
            setShowPopup(true);
            setLoader(false);
            dispatch(underControl());
        }
    }, [status, navigate, response, dispatch]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--clr-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: 700 }}
            >
                <StyledPaper elevation={0}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'var(--clr-surface-2)' }}>
                            <ArrowBackRounded />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>Enroll <Typography component="span" variant="inherit" color="primary">Student</Typography></Typography>
                            <Typography variant="body2" color="text.secondary">Create a new academic record for your institution.</Typography>
                        </Box>
                    </Box>

                    <form onSubmit={submitHandler}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <SectionLabel>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 32, height: 32 }}>
                                        <BadgeRounded sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                    Personal Details
                                </SectionLabel>
                                <StyledTextField
                                    fullWidth
                                    label="Full Legal Name"
                                    placeholder="e.g. Priyankar Padhy"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    variant="filled"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SectionLabel>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 32, height: 32 }}>
                                        <ClassRounded sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                    Academic Class
                                </SectionLabel>
                                {situation === "Student" ? (
                                    <StyledTextField
                                        select
                                        fullWidth
                                        label="Select Class"
                                        value={sclassName}
                                        onChange={(e) => setSclassName(e.target.value)}
                                        required
                                        variant="filled"
                                    >
                                        <MenuItem value="">Choose a Batch</MenuItem>
                                        {sclassesList.map((item) => (
                                            <MenuItem key={item._id} value={item._id}>{item.sclassName}</MenuItem>
                                        ))}
                                    </StyledTextField>
                                ) : (
                                    <StyledTextField
                                        fullWidth
                                        label="Assigned Class"
                                        value={sclassesList.find(c => c._id === sclassName)?.sclassName || "Loading..."}
                                        disabled
                                        variant="filled"
                                    />
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SectionLabel>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 32, height: 32 }}>
                                        <SegmentRounded sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                    Active Section
                                </SectionLabel>
                                <StyledTextField
                                    select
                                    fullWidth
                                    label="Select Section"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    required
                                    variant="filled"
                                >
                                    <MenuItem value="A">Section A (Default)</MenuItem>
                                    <MenuItem value="B">Section B</MenuItem>
                                </StyledTextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SectionLabel>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 32, height: 32 }}>
                                        <SchoolRounded sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                    Roll Index
                                </SectionLabel>
                                <StyledTextField
                                    fullWidth
                                    type="number"
                                    label="Roll Number"
                                    placeholder="e.g. 101"
                                    value={rollNum}
                                    onChange={(e) => setRollNum(e.target.value)}
                                    required
                                    variant="filled"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SectionLabel>
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 32, height: 32 }}>
                                        <KeyRounded sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                    Credentials
                                </SectionLabel>
                                <StyledTextField
                                    fullWidth
                                    type="password"
                                    label="Portal Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    variant="filled"
                                    autoComplete="new-password"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ pt: 2 }}>
                                    <EnrollButton
                                        type="submit"
                                        fullWidth
                                        disabled={loader}
                                        variant="contained"
                                    >
                                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Finalize Enrollment'}
                                    </EnrollButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </StyledPaper>
            </motion.div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
}

export default AddStudent;

const StyledPaper = styled(Paper)`
    padding: 48px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 36px !important;
    box-shadow: var(--shadow-xl) !important;

    @media (max-width: 600px) {
        padding: 24px;
    }
`;

const SectionLabel = styled(Typography)`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--clr-text-primary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

const EnrollButton = styled(Button)`
    height: 60px !important;
    border-radius: 20px !important;
    font-weight: 900 !important;
    font-size: 1.1rem !important;
    text-transform: none !important;
    background: var(--grad-primary) !important;
    box-shadow: var(--shadow-primary) !important;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 25px rgba(99, 102, 241, 0.4) !important;
    }
`;