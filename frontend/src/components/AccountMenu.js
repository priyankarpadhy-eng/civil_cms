import React, { useState } from 'react';
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Settings, Logout, PersonRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const { currentRole, currentUser } = useSelector(state => state.user);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 1, border: '2px solid var(--clr-border)', p: '2px' }}
                    >
                        <Avatar sx={{
                            width: 34, height: 34,
                            background: 'var(--grad-primary)',
                            fontSize: '0.9rem',
                            fontWeight: 800
                        }}>
                            {String(currentUser?.name || '?').charAt(0)}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        background: 'var(--clr-surface-1)',
                        border: '1px solid var(--clr-border)',
                        borderRadius: '16px',
                        mt: 1.5,
                        width: '220px',
                        overflow: 'visible',
                        '& .MuiMenuItem-root': {
                            px: 2, py: 1.5,
                            borderRadius: '8px',
                            mx: 1, my: 0.5,
                            transition: 'all 0.2s',
                            '&:hover': { background: 'var(--clr-surface-2)', color: 'var(--clr-primary)' }
                        }
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)' }}>
                        {currentUser?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {currentRole} Portal
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: 'var(--clr-border)', my: 0.5 }} />

                <MenuItem onClick={() => navigate(`/${currentRole}/profile`)}>
                    <ListItemIcon><PersonRounded fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>My Profile</Typography>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon><Settings fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Settings</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: 'var(--clr-border)', my: 0.5 }} />

                <MenuItem onClick={() => navigate('/logout')} sx={{ color: '#f43f5e !important' }}>
                    <ListItemIcon><Logout fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Sign Out</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default AccountMenu;