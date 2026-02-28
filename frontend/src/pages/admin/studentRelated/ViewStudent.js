import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tab,
    Stack,
    Avatar,
    Grid,
    Button,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    CircularProgress,
    TextField,
    MenuItem,
    Divider,
    Switch,
    FormControlLabel
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    getUserDetails,
    updateUser
} from '../../../redux/userRelated/userHandle';
import {
    updateStudentFields
} from '../../../redux/studentRelated/studentHandle';
import {
    getSubjectList
} from '../../../redux/sclassRelated/sclassHandle';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject
} from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import Popup from '../../../components/Popup';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
    AssessmentRounded,
    PersonRounded,
    SchoolRounded,
    BadgeRounded,
    EventAvailableRounded,
    FactCheckRounded,
    KeyboardArrowUpRounded,
    KeyboardArrowDownRounded,
    DeleteOutlineRounded,
    EditRounded,
    SaveRounded,
    SecurityRounded,
    AssignmentIndRounded,
    LaunchRounded,
    WorkspacePremiumRounded,
    SegmentRounded,
    HistoryRounded,
    LanguageRounded
} from '@mui/icons-material';

const ViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, loading } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    const [tabValue, setTabValue] = useState('1');
    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [editMode, setEditMode] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [isBranchRep, setIsBranchRep] = useState(false);
    const [section, setSection] = useState('A');

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails?.sclassName?._id) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails?.sclassName?._id]);

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setIsBranchRep(userDetails.isBranchRep || false);
            setSection(userDetails.section || 'A');
        }
    }, [userDetails]);

    const handleTabChange = (event, newValue) => setTabValue(newValue);
    const toggleRow = (subId) => setOpenStates(prev => ({ ...prev, [subId]: !prev[subId] }));

    const submitHandler = async (e) => {
        e.preventDefault();
        const fields = password === "" ? { name, rollNum, isBranchRep, section } : { name, rollNum, password, isBranchRep, section };
        try {
            await dispatch(updateUser(fields, studentID, address));
            dispatch(getUserDetails(studentID, address));
            setMessage("Student profile updated successfully");
            setShowPopup(true);
            setEditMode(false);
            setPassword("");
        } catch (err) {
            setMessage("Update failed");
            setShowPopup(true);
        }
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => dispatch(getUserDetails(studentID, address)));
    };

    const overallAttendance = calculateOverallAttendancePercentage(userDetails?.attendance || []);

    const subjectAttendanceData = userDetails?.attendance ? groupAttendanceBySubject(userDetails.attendance) : {};

    const barChartData = Object.entries(subjectAttendanceData).map(([subName, { present, sessions }]) => ({
        subject: subName,
        attendancePercentage: calculateSubjectAttendancePercentage(present, sessions)
    }));

    const pieChartData = [
        { name: 'Present', value: overallAttendance },
        { name: 'Absent', value: 100 - overallAttendance }
    ];

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress size={60} thickness={4} />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: 'var(--clr-bg)', minHeight: '100vh', pb: 10 }}>
            {/* Header Section */}
            <ProfileHeader>
                <Container maxWidth="xl">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                            <Avatar
                                src={userDetails?.profilePic}
                                sx={{ width: 140, height: 140, border: '6px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                            >
                                {userDetails?.name?.[0]}
                            </Avatar>
                        </motion.div>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Stack direction="row" alignItems="center" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Typography variant="h2" fontWeight={900} sx={{ color: 'white', letterSpacing: '-1.5px' }}>
                                    {userDetails?.name}
                                </Typography>
                                {userDetails?.isBranchRep && (
                                    <Tooltip title="Branch Representative">
                                        <WorkspacePremiumRounded sx={{ color: '#fbbf24', fontSize: '2.5rem' }} />
                                    </Tooltip>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Chip icon={<BadgeRounded sx={{ color: 'white !important' }} />} label={`Roll: ${userDetails?.rollNum}`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800 }} />
                                <Chip icon={<SchoolRounded sx={{ color: 'white !important' }} />} label={userDetails?.sclassName?.sclassName} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800 }} />
                                <Chip icon={<SegmentRounded sx={{ color: 'white !important' }} />} label={`Section ${userDetails?.section || 'A'}`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800 }} />
                            </Stack>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={editMode ? <SaveRounded /> : <EditRounded />}
                                onClick={editMode ? submitHandler : () => setEditMode(true)}
                                sx={{ bgcolor: 'white', color: 'var(--clr-primary)', fontWeight: 900, borderRadius: '14px', px: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                            >
                                {editMode ? "Save Changes" : "Edit Profile"}
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </ProfileHeader>

            <Container maxWidth="xl" sx={{ mt: -6 }}>
                <TabContext value={tabValue}>
                    <Paper elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-xl)' }}>
                        <Box sx={{ px: 4, pt: 3, bgcolor: 'white', borderBottom: '1px solid var(--clr-border)' }}>
                            <TabList onChange={handleTabChange} sx={{ '& .MuiTabs-indicator': { height: 4, borderRadius: '4px' } }}>
                                <StyledTab icon={<PersonRounded />} label="Profile Overview" value="1" />
                                <StyledTab icon={<EventAvailableRounded />} label="Attendance Insight" value="2" />
                                <StyledTab icon={<FactCheckRounded />} label="Academic Progress" value="3" />
                            </TabList>
                        </Box>

                        {/* TAB 1: PROFILE */}
                        <TabPanel value="1" sx={{ p: 0 }}>
                            <Grid container>
                                <Grid item xs={12} md={7} sx={{ p: 4, borderRight: '1px solid var(--clr-border)' }}>
                                    <SectionHeader><AssignmentIndRounded /> Core Information</SectionHeader>
                                    <form onSubmit={submitHandler}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledField
                                                    fullWidth label="Full Name"
                                                    value={name} onChange={e => setName(e.target.value)}
                                                    disabled={!editMode} variant="filled"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledField
                                                    fullWidth label="Roll Number"
                                                    value={rollNum} onChange={e => setRollNum(e.target.value)}
                                                    disabled={!editMode} variant="filled"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledField
                                                    select fullWidth label="Assigned Section"
                                                    value={section} onChange={e => setSection(e.target.value)}
                                                    disabled={!editMode} variant="filled"
                                                >
                                                    <MenuItem value="A">Section A</MenuItem>
                                                    <MenuItem value="B">Section B</MenuItem>
                                                </StyledField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledField
                                                    fullWidth label="Update Password" type="password"
                                                    value={password} onChange={e => setPassword(e.target.value)}
                                                    placeholder="Keep empty to stay same"
                                                    disabled={!editMode} variant="filled"
                                                />
                                            </Grid>
                                        </Grid>
                                    </form>

                                    <Divider sx={{ my: 4 }} />

                                    <SectionHeader><SecurityRounded /> Access Control</SectionHeader>
                                    <Paper sx={{ p: 3, bgcolor: 'var(--clr-surface-2)', borderRadius: '20px', border: '1px solid var(--clr-border)' }}>
                                        <FormControlLabel
                                            control={<Switch checked={isBranchRep} onChange={e => setIsBranchRep(e.target.checked)} disabled={!editMode} />}
                                            label={<Typography fontWeight={800}>Grant Branch Representative Privileges</Typography>}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 6 }}>
                                            Enabling this allows the student to manage batch-wide announcements and coordination tasks.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={5} sx={{ p: 4, bgcolor: 'var(--clr-surface-1)' }}>
                                    <SectionHeader><AssessmentRounded /> Snapshot</SectionHeader>
                                    <Stack spacing={3}>
                                        <MetricCard bg="rgba(16, 185, 129, 0.1)" color="#10b981">
                                            <Box>
                                                <Typography variant="h3" fontWeight={900}>{overallAttendance.toFixed(1)}%</Typography>
                                                <Typography variant="body2" fontWeight={800}>Global Attendance</Typography>
                                            </Box>
                                            <Box sx={{ width: 80 }}>
                                                <CustomPieChart data={pieChartData} />
                                            </Box>
                                        </MetricCard>

                                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--clr-border)' }}>
                                            <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2 }}>INSTITUTIONAL IDENTITY</Typography>
                                            <DetailItem label="Batch" value={userDetails?.sclassName?.sclassName} />
                                            <DetailItem label="School" value={userDetails?.school?.schoolName} />
                                            <Divider sx={{ my: 1.5 }} />
                                            <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1, color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LanguageRounded fontSize="small" /> DIGITAL PORTFOLIO
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="a"
                                                href={`${window.location.protocol}//${userDetails?.portfolioSlug}.${window.location.hostname.replace('www.', '')}`}
                                                target="_blank"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: 'var(--clr-primary)',
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {userDetails?.portfolioSlug}.{window.location.hostname.replace('www.', '')}
                                                <LaunchRounded sx={{ fontSize: '0.8rem', ml: 0.5 }} />
                                            </Typography>
                                        </Paper>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* TAB 2: ATTENDANCE */}
                        <TabPanel value="2" sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} lg={4}>
                                    <SectionHeader><AssessmentRounded /> Attendance Analytics</SectionHeader>
                                    <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid var(--clr-border)', height: '400px' }}>
                                        <CustomBarChart chartData={barChartData} dataKey="attendancePercentage" />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} lg={8}>
                                    <SectionHeader><HistoryRounded /> Detailed Subject Log</SectionHeader>
                                    <TableContainerStyled>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 900 }}>SUBJECT</TableCell>
                                                    <TableCell sx={{ fontWeight: 900 }}>PRESENT</TableCell>
                                                    <TableCell sx={{ fontWeight: 900 }}>TOTAL</TableCell>
                                                    <TableCell sx={{ fontWeight: 900 }}>PERCENTAGE</TableCell>
                                                    <TableCell sx={{ fontWeight: 900 }} align="center">HISTORY</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.entries(subjectAttendanceData).map(([subName, { present, sessions, subId, allData }]) => (
                                                    <React.Fragment key={subId}>
                                                        <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                                            <TableCell sx={{ fontWeight: 700 }}>{subName}</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, color: 'var(--clr-primary)' }}>{present}</TableCell>
                                                            <TableCell fontWeight={700}>{sessions}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={`${calculateSubjectAttendancePercentage(present, sessions)}%`}
                                                                    sx={{ fontWeight: 900, fontSize: '0.8rem', bgcolor: calculateSubjectAttendancePercentage(present, sessions) > 75 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: calculateSubjectAttendancePercentage(present, sessions) > 75 ? '#10b981' : '#ef4444' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton onClick={() => toggleRow(subId)}>
                                                                    {openStates[subId] ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={5} sx={{ p: 0, borderBottom: 'none' }}>
                                                                <Collapse in={openStates[subId]}>
                                                                    <Box sx={{ p: 3, bgcolor: 'var(--clr-surface-2)', mx: 2, mb: 2, borderRadius: '16px' }}>
                                                                        <Table size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 800 }} align="right">Status</TableCell>
                                                                                    <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {allData.map((entry, i) => (
                                                                                    <TableRow key={i}>
                                                                                        <TableCell sx={{ fontWeight: 600 }}>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                                                                        <TableCell align="right">
                                                                                            <Chip label={entry.status} size="small" color={entry.status === 'Present' ? 'success' : 'error'} variant="outlined" sx={{ fontWeight: 800 }} />
                                                                                        </TableCell>
                                                                                        <TableCell align="right">
                                                                                            <IconButton size="small" color="error" onClick={() => removeSubAttendance(subId)}>
                                                                                                <DeleteOutlineRounded fontSize="small" />
                                                                                            </IconButton>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </Box>
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainerStyled>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* TAB 3: MARKS */}
                        <TabPanel value="3" sx={{ p: 4 }}>
                            {userDetails?.examResult?.length > 0 ? (
                                <Grid container spacing={4}>
                                    <Grid item xs={12} lg={4}>
                                        <SectionHeader><AssessmentRounded /> Score Analytics</SectionHeader>
                                        <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid var(--clr-border)', height: '400px' }}>
                                            <CustomBarChart chartData={userDetails.examResult} dataKey="marksObtained" />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={8}>
                                        <SectionHeader><HistoryRounded /> Transcripts</SectionHeader>
                                        <TableContainerStyled>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 900 }}>SUBJECT</TableCell>
                                                        <TableCell sx={{ fontWeight: 900 }}>MARKS OBTAINED</TableCell>
                                                        <TableCell sx={{ fontWeight: 900 }}>PERFORMANCE</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {userDetails.examResult.map((result, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell sx={{ fontWeight: 700 }}>{result?.subName?.subName}</TableCell>
                                                            <TableCell sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{result?.marksObtained}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={result?.marksObtained > 40 ? "QUALIFIED" : "RETAKE"}
                                                                    color={result?.marksObtained > 40 ? "success" : "warning"}
                                                                    sx={{ fontWeight: 900 }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainerStyled>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 10 }}>
                                    <FactCheckRounded sx={{ fontSize: '5rem', opacity: 0.1, mb: 2 }} />
                                    <Typography variant="h5" fontWeight={800}>No academic records found</Typography>
                                    <Button sx={{ mt: 2 }} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>Upload Transcripts</Button>
                                </Box>
                            )}
                        </TabPanel>
                    </Paper>
                </TabContext>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ViewStudent;

/* Styled Components */

const ProfileHeader = styled(Box)`
    background: var(--grad-primary);
    padding: 100px 0 140px 0;
`;

const StyledTab = styled(Tab)`
    min-height: 70px !important;
    font-weight: 800 !important;
    text-transform: none !important;
    font-size: 1rem !important;
    gap: 12px;
    &.Mui-selected { color: var(--clr-primary) !important; }
`;

const SectionHeader = styled(Typography)`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 900;
    font-size: 1.2rem;
    color: var(--clr-text-primary);
    margin-bottom: 24px;
    svg { color: var(--clr-primary); }
`;

const StyledField = styled(TextField)`
    .MuiFilledInput-root {
        border-radius: 16px !important;
        background: var(--clr-surface-2) !important;
        &::before, &::after { display: none; }
        &.Mui-disabled { opacity: 0.8; }
        &:hover:not(.Mui-disabled) { background: var(--clr-surface-1) !important; box-shadow: inset 0 0 0 1px var(--clr-border); }
        &.Mui-focused { background: white !important; box-shadow: 0 0 0 4px var(--clr-primary-glow); }
    }
`;

const MetricCard = styled(Box)`
    padding: 32px;
    background: ${props => props.bg};
    color: ${props => props.color};
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const DetailItem = ({ label, value }) => (
    <Box sx={{ pb: 1.5, mb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', '&:last-child': { borderBottom: 'none' } }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase' }}>{label}</Typography>
        <Typography variant="body1" fontWeight={700}>{value || 'Not Specified'}</Typography>
    </Box>
);

const TableContainerStyled = styled(Box)`
    border: 1px solid var(--clr-border);
    border-radius: 20px;
    overflow: hidden;
    background: white;
`;