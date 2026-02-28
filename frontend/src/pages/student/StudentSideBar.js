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

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';

const navItems = [
    {
        label: 'Home',
        icon: HomeRoundedIcon,
        path: '/',
        match: ['/', '/Student/dashboard'],
        color: '#6366f1',
    },
    {
        label: 'Subjects',
        icon: MenuBookRoundedIcon,
        path: '/Student/subjects',
        match: ['/Student/subjects'],
        color: '#8b5cf6',
    },
    {
        label: 'Attendance',
        icon: CheckBoxRoundedIcon,
        path: '/Student/attendance',
        match: ['/Student/attendance'],
        color: '#10b981',
    },
    {
        label: 'Complain',
        icon: CampaignRoundedIcon,
        path: '/Student/complain',
        match: ['/Student/complain'],
        color: '#f59e0b',
    },
    {
        label: 'Course Reg.',
        icon: AppRegistrationRoundedIcon,
        path: '/Student/registration',
        match: ['/Student/registration'],
        color: '#3b82f6',
    },
    {
        label: 'Academics',
        icon: FactCheckRoundedIcon,
        path: '/Student/academics',
        match: ['/Student/academics'],
        color: '#8b5cf6',
    },
    {
        label: 'Fees & Hostel',
        icon: PaymentsRoundedIcon,
        path: '/Student/fees-hostel',
        match: ['/Student/fees-hostel'],
        color: '#10b981',
    },
    {
        label: 'T&P Cell',
        icon: WorkRoundedIcon,
        path: '/Student/placement',
        match: ['/Student/placement'],
        color: '#f59e0b',
    },
    {
        label: 'Alumni Network',
        icon: HandshakeRoundedIcon,
        path: '/Student/alumni',
        match: ['/Student/alumni'],
        color: '#10b981',
    },
];

const userItems = [
    {
        label: 'Profile',
        icon: AccountCircleRoundedIcon,
        path: '/Student/profile',
        match: ['/Student/profile'],
        color: '#6366f1',
    },
    {
        label: 'Logout',
        icon: ExitToAppRoundedIcon,
        path: '/logout',
        match: ['/logout'],
        isLogout: true,
        color: '#f43f5e',
    },
];

const SidebarItem = ({ item, open }) => {
    const location = useLocation();
    const isActive = item.match.some(m =>
        m === '/' ? location.pathname === '/' : location.pathname.startsWith(m)
    );

    const Icon = item.icon;

    const btn = (
        <ListItemButton
            component={Link}
            to={item.path}
            sx={{
                minHeight: 48,
                borderRadius: '12px',
                mx: 1.5,
                mb: 0.8,
                px: open ? 2 : 1.5,
                justifyContent: open ? 'flex-start' : 'center',
                background: isActive
                    ? `${item.color}15`
                    : 'transparent',
                border: isActive
                    ? `1px solid ${item.color}30`
                    : '1px solid transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    background: isActive ? `${item.color}25` : 'var(--clr-surface-2)',
                    border: isActive ? `1px solid ${item.color}40` : '1px solid var(--clr-border)',
                },
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: open ? 38 : 'unset',
                    justifyContent: 'center',
                    color: isActive ? item.color : 'var(--clr-text-muted)',
                    '& svg': { fontSize: '1.25rem' },
                    transition: 'all 0.2s',
                }}
            >
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
    );

    if (!open) return <Tooltip title={item.label} placement="right" arrow>{btn}</Tooltip>;
    return btn;
};

const StudentSideBar = ({ open }) => {
    return (
        <Box sx={{ pt: 1, pb: 2 }}>
            {open && (
                <Box sx={{ px: 3.5, pt: 1, pb: 1.5 }}>
                    <Typography sx={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                        opacity: 0.8
                    }}>
                        Academic
                    </Typography>
                </Box>
            )}

            {navItems.map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}

            <Box sx={{ my: 2, px: 2 }}>
                <Divider sx={{ borderColor: 'var(--clr-border)' }} />
            </Box>

            {open && (
                <Box sx={{ px: 3.5, pt: 0.5, pb: 1.5 }}>
                    <Typography sx={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                        opacity: 0.8
                    }}>
                        General
                    </Typography>
                </Box>
            )}

            {userItems.map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}
        </Box>
    );
};

export default StudentSideBar;