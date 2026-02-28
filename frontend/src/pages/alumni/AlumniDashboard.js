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
import AlumniSideBar from './AlumniSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import AlumniHomePage from './AlumniHomePage';
import AlumniProfile from './AlumniProfile';
import Logout from '../Logout';
import { useTheme } from '../../context/ThemeContext.js';

import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';

const AlumniDashboard = () => {
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
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
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
                                Alumni Portal
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
                    <AlumniSideBar open={open} />
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
                        <Route path="/" element={<AlumniHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Alumni/dashboard" element={<AlumniHomePage />} />
                        <Route path="/Alumni/profile" element={<AlumniProfile />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default AlumniDashboard;
