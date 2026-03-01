import React, { useState } from 'react';
import {
    Box, Typography, Grid, Paper, Button, Chip, Divider, IconButton,
    TextField, InputAdornment, Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import styled from 'styled-components';

const CompanyCard = styled(Paper)`
    padding: 24px;
    border-radius: 24px;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    transition: all 0.3s ease;
    cursor: default;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.2);
        border-color: #10b98150;
    }
`;

const mockCompanies = [
    { id: 1, name: 'L&T Construction', type: 'Core Civil', location: 'Chennai, India', ctc: '6.5 LPA', roles: ['Site Engineer', 'Design Engineer'], status: 'Registration Open', deadline: '2026-03-15', logo: 'L' },
    { id: 2, name: 'Tata Projects', type: 'Infrastructure', location: 'Mumbai, India', ctc: '7.0 LPA', roles: ['Project Trainee'], status: 'Upcoming', deadline: '2026-04-01', logo: 'T' },
    { id: 3, name: 'Afcons Infrastructure', type: 'Core Civil', location: 'Delhi, India', ctc: '6.0 LPA', roles: ['Graduate Engineer Trainee'], status: 'Closed', deadline: '2026-02-28', logo: 'A' },
    { id: 4, name: 'Shapoorji Pallonji', type: 'Construction', location: 'Pune, India', ctc: '5.5 LPA', roles: ['Site Supervisor'], status: 'Registration Open', deadline: '2026-03-20', logo: 'S' },
];

const CdcCompanyList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = mockCompanies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--clr-text-primary)' }}>
                        Company <span style={{ color: '#10b981' }}>Directory</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', mt: 1, fontWeight: 500 }}>
                        Manage corporate relations and ongoing placement drives.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            background: 'var(--clr-surface-1)',
                            borderRadius: '12px',
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: 'var(--clr-text-muted)' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            borderRadius: '12px',
                            px: 3, py: 1,
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        Add Company
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {filteredCompanies.map((company) => (
                    <Grid item xs={12} md={6} lg={4} key={company.id}>
                        <CompanyCard>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'var(--clr-surface-2)', color: 'var(--clr-primary)', fontWeight: 900, fontSize: '1.5rem', border: '2px solid var(--clr-border)' }}>
                                        {company.logo}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'var(--clr-text-primary)' }}>{company.name}</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--clr-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{company.type}</Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={company.status}
                                    size="small"
                                    sx={{
                                        fontWeight: 800, borderRadius: '8px',
                                        bgcolor: company.status === 'Registration Open' ? '#10b98120' : company.status === 'Upcoming' ? '#3b82f620' : 'var(--clr-surface-2)',
                                        color: company.status === 'Registration Open' ? '#10b981' : company.status === 'Upcoming' ? '#3b82f6' : 'var(--clr-text-muted)',
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <BusinessCenterRoundedIcon sx={{ fontSize: '1.2rem', color: 'var(--clr-text-muted)' }} />
                                    <Typography sx={{ fontWeight: 600, color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>
                                        {company.roles.join(', ')}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <LocationOnRoundedIcon sx={{ fontSize: '1.2rem', color: 'var(--clr-text-muted)' }} />
                                    <Typography sx={{ fontWeight: 600, color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>
                                        {company.location}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: 'var(--clr-border)', mb: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Package (CTC)</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--clr-text-primary)' }}>{company.ctc}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: 'var(--clr-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Deadline</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)' }}>{new Date(company.deadline).toLocaleDateString('en-GB')}</Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 3, borderRadius: '12px', py: 1, fontWeight: 800, color: 'var(--clr-text-primary)', borderColor: 'var(--clr-border)', '&:hover': { borderColor: 'var(--clr-primary)', color: 'var(--clr-primary)' } }}
                            >
                                View Details & Applicants
                            </Button>
                        </CompanyCard>
                    </Grid>
                ))}
            </Grid>
        </motion.div>
    );
};

export default CdcCompanyList;
