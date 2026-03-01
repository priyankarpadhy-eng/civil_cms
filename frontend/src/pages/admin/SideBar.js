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

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import ArchitectureRoundedIcon from '@mui/icons-material/ArchitectureRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

const navItems = [
    { label: 'Home', icon: HomeRoundedIcon, path: '/', match: ['/', '/Admin/dashboard'] },
    { label: 'Batches', icon: SchoolRoundedIcon, path: '/Admin/classes', match: ['/Admin/classes'] },
    { label: 'Subjects', icon: MenuBookRoundedIcon, path: '/Admin/subjects', match: ['/Admin/subjects', '/Admin/addsubject'] },
    { label: 'Teachers', icon: GroupsRoundedIcon, path: '/Admin/teachers', match: ['/Admin/teachers'] },
    { label: 'Students', icon: PersonRoundedIcon, path: '/Admin/students', match: ['/Admin/students'] },
    { label: 'Notices', icon: CampaignRoundedIcon, path: '/Admin/notices', match: ['/Admin/notices', '/Admin/addnotice'] },
    { label: 'NBA / NAAC', icon: PolicyRoundedIcon, path: '/Admin/accreditation', match: ['/Admin/accreditation'] },
    { label: 'Vision & PEOs', icon: ArchitectureRoundedIcon, path: '/Admin/strategy', match: ['/Admin/strategy'] },
    { label: 'Faculty Portfolio', icon: BadgeRoundedIcon, path: '/Admin/faculty-portfolio', match: ['/Admin/faculty-portfolio'] },
    { label: 'Budgeting', icon: AccountBalanceWalletRoundedIcon, path: '/Admin/budget', match: ['/Admin/budget'] },
    { label: 'Procurement', icon: ShoppingCartRoundedIcon, path: '/Admin/procurement', match: ['/Admin/procurement'] },
    { label: 'Complains', icon: ReportRoundedIcon, path: '/Admin/complains', match: ['/Admin/complains'] },
    { label: 'User Management', icon: SupervisorAccountRoundedIcon, path: '/Admin/users', match: ['/Admin/users'] },
    { label: 'Alumni Approvals', icon: WorkspacePremiumRoundedIcon, path: '/Admin/alumni', match: ['/Admin/alumni'] },
];

const userItems = [
    { label: 'Profile', icon: AccountCircleRoundedIcon, path: '/Admin/profile', match: ['/Admin/profile'] },
    { label: 'Logout', icon: ExitToAppRoundedIcon, path: '/logout', match: ['/logout'] },
];

const SidebarItem = ({ item, open }) => {
    const location = useLocation();
    const isActive = item.match.some(m => location.pathname.startsWith(m));
    const Icon = item.icon;
    const isLogout = item.label === 'Logout';

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
                    ? 'rgba(108,99,255,0.15)'
                    : 'transparent',
                border: isActive
                    ? '1px solid rgba(108,99,255,0.3)'
                    : '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                    background: isLogout
                        ? 'rgba(239,68,68,0.1)'
                        : isActive ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.05)',
                    border: isLogout
                        ? '1px solid rgba(239,68,68,0.25)'
                        : '1px solid rgba(108,99,255,0.2)',
                },
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: open ? 36 : 'unset',
                    color: isActive
                        ? 'var(--clr-primary-light)'
                        : isLogout ? 'var(--clr-error)' : 'var(--clr-text-muted)',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                    '& svg': { fontSize: '1.2rem' },
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
                                : isLogout ? 'var(--clr-error)' : 'var(--clr-text-secondary)',
                        }
                    }}
                />
            )}
        </ListItemButton>
    );

    if (!open) {
        return <Tooltip title={item.label} placement="right">{btn}</Tooltip>;
    }
    return btn;
};

const SideBar = ({ open }) => {
    return (
        <>
            {/* Section label */}
            {open && (
                <Box sx={{ px: 2.5, pt: 1, pb: 0.5 }}>
                    <Typography sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--clr-text-muted)',
                    }}>
                        Navigation
                    </Typography>
                </Box>
            )}

            {navItems.map(item => (
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

export default SideBar;
