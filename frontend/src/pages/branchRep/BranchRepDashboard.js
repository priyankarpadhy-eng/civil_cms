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
import BranchRepSideBar from './BranchRepSideBar';
import BranchRepHomePage from './BranchRepHomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentProfile from '../student/StudentProfile';
import StudentSubjects from '../student/StudentSubjects';
import ViewStdAttendance from '../student/ViewStdAttendance';
import StudentComplain from '../student/StudentComplain';
import Logout from '../Logout';

// Enhanced ERP Components
import StudentRegistration from '../student/StudentRegistration';
import StudentAcademics from '../student/StudentAcademics';
import StudentFeesHostel from '../student/StudentFeesHostel';
import StudentPlacement from '../student/StudentPlacement';
import StudentAlumni from '../student/StudentAlumni';

import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';

const BranchRepDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex', background: 'var(--clr-bg)', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar open={open} position='fixed' sx={{
                background: 'rgba(18,18,42,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
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
                                borderRadius: '10px',
                                '&:hover': {
                                    color: 'var(--clr-primary-light)',
                                    background: 'rgba(108,99,255,0.1)',
                                },
                            }}
                        >
                            <MenuRoundedIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                        <Box sx={{
                            width: 34, height: 34,
                            background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(168,85,247,0.35)',
                        }}>👑</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                color: 'var(--clr-text-primary)',
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em',
                            }}>
                                Branch Representative Portal
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.68rem',
                                color: 'var(--clr-text-muted)',
                                fontWeight: 500,
                            }}>
                                Civil Engg. · IGIT Sarang
                            </Typography>
                        </Box>
                    </Box>

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
                        borderRight: '1px solid rgba(255,255,255,0.07)',
                        overflowX: 'hidden',
                    }
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-end' : 'center',
                    px: 1,
                    minHeight: '64px !important',
                }}>
                    <IconButton onClick={toggleDrawer} sx={{
                        color: 'var(--clr-text-muted)',
                        borderRadius: '10px',
                        '&:hover': {
                            background: 'rgba(108,99,255,0.1)',
                            color: 'var(--clr-primary-light)',
                        },
                    }}>
                        <ChevronLeftRoundedIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
                <List component="nav" sx={{ pt: 1 }}>
                    <BranchRepSideBar open={open} />
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
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Routes>
                        <Route path="/" element={<BranchRepHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/BranchRep/dashboard" element={<BranchRepHomePage />} />
                        <Route path="/BranchRep/profile" element={<StudentProfile />} />
                        <Route path="/BranchRep/subjects" element={<StudentSubjects />} />
                        <Route path="/BranchRep/attendance" element={<ViewStdAttendance />} />
                        <Route path="/BranchRep/complain" element={<StudentComplain />} />

                        <Route path="/BranchRep/registration" element={<StudentRegistration />} />
                        <Route path="/BranchRep/academics" element={<StudentAcademics />} />
                        <Route path="/BranchRep/fees-hostel" element={<StudentFeesHostel />} />
                        <Route path="/BranchRep/placement" element={<StudentPlacement />} />
                        <Route path="/BranchRep/alumni" element={<StudentAlumni />} />

                        {/* Representative Specific Routes (Placeholders) */}
                        <Route path="/BranchRep/students" element={<div>Section Students List (TBD)</div>} />
                        <Route path="/BranchRep/section-attendance" element={<div>Section Attendance (TBD)</div>} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default BranchRepDashboard;
