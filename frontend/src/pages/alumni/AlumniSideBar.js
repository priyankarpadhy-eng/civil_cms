import * as React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';

const AlumniSideBar = ({ open }) => {
    const location = useLocation();

    const menuItems = [
        { text: 'Home', icon: <DashboardRoundedIcon />, path: '/Alumni/dashboard' },
        { text: 'Profile', icon: <Person2RoundedIcon />, path: '/Alumni/profile' },
        { text: 'Network', icon: <ShareRoundedIcon />, path: '/Alumni/network' },
        { text: 'Contributions', icon: <WorkRoundedIcon />, path: '/Alumni/contributions' },
    ];

    return (
        <>
            {menuItems.map((item) => (
                <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                        borderRadius: '12px',
                        mx: 1, mb: 0.5,
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            '& .MuiListItemIcon-root': { color: '#10b981' },
                        },
                        '&:hover': {
                            backgroundColor: 'var(--clr-surface-2)',
                        }
                    }}
                >
                    <Tooltip title={!open ? item.text : ""} placement="right">
                        <ListItemIcon sx={{ minWidth: 40, color: 'var(--clr-text-secondary)' }}>
                            {item.icon}
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                        sx={{ opacity: open ? 1 : 0 }}
                    />
                </ListItemButton>
            ))}

            <Divider sx={{ my: 1, borderColor: 'var(--clr-border)' }} />

            <ListItemButton
                component={Link}
                to="/logout"
                sx={{
                    borderRadius: '12px',
                    mx: 1,
                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', '& .MuiListItemIcon-root': { color: '#ef4444' } }
                }}
            >
                <Tooltip title={!open ? "Logout" : ""} placement="right">
                    <ListItemIcon sx={{ minWidth: 40, color: 'var(--clr-text-secondary)' }}>
                        <ExitToAppRoundedIcon />
                    </ListItemIcon>
                </Tooltip>
                <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                    sx={{ opacity: open ? 1 : 0 }}
                />
            </ListItemButton>
        </>
    );
};

export default AlumniSideBar;
