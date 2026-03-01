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
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';

const AddBatch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, response } = useSelector(state => state.user);

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const [batchName, setBatchName] = useState("");
    const [passoutYear, setPassoutYear] = useState("");
    const [batchNumber, setBatchNumber] = useState("");

    const handleNext = () => {
        if (!batchName || !passoutYear || !batchNumber) {
            setMessage("Please fill all identity fields");
            setShowPopup(true);
            return;
        }
        setLoader(true);
        const batchFields = {
            sclass_name: batchName,
            passout_year: passoutYear,
            batch_number: batchNumber,
        };
        dispatch(addStuff(batchFields, "Sclass"));
    };

    useEffect(() => {
        if (status === 'added') {
            setLoader(false);
            setMessage("Batch added successfully!");
            setShowPopup(true);
            setTimeout(() => navigate("/Admin/classes"), 1500);
            dispatch(underControl());
        } else if (status === 'failed' || status === 'error') {
            setMessage(response || "Something went wrong");
            setShowPopup(true);
            setLoader(false);
            dispatch(underControl());
        }
    }, [status, navigate, dispatch, response]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--clr-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <StyledPaper elevation={0}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, margin: '0 auto 20px', background: 'var(--grad-primary)', boxShadow: 'var(--shadow-primary)' }}>
                        <SchoolRounded sx={{ fontSize: '2.5rem' }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight={900} gutterBottom>
                        Initialize Batch
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', maxWidth: 500, margin: '0 auto' }}>
                        Define the academic cohort structure for your department. Students can join this batch during their onboarding process.
                    </Typography>
                </Box>

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
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Verify & Create Batch"}
                    </ActionButton>
                    <Button onClick={() => navigate(-1)} sx={{ fontWeight: 800 }}>Back</Button>
                </Stack>
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
