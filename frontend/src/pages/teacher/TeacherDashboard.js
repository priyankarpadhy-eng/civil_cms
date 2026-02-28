import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Divider,
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import TeacherSideBar from './TeacherSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherBatches from './TeacherBatches';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext.js';

// New Feature Imports
import TeacherLessonPlan from './TeacherLessonPlan';
import TeacherMentorship from './TeacherMentorship';
import TeacherLabManagement from './TeacherLabManagement';
import TeacherSurveyCamp from './TeacherSurveyCamp';
import TeacherConsultancy from './TeacherConsultancy';
import TeacherOBE from './TeacherOBE';
import TeacherResearch from './TeacherResearch';
import TeacherIndustry from './TeacherIndustry';
import TeacherFaceAttendance from './TeacherFaceAttendance';

const TeacherDashboard = () => {
    const [open, setOpen] = useState(true);
    const { isDarkMode, toggleTheme } = useTheme();
    const { currentUser } = useSelector(state => state.user);

    return (
        <Box sx={{ display: 'flex', background: 'var(--clr-bg)', minHeight: '100vh' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar open={open} position='fixed' sx={{
                background: 'var(--clr-surface-1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--clr-border)',
                boxShadow: 'none',
            }}>
                <Toolbar sx={{ pr: '24px', gap: 1, minHeight: '64px !important' }}>
                    <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
                        <IconButton
                            edge="start"
                            onClick={() => setOpen(o => !o)}
                            sx={{
                                marginRight: '20px',
                                ...(open && { display: 'none' }),
                                color: 'var(--clr-text-secondary)',
                                borderRadius: '12px',
                                '&:hover': { color: 'var(--clr-primary)', background: 'var(--clr-surface-2)' },
                            }}
                        >
                            <MenuRoundedIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                        <Box sx={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #ec4899, #d946ef)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                        }}>👨‍🏫</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                color: 'var(--clr-text-primary)',
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em',
                            }}>
                                Faculty Portal
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.7rem',
                                color: 'var(--clr-text-muted)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                            }}>
                                Civil Engg. · IGIT Sarang
                            </Typography>
                        </Box>
                    </Box>

                    {/* Teacher name chip */}
                    <Box sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1.5,
                        px: 2, py: 0.8,
                        background: 'var(--clr-surface-2)',
                        border: '1px solid var(--clr-border)',
                        borderRadius: '50px',
                        mr: 2,
                    }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clr-primary)' }}>
                            {currentUser?.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>
                            {currentUser?.teachSubject?.subName || 'Faculty'}
                        </Typography>
                    </Box>

                    <IconButton onClick={toggleTheme} sx={{ color: 'var(--clr-text-secondary)', mr: 1 }}>
                        {isDarkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                    </IconButton>

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    '& .MuiDrawer-paper': {
                        background: 'var(--clr-surface-1)',
                        borderRight: '1px solid var(--clr-border)',
                        overflowX: 'hidden',
                    }
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-end' : 'center',
                    px: 1.5,
                    minHeight: '64px !important',
                }}>
                    <IconButton onClick={() => setOpen(o => !o)} sx={{
                        color: 'var(--clr-text-muted)',
                        borderRadius: '12px',
                        '&:hover': { background: 'var(--clr-surface-2)', color: 'var(--clr-primary)' },
                    }}>
                        <ChevronLeftRoundedIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: 'var(--clr-border)' }} />
                <List component="nav" sx={{ pt: 1 }}>
                    <TeacherSideBar open={open} />
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', background: 'var(--clr-bg)' }}>
                <Toolbar sx={{ minHeight: '64px !important' }} />
                <Box sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: '1600px', mx: 'auto' }}>
                    <Routes>
                        <Route path="/" element={<TeacherHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                        <Route path="/Teacher/profile" element={<TeacherProfile />} />
                        <Route path="/Teacher/complain" element={<TeacherComplain />} />
                        <Route path="/Teacher/batches" element={<TeacherBatches />} />
                        <Route path="/Teacher/batch/:id" element={<TeacherClassDetails />} />
                        <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                        <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                        {/* New Feature Routes */}
                        <Route path="/Teacher/lesson-plan" element={<TeacherLessonPlan />} />
                        <Route path="/Teacher/mentorship" element={<TeacherMentorship />} />
                        <Route path="/Teacher/lab-management" element={<TeacherLabManagement />} />
                        <Route path="/Teacher/survey-camp" element={<TeacherSurveyCamp />} />
                        <Route path="/Teacher/consultancy" element={<TeacherConsultancy />} />
                        <Route path="/Teacher/obe-accreditation" element={<TeacherOBE />} />
                        <Route path="/Teacher/research" element={<TeacherResearch />} />
                        <Route path="/Teacher/industry" element={<TeacherIndustry />} />
                        <Route path="/Teacher/face-attendance" element={<TeacherFaceAttendance />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;