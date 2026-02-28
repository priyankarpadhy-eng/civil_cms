import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    CircularProgress,
    Paper,
    IconButton,
    Stack,
    Divider,
    Avatar,
    Tooltip
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
    PostAddRounded,
    DeleteOutlineRounded,
    ArrowBackRounded,
    MenuBookRounded,
    SaveRounded,
    AddCircleOutlineRounded
} from '@mui/icons-material';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { status, currentUser, response } = useSelector(state => state.user);
    const { sclassDetails } = useSelector(state => state.sclass);

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSubjectChange = (index, field) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index][field] = event.target.value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        const fields = {
            sclassName,
            subjects: subjects.map((s) => ({ ...s, sessions: s.sessions || 0 })),
            adminID,
        };
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'failed' || status === 'error') {
            setMessage(response || "Operation failed");
            setShowPopup(true);
            setLoader(false);
            dispatch(underControl());
        }
    }, [status, navigate, response, dispatch]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--clr-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', maxWidth: 850 }}>
                <StyledPaper elevation={0}>
                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'var(--clr-surface-2)' }}>
                            <ArrowBackRounded />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>Batch <Typography component="span" variant="inherit" color="primary">Curriculum</Typography></Typography>
                            <Typography variant="body2" color="text.secondary">Define core subjects for {sclassDetails?.sclassName || "the current batch"}.</Typography>
                        </Box>
                    </Box>

                    <form onSubmit={submitHandler}>
                        <AnimatePresence mode="popLayout">
                            {subjects.map((subject, index) => (
                                <SubjectRow
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 44, height: 44, fontWeight: 800 }}>
                                        {index + 1}
                                    </Avatar>
                                    <Grid container spacing={2} sx={{ flex: 1 }}>
                                        <Grid item xs={12} sm={5}>
                                            <StyledTextField
                                                fullWidth
                                                label="Subject Name"
                                                placeholder="e.g. Structural Analysis"
                                                value={subject.subName}
                                                onChange={handleSubjectChange(index, 'subName')}
                                                required
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <StyledTextField
                                                fullWidth
                                                label="Sub Code"
                                                placeholder="CE-301"
                                                value={subject.subCode}
                                                onChange={handleSubjectChange(index, 'subCode')}
                                                required
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
                                            <StyledTextField
                                                fullWidth
                                                label="Lectures"
                                                type="number"
                                                placeholder="40"
                                                value={subject.sessions}
                                                onChange={handleSubjectChange(index, 'sessions')}
                                                required
                                                variant="filled"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {subjects.length > 1 && (
                                                <Tooltip title="Remove Subject">
                                                    <IconButton color="error" onClick={() => handleRemoveSubject(index)} sx={{ bgcolor: 'rgba(244, 63, 94, 0.05)' }}>
                                                        <DeleteOutlineRounded />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Grid>
                                </SubjectRow>
                            ))}
                        </AnimatePresence>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                startIcon={<AddCircleOutlineRounded />}
                                onClick={handleAddSubject}
                                sx={{ color: 'var(--clr-primary)', fontWeight: 800, borderRadius: '12px' }}
                            >
                                Add Another Subject
                            </Button>

                            <SaveButton
                                type="submit"
                                disabled={loader}
                                variant="contained"
                                startIcon={<SaveRounded />}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : 'Finalize Curriculum'}
                            </SaveButton>
                        </Box>
                    </form>
                </StyledPaper>
            </motion.div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default SubjectForm;

const StyledPaper = styled(Paper)`
    padding: 48px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 36px !important;
    box-shadow: var(--shadow-xl) !important;
    @media (max-width: 600px) { padding: 24px; }
`;

const SubjectRow = styled(motion.div)`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: var(--clr-surface-2);
    border-radius: 20px;
    border: 1px solid var(--clr-border);
    margin-bottom: 24px;
`;

const StyledTextField = styled(TextField)`
    .MuiFilledInput-root {
        border-radius: 14px !important;
        background: var(--clr-surface-1) !important;
        border: 1px solid transparent;
        transition: all 0.2s;
        &::before, &::after { display: none; }
        &:hover { background: var(--clr-surface-1) !important; border-color: var(--clr-border); }
        &.Mui-focused { border-color: var(--clr-primary); box-shadow: 0 0 0 3px var(--clr-primary-glow); }
    }
`;

const SaveButton = styled(Button)`
    height: 52px !important;
    padding: 0 32px !important;
    border-radius: 16px !important;
    font-weight: 900 !important;
    text-transform: none !important;
    background: var(--grad-primary) !important;
    box-shadow: var(--shadow-primary) !important;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4) !important;
    }
`;