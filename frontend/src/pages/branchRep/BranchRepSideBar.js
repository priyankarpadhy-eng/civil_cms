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
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

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
        match: ['/', '/BranchRep/dashboard'],
        gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    },
    {
        label: 'Section Students',
        icon: PeopleAltRoundedIcon,
        path: '/BranchRep/students',
        match: ['/BranchRep/students'],
        gradient: 'linear-gradient(135deg, #A855F7, #EC4899)',
    },
    {
        label: 'Section Attendance',
        icon: AssignmentRoundedIcon,
        path: '/BranchRep/section-attendance',
        match: ['/BranchRep/section-attendance'],
        gradient: 'linear-gradient(135deg, #10B981, #3B82F6)',
    },
    {
        label: 'Subjects',
        icon: MenuBookRoundedIcon,
        path: '/BranchRep/subjects',
        match: ['/BranchRep/subjects'],
        gradient: 'linear-gradient(135deg, #6C63FF, #A855F7)',
    },
    {
        label: 'My Attendance',
        icon: CheckBoxRoundedIcon,
        path: '/BranchRep/attendance',
        match: ['/BranchRep/attendance'],
        gradient: 'linear-gradient(135deg, #22C55E, #10B981)',
    },
    {
        label: 'Complain',
        icon: CampaignRoundedIcon,
        path: '/BranchRep/complain',
        match: ['/BranchRep/complain'],
        gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    },
    {
        label: 'Course Reg.',
        icon: AppRegistrationRoundedIcon,
        path: '/BranchRep/registration',
        match: ['/BranchRep/registration'],
        gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    },
    {
        label: 'Academics',
        icon: FactCheckRoundedIcon,
        path: '/BranchRep/academics',
        match: ['/BranchRep/academics'],
        gradient: 'linear-gradient(135deg, #6C63FF, #A855F7)',
    },
    {
        label: 'Fees & Hostel',
        icon: PaymentsRoundedIcon,
        path: '/BranchRep/fees-hostel',
        match: ['/BranchRep/fees-hostel'],
        gradient: 'linear-gradient(135deg, #22C55E, #10B981)',
    },
    {
        label: 'T&P Cell',
        icon: WorkRoundedIcon,
        path: '/BranchRep/placement',
        match: ['/BranchRep/placement'],
        gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    },
    {
        label: 'Alumni Network',
        icon: HandshakeRoundedIcon,
        path: '/BranchRep/alumni',
        match: ['/BranchRep/alumni'],
        gradient: 'linear-gradient(135deg, #10B981, #059669)',
    },
];

const userItems = [
    {
        label: 'Profile',
        icon: AccountCircleRoundedIcon,
        path: '/BranchRep/profile',
        match: ['/BranchRep/profile'],
        gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    },
    {
        label: 'Logout',
        icon: ExitToAppRoundedIcon,
        path: '/logout',
        match: ['/logout'],
        isLogout: true,
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
                minHeight: 44,
                borderRadius: '10px',
                mx: 1,
                mb: 0.5,
                px: open ? 2 : 1,
                justifyContent: open ? 'flex-start' : 'center',
                background: isActive
                    ? 'rgba(59,130,246,0.14)'
                    : 'transparent',
                border: isActive
                    ? '1px solid rgba(59,130,246,0.28)'
                    : '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                    background: item.isLogout
                        ? 'rgba(239,68,68,0.1)'
                        : isActive
                            ? 'rgba(59,130,246,0.2)'
                            : 'rgba(255,255,255,0.05)',
                    border: item.isLogout
                        ? '1px solid rgba(239,68,68,0.25)'
                        : '1px solid rgba(59,130,246,0.2)',
                },
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: open ? 36 : 'unset',
                    justifyContent: 'center',
                    color: isActive
                        ? '#60A5FA'
                        : item.isLogout
                            ? 'var(--clr-error)'
                            : 'var(--clr-text-muted)',
                    '& svg': { fontSize: '1.2rem' },
                    transition: 'color 0.2s',
                }}
            >
                <Icon />
            </ListItemIcon>
            {open && (
                <ListItemText
                    primary={item.label}
                    sx={{
                        '& .MuiTypography-root': {
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 500,
                            fontFamily: 'var(--font-base)',
                            color: isActive
                                ? 'var(--clr-text-primary)'
                                : item.isLogout
                                    ? 'var(--clr-error)'
                                    : 'var(--clr-text-secondary)',
                        }
                    }}
                />
            )}
        </ListItemButton>
    );

    if (!open) return <Tooltip title={item.label} placement="right">{btn}</Tooltip>;
    return btn;
};

const BranchRepSideBar = ({ open }) => {
    return (
        <>
            {open && (
                <Box sx={{ px: 2.5, pt: 1, pb: 0.5 }}>
                    <Typography sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                    }}>
                        Representative Tools
                    </Typography>
                </Box>
            )}

            {navItems.slice(0, 3).map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}

            <Box sx={{ my: 1.5 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />
            </Box>

            {open && (
                <Box sx={{ px: 2.5, pt: 0.5, pb: 0.5 }}>
                    <Typography sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                    }}>
                        Student Navigation
                    </Typography>
                </Box>
            )}

            {navItems.slice(3).map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}

            <Box sx={{ my: 1.5 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />
            </Box>

            {open && (
                <Box sx={{ px: 2.5, pt: 0.5, pb: 0.5 }}>
                    <Typography sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                    }}>
                        Account
                    </Typography>
                </Box>
            )}

            {userItems.map(item => (
                <SidebarItem key={item.label} item={item} open={open} />
            ))}
        </>
    );
};

export default BranchRepSideBar;
