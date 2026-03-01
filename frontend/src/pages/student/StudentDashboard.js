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
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout';
import { useTheme } from '../../context/ThemeContext.js';

// Enhanced ERP Components
import StudentRegistration from './StudentRegistration';
import StudentAcademics from './StudentAcademics';
import StudentFeesHostel from './StudentFeesHostel';
import StudentPlacement from './StudentPlacement';
import StudentAlumni from './StudentAlumni';
import CdcAdminTP from './CdcAdminTP';
import CdcCompanyList from './CdcCompanyList';

import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const { isDarkMode, toggleTheme } = useTheme();
    const toggleDrawer = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex', background: 'var(--clr-bg)', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar open={open} position='fixed' sx={{
                background: 'var(--clr-surface-1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--clr-border)',
                boxShadow: 'none',
            }}>
                <Toolbar sx={{ pr: '24px', gap: 1, minHeight: '64px !important' }}>
                    <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"} placement="bottom">
                        <IconButton
                            edge="start"
                            onClick={toggleDrawer}
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
                            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        }}>🎓</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                color: 'var(--clr-text-primary)',
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em',
                            }}>
                                Student Portal
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

                    <IconButton onClick={toggleTheme} sx={{ color: 'var(--clr-text-secondary)', mr: 1 }}>
                        {isDarkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                    </IconButton>

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
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
                    <IconButton onClick={toggleDrawer} sx={{
                        color: 'var(--clr-text-muted)',
                        borderRadius: '12px',
                        '&:hover': { background: 'var(--clr-surface-2)', color: 'var(--clr-primary)' },
                    }}>
                        <ChevronLeftRoundedIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: 'var(--clr-border)' }} />
                <List component="nav" sx={{ pt: 1 }}>
                    <StudentSideBar open={open} />
                </List>
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    background: 'var(--clr-bg)',
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important' }} />
                <Box sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: '1600px', mx: 'auto' }}>
                    <Routes>
                        <Route path="/" element={<StudentHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Student/dashboard" element={<StudentHomePage />} />
                        <Route path="/Student/profile" element={<StudentProfile />} />
                        <Route path="/Student/subjects" element={<StudentSubjects />} />
                        <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                        <Route path="/Student/complain" element={<StudentComplain />} />

                        <Route path="/Student/registration" element={<StudentRegistration />} />
                        <Route path="/Student/academics" element={<StudentAcademics />} />
                        <Route path="/Student/fees-hostel" element={<StudentFeesHostel />} />
                        <Route path="/Student/placement" element={<StudentPlacement />} />
                        <Route path="/Student/alumni" element={<StudentAlumni />} />
                        <Route path="/Student/placement-admin" element={<CdcAdminTP />} />
                        <Route path="/Student/companies" element={<CdcCompanyList />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default StudentDashboard;