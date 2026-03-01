import React, { useState } from 'react';
import {
    Box, Typography, Grid, Paper, Button, Chip, Divider, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import styled from 'styled-components';

const StatCard = styled(Paper)`
    padding: 24px;
    border-radius: 20px;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    cursor: default;
    overflow: hidden;
    position: relative;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1);
        border-color: ${props => props.color};
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 4px; height: 100%;
        background: ${props => props.color};
    }
`;

const IconWrapper = styled.div`
    width: 56px; height: 56px;
    border-radius: 16px;
    background: ${props => props.bg};
    color: ${props => props.color};
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
`;

const mockApplications = [
    { id: 1, name: 'Ankita Mohanty', roll: '2022CV01', company: 'L&T Construction', role: 'Site Engineer', status: 'Shortlisted' },
    { id: 2, name: 'Bikash Das', roll: '2022CV14', company: 'Tata Projects', role: 'Design Trainee', status: 'Pending Review' },
    { id: 3, name: 'Sritam Panda', roll: '2022CV42', company: 'Afcons', role: 'Project Engineer', status: 'Selected' },
    { id: 4, name: 'Nibedita Sahoo', roll: '2022CV28', company: 'L&T Construction', role: 'Site Engineer', status: 'Interview' },
];

const CdcAdminTP = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--clr-text-primary)' }}>
                        Training & Placement <span style={{ color: '#f59e0b' }}>Admin</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', mt: 1, fontWeight: 500 }}>
                        Manage recruitment drives, track student applications, and coordinate placement activities.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    sx={{
                        borderRadius: '12px',
                        px: 3, py: 1.5,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)'
                    }}
                >
                    New Drive Info
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#10b981">
                        <IconWrapper bg="#10b98120" color="#10b981"><BusinessRoundedIcon /></IconWrapper>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>8</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Drives</Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#6366f1">
                        <IconWrapper bg="#6366f120" color="#6366f1"><GroupRoundedIcon /></IconWrapper>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>142</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Applicants</Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#f59e0b">
                        <IconWrapper bg="#f59e0b20" color="#f59e0b"><EventAvailableRoundedIcon /></IconWrapper>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>3</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Upcoming Interviews</Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#ef4444">
                        <IconWrapper bg="#ef444420" color="#ef4444"><WorkRoundedIcon /></IconWrapper>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>24</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Offers Received</Typography>
                        </Box>
                    </StatCard>
                </Grid>
            </Grid>

            <Paper sx={{ p: 4, borderRadius: '24px', background: 'var(--clr-surface-1)', border: '1px solid var(--clr-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Recent Student Applications</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '2px solid var(--clr-border)', color: 'var(--clr-text-muted)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' } }}>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockApplications.map((app) => (
                                <TableRow key={app.id} sx={{ '& td': { borderBottom: '1px solid var(--clr-border)' } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--clr-primary)', fontSize: '0.9rem', fontWeight: 700 }}>{app.name[0]}</Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, color: 'var(--clr-text-primary)' }}>{app.name}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>{app.roll}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{app.company}</TableCell>
                                    <TableCell sx={{ color: 'var(--clr-text-secondary)', fontWeight: 500 }}>{app.role}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={app.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                borderRadius: '8px',
                                                bgcolor: app.status === 'Selected' ? '#10b98120' : app.status === 'Shortlisted' ? '#6366f120' : '#f59e0b20',
                                                color: app.status === 'Selected' ? '#10b981' : app.status === 'Shortlisted' ? '#6366f1' : '#f59e0b',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="outlined" size="small" sx={{ borderRadius: '8px', fontWeight: 700, mr: 1 }}>Review</Button>
                                        <IconButton size="small"><MoreVertRoundedIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </motion.div>
    );
};

export default CdcAdminTP;
