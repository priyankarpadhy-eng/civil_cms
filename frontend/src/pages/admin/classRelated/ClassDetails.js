import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
    Box,
    Container,
    Typography,
    Tab,
    IconButton,
    Paper,
    Stack,
    Divider,
    Avatar,
    Grid,
    Tooltip,
    Breadcrumbs,
    Link as MuiLink,
    Chip,
    CircularProgress
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
    InfoRounded,
    BookRounded,
    GroupsRounded,
    SupervisorAccountRounded,
    StarRounded,
    PersonAddAlt1Rounded,
    PostAddRounded,
    DeleteOutlineRounded,
    ArrowBackIosNewRounded,
    SchoolRounded,
    CalendarTodayRounded,
    FormatListNumberedRounded,
    EmailRounded,
    PhoneRounded
} from '@mui/icons-material';
import { BlueButton, GreenButton, PurpleButton, RedButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { motion } from "framer-motion";

const ClassDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id;
    const [value, setValue] = useState('1');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const deleteHandler = (deleteID, address) => {
        setMessage("Deletion restricted from this view. Please use the main batch list or contact super admin.");
        setShowPopup(true);
    };

    // Table Data preparation
    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ];

    const subjectRows = subjectsList?.map((subject) => ({
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
    })) || [];

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const subjectActions = [
        { icon: <PostAddRounded color="primary" />, name: 'Add Subject', action: () => navigate("/Admin/addsubject/" + classID) },
        { icon: <DeleteOutlineRounded color="error" />, name: 'Delete All', action: () => deleteHandler(classID, "SubjectsClass") }
    ];

    const studentActions = [
        { icon: <PersonAddAlt1Rounded color="primary" />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + classID) },
        { icon: <DeleteOutlineRounded color="error" />, name: 'Delete All', action: () => deleteHandler(classID, "StudentsClass") },
    ];

    const SubjectActions = ({ row }) => (
        <Stack direction="row" spacing={1}>
            <BlueButton variant="contained" size="small" onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}>
                Details
            </BlueButton>
            <IconButton size="small" onClick={() => deleteHandler(row.id, "Subject")} color="error">
                <DeleteOutlineRounded fontSize="small" />
            </IconButton>
        </Stack>
    );

    const StudentActions = ({ row }) => (
        <Stack direction="row" spacing={1}>
            <BlueButton variant="contained" size="small" onClick={() => navigate("/Admin/students/student/" + row.id)}>
                Profile
            </BlueButton>
            <PurpleButton variant="contained" size="small" onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}>
                Attendance
            </PurpleButton>
            <IconButton size="small" onClick={() => deleteHandler(row.id, "Student")} color="error">
                <DeleteOutlineRounded fontSize="small" />
            </IconButton>
        </Stack>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                        <MuiLink component="button" variant="body2" onClick={() => navigate("/Admin/classes")} sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ArrowBackIosNewRounded sx={{ fontSize: '0.75rem' }} /> Batches
                        </MuiLink>
                        <Typography color="text.primary" variant="body2" fontWeight={700}>
                            {sclassDetails?.sclassName || "Class Details"}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" fontWeight={900}>{sclassDetails?.sclassName}</Typography>
                </Box>
                <GreenButton variant="contained" startIcon={<PostAddRounded />} onClick={() => navigate("/Admin/addsubject/" + classID)}>
                    Add Curriculum
                </GreenButton>
            </Box>

            <TabContext value={value}>
                <StyledPaper>
                    <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ px: 2, pt: 1, borderBottom: '1px solid var(--clr-border)' }}
                    >
                        <Tab icon={<InfoRounded />} iconPosition="start" label="Overview" value="1" />
                        <Tab icon={<BookRounded />} iconPosition="start" label="Curriculum" value="2" />
                        <Tab icon={<GroupsRounded />} iconPosition="start" label="Enrolled Students" value="3" />
                        <Tab icon={<SupervisorAccountRounded />} iconPosition="start" label="Faculty" value="4" />
                        <Tab icon={<StarRounded />} iconPosition="start" label="Representatives" value="5" />
                    </TabList>

                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <TabPanel value="1" sx={{ p: 0 }}>
                                    <OverviewHeader>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <BatchStatsCard>
                                                    <Typography variant="h6" fontWeight={800} gutterBottom>Core Information</Typography>
                                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ color: 'var(--clr-text-muted)', fontWeight: 600 }}>Academic Name</Typography>
                                                            <Typography fontWeight={800}>{sclassDetails?.sclassName}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ color: 'var(--clr-text-muted)', fontWeight: 600 }}>Passout Cohort</Typography>
                                                            <Chip size="small" icon={<CalendarTodayRounded sx={{ fontSize: '0.8rem !important' }} />} label={sclassDetails?.passoutYear} />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ color: 'var(--clr-text-muted)', fontWeight: 600 }}>Batch Reference</Typography>
                                                            <Typography fontWeight={800}>{sclassDetails?.batchNumber}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ color: 'var(--clr-text-muted)', fontWeight: 600 }}>Sections Active</Typography>
                                                            <Stack direction="row" spacing={1}>
                                                                {sclassDetails?.sections?.map(s => <Chip key={s} size="small" label={s} />)}
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                </BatchStatsCard>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <MetricCard>
                                                            <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)' }}><GroupsRounded /></Avatar>
                                                            <Box>
                                                                <Typography variant="h4" fontWeight={900}>{sclassStudents.length}</Typography>
                                                                <Typography variant="caption" fontWeight={700} color="text.secondary">Total Students</Typography>
                                                            </Box>
                                                        </MetricCard>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <MetricCard>
                                                            <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><BookRounded /></Avatar>
                                                            <Box>
                                                                <Typography variant="h4" fontWeight={900}>{subjectsList.length}</Typography>
                                                                <Typography variant="caption" fontWeight={700} color="text.secondary">Subjects Taught</Typography>
                                                            </Box>
                                                        </MetricCard>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <GlassPaper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <SchoolRounded color="primary" />
                                                            <Typography variant="body2" fontWeight={600}>
                                                                Academic session is currently active for this batch under {sclassDetails?.school?.schoolName || "IGIT Sarang"}.
                                                            </Typography>
                                                        </GlassPaper>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </OverviewHeader>
                                </TabPanel>

                                <TabPanel value="2" sx={{ p: 0 }}>
                                    <TableTemplate buttonHaver={SubjectActions} columns={subjectColumns} rows={subjectRows} />
                                    <SpeedDialTemplate actions={subjectActions} />
                                </TabPanel>

                                <TabPanel value="3" sx={{ p: 0 }}>
                                    <TableTemplate buttonHaver={StudentActions} columns={studentColumns} rows={studentRows} />
                                    <SpeedDialTemplate actions={studentActions} />
                                </TabPanel>

                                <TabPanel value="4" sx={{ p: 0 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, opacity: 0.5 }}>
                                        <SupervisorAccountRounded sx={{ fontSize: '4rem', mb: 2 }} />
                                        <Typography variant="h6" fontWeight={800}>Faculty Assignments</Typography>
                                        <Typography variant="body2">View teaching assignments in the Teachers module.</Typography>
                                    </Box>
                                </TabPanel>

                                <TabPanel value="5" sx={{ p: 0 }}>
                                    <Grid container spacing={3}>
                                        {['A', 'B'].map(sec => {
                                            const reps = sclassStudents.filter(s => s.isBranchRep && (s.section === sec || (sec === 'A' && !s.section)));
                                            return (
                                                <Grid item xs={12} md={6} key={sec}>
                                                    <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--clr-border)', minHeight: 200 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                                            <Typography variant="h6" fontWeight={800}>Section {sec} Reps</Typography>
                                                            <Chip label="Representative" color="primary" size="small" />
                                                        </Box>
                                                        {reps.length > 0 ? (
                                                            <Stack spacing={2}>
                                                                {reps.map(rep => (
                                                                    <RepItem key={rep._id} onClick={() => navigate("/Admin/students/student/" + rep._id)}>
                                                                        <Avatar src={rep.profilePic} />
                                                                        <Box sx={{ flex: 1 }}>
                                                                            <Typography fontWeight={700}>{rep.name}</Typography>
                                                                            <Typography variant="caption" color="text.secondary">Roll: {rep.rollNum}</Typography>
                                                                        </Box>
                                                                        <IconButton size="small"><ArrowBackIosNewRounded sx={{ fontSize: '0.8rem', transform: 'rotate(180deg)' }} /></IconButton>
                                                                    </RepItem>
                                                                ))}
                                                            </Stack>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                No representatives assigned for Section {sec}
                                                            </Typography>
                                                        )}
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </TabPanel>
                            </>
                        )}
                    </Box>
                </StyledPaper>
            </TabContext>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ClassDetails;

/* --- Styled Components --- */

const StyledPaper = styled(Paper)`
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 28px !important;
    overflow: hidden;
    box-shadow: var(--shadow-sm) !important;
`;

const OverviewHeader = styled(Box)`
    padding-top: 10px;
`;

const BatchStatsCard = styled(Box)`
    padding: 24px;
    background: var(--clr-surface-2);
    border-radius: 24px;
    border: 1px solid var(--clr-border);
`;

const MetricCard = styled(Paper)`
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: 24px !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: none !important;
    background: var(--clr-surface-1) !important;
`;

const GlassPaper = styled(Box)`
    background: rgba(99, 102, 241, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.1);
    border-radius: 16px;
    color: var(--clr-text-primary);
`;

const RepItem = styled(Box)`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--clr-bg);
    border: 1px solid var(--clr-border);
    
    &:hover {
        background: var(--clr-surface-2);
        border-color: var(--clr-primary);
        transform: translateX(4px);
    }
`;
