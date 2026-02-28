import * as React from 'react';
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import ArchitectureRoundedIcon from '@mui/icons-material/ArchitectureRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import FaceRetouchingNaturalRoundedIcon from '@mui/icons-material/FaceRetouchingNaturalRounded';

const SidebarItem = ({ item, open }) => {
    const location = useLocation();
    const isActive = item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path);

    const Icon = item.icon;

    return (
        <Tooltip title={!open ? item.label : ""} placement="right" arrow>
            <ListItemButton
                component={item.path !== '#' ? Link : 'div'}
                to={item.path !== '#' ? item.path : undefined}
                sx={{
                    minHeight: 48,
                    borderRadius: '12px',
                    mx: 1.5,
                    mb: 0.8,
                    px: open ? 2 : 1.5,
                    justifyContent: open ? 'flex-start' : 'center',
                    background: isActive ? 'var(--clr-primary-glow)' : 'transparent',
                    border: isActive ? '1px solid var(--clr-primary-border)' : '1px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        background: isActive ? 'var(--clr-primary-glow-heavy)' : 'var(--clr-surface-2)',
                        border: isActive ? '1px solid var(--clr-primary-border-heavy)' : '1px solid var(--clr-border)',
                    },
                }}
            >
                <ListItemIcon sx={{
                    minWidth: open ? 38 : 'unset',
                    justifyContent: 'center',
                    color: isActive ? 'var(--clr-primary)' : 'var(--clr-text-muted)',
                    '& svg': { fontSize: '1.25rem' },
                    transition: 'all 0.2s',
                }}>
                    <Icon />
                </ListItemIcon>
                {open && (
                    <ListItemText
                        primary={item.label}
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '0.88rem',
                                fontWeight: isActive ? 800 : 600,
                                fontFamily: 'var(--font-base)',
                                color: isActive ? 'var(--clr-text-primary)' : 'var(--clr-text-secondary)',
                                letterSpacing: '0.01em',
                            }
                        }}
                    />
                )}
            </ListItemButton>
        </Tooltip>
    );
};

const TeacherSideBar = ({ open }) => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass;

    const navItems = [
        { label: 'Dashboard', icon: HomeRoundedIcon, path: '/', exact: true },
        { label: 'Batches', icon: GroupsRoundedIcon, path: '/Teacher/batches' },
        { label: 'Face Attendance', icon: FaceRetouchingNaturalRoundedIcon, path: '/Teacher/face-attendance' },
        { label: 'Lesson Plan', icon: AutoStoriesRoundedIcon, path: '/Teacher/lesson-plan' },
        { label: 'Mentorship', icon: Diversity3RoundedIcon, path: '/Teacher/mentorship' },
        { label: 'Lab Mgmt', icon: PrecisionManufacturingRoundedIcon, path: '/Teacher/lab-management' },
        { label: 'Survey Camp', icon: MapRoundedIcon, path: '/Teacher/survey-camp' },
        { label: 'Consultancy', icon: ArchitectureRoundedIcon, path: '/Teacher/consultancy' },
        { label: 'OBE/NBA', icon: TimelineRoundedIcon, path: '/Teacher/obe-accreditation' },
        { label: 'R&D Grants', icon: ScienceRoundedIcon, path: '/Teacher/research' },
        { label: 'Industry', icon: FactoryRoundedIcon, path: '/Teacher/industry' },
        { label: 'Complain', icon: CampaignRoundedIcon, path: '/Teacher/complain' },
    ];

    const accountItems = [
        { label: 'My Profile', icon: AccountCircleRoundedIcon, path: '/Teacher/profile' },
        { label: 'Logout', icon: ExitToAppRoundedIcon, path: '/logout', isLogout: true },
    ];

    return (
        <Box sx={{ pt: 1, pb: 2 }}>
            {/* Subject Status Card */}
            {open && (
                <Box sx={{
                    mx: 2, mb: 3, mt: 0.5, p: 2,
                    background: 'var(--grad-primary)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
                    color: 'white'
                }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                        Current Subject
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, lineHeight: 1.2 }}>
                        {currentUser?.teachSubject?.subName || 'N/A'}
                    </Typography>
                    <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.9 }}>
                            Batch: {sclassName?.sclassName}
                        </Typography>
                    </Box>
                </Box>
            )}

            {open && (
                <SectionHeader>Main Navigation</SectionHeader>
            )}

            {navItems.map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}

            <Box sx={{ my: 2, px: 2 }}>
                <Divider sx={{ borderColor: 'var(--clr-border)' }} />
            </Box>

            {open && (
                <SectionHeader>Settings</SectionHeader>
            )}

            {accountItems.map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}
        </Box>
    );
};

export default TeacherSideBar;

const SectionHeader = ({ children }) => (
    <Box sx={{ px: 3.5, pb: 1.5 }}>
        <Typography sx={{
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--clr-text-muted)',
            opacity: 0.8
        }}>
            {children}
        </Typography>
    </Box>
);