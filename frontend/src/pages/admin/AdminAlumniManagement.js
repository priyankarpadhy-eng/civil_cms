import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import { supabase } from '../../supabaseClient';
import { CheckCircleRounded, CancelRounded, PersonRounded } from '@mui/icons-material';
import styled from 'styled-components';

const AdminAlumniManagement = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector(state => state.user);

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('alumni')
                .select('*')
                .eq('school_id', currentUser.id || currentUser._id);

            if (error) throw error;
            setAlumni(data || []);
        } catch (err) {
            console.error("Error fetching alumni:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAlumni();
    }, [currentUser]);

    const handleApprove = async (id) => {
        try {
            const { error } = await supabase
                .from('alumni')
                .update({ isApproved: true })
                .eq('id', id);

            if (error) throw error;
            fetchAlumni();
        } catch (err) {
            console.error("Error approving alumni:", err);
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject and delete this registration?")) {
            try {
                const { error } = await supabase
                    .from('alumni')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchAlumni();
            } catch (err) {
                console.error("Error rejecting alumni:", err);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 4, letterSpacing: '-0.02em' }}>
                Alumni Registrations
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid var(--clr-border)', background: 'var(--clr-surface-1)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'var(--clr-surface-2)' }}>
                            <TableCell sx={{ fontWeight: 800 }}>Alumni</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Reg. No.</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Batch</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alumni.map((alum) => (
                            <TableRow key={alum._id} sx={{ '&:hover': { background: 'var(--clr-surface-2)' } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={alum.profilePic} sx={{ background: 'var(--grad-primary)' }}>
                                            {alum.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight={700}>{alum.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{alum.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell fontWeight={600}>{alum.registrationNum}</TableCell>
                                <TableCell fontWeight={600}>{alum.passoutYear}</TableCell>
                                <TableCell>
                                    {alum.isApproved ? (
                                        <Chip
                                            label="Approved"
                                            size="small"
                                            color="success"
                                            sx={{ fontWeight: 800, borderRadius: '6px' }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Pending"
                                            size="small"
                                            color="warning"
                                            sx={{ fontWeight: 800, borderRadius: '6px' }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {!alum.isApproved && (
                                        <Tooltip title="Approve">
                                            <IconButton color="success" onClick={() => handleApprove(alum._id)}>
                                                <CheckCircleRounded />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Reject/Remove">
                                        <IconButton color="error" onClick={() => handleReject(alum._id)}>
                                            <CancelRounded />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {alumni.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h6" color="text.secondary">No alumni registrations found.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default AdminAlumniManagement;
