import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { CheckCircleRounded, CancelRounded, FindInPageRounded } from '@mui/icons-material';
import { supabase } from '../../supabaseClient';
import styled from 'styled-components';

const AdminVerification = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*, classes:sclass_id(*)')
            .eq('role', 'Student')
            .eq('verification_status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch Verification Error:", error.message);
        } else if (data) {
            setRequests(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleVerify = async (id, status) => {
        setActionLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .update({ verification_status: status })
            .eq('id', id)
            .select();

        if (error) {
            alert("Error updating status: " + error.message);
        } else if (!data || data.length === 0) {
            alert("Action Prevented by Database! Your Admin account does not have Row Level Security (RLS) permission to edit other user profiles. Please run the provided SQL policy.");
        } else {
            setRequests(requests.filter(req => req.id !== id));
            setSelectedStudent(null);
        }
        setActionLoading(false);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--clr-bg)', minHeight: '100vh' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" fontWeight={900}>Student Verifications</Typography>
                <Chip label={`${requests.length} Pending`} color="warning" sx={{ fontWeight: 800 }} />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px dashed var(--clr-border)', background: 'var(--clr-surface-1)' }}>
                    <FindInPageRounded sx={{ fontSize: 60, color: 'var(--clr-text-muted)', mb: 2 }} />
                    <Typography variant="h6" fontWeight={800} color="var(--clr-text-secondary)">
                        No pending verifications
                    </Typography>
                    <Typography color="var(--clr-text-muted)">
                        All student profiles are verified.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {requests.map(student => (
                        <Grid item xs={12} md={6} lg={4} key={student.id}>
                            <RequestCard>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Avatar src={student.avatar_url} sx={{ width: 64, height: 64, border: '2px solid var(--clr-border)' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                                            {student.name}
                                        </Typography>
                                        <Typography variant="body2" color="var(--clr-text-muted)" fontWeight={600} mt={0.5}>
                                            {student.roll_num || student.rollNum} • {student.classes?.sclass_name || 'No Batch'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => setSelectedStudent(student)}
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    Review Application
                                </Button>
                            </RequestCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Review Dialog */}
            <Dialog
                open={Boolean(selectedStudent)}
                onClose={() => !actionLoading && setSelectedStudent(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, background: 'var(--clr-surface-1)' } }}
            >
                {selectedStudent && (
                    <>
                        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.25rem', borderBottom: '1px solid var(--clr-border)' }}>
                            Review Student Application
                        </DialogTitle>
                        <DialogContent sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        src={selectedStudent.avatar_url}
                                        sx={{ width: 160, height: 160, mx: 'auto', mb: 2, border: '4px solid var(--clr-surface-2)', boxShadow: 'var(--shadow-md)' }}
                                    />
                                    <Typography variant="h6" fontWeight={800}>{selectedStudent.name}</Typography>
                                    <Typography color="var(--clr-text-muted)" fontWeight={600}>{selectedStudent.email}</Typography>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <DetailGrid>
                                        <DetailItem label="Roll Number" value={selectedStudent.roll_num || selectedStudent.rollNum} />
                                        <DetailItem label="Registration Number" value={selectedStudent.registration_num} />
                                        <DetailItem label="Admission Number" value={selectedStudent.admission_num} />
                                        <DetailItem label="Batch" value={selectedStudent.classes?.sclass_name} />
                                        <DetailItem label="Mobile Number" value={selectedStudent.phone} />
                                        <DetailItem label="Submitted At" value={new Date(selectedStudent.updated_at).toLocaleDateString()} />
                                    </DetailGrid>

                                    <Box sx={{ mt: 3, p: 2.5, bgcolor: 'var(--clr-surface-2)', borderRadius: 3 }}>
                                        <Typography variant="caption" color="var(--clr-text-muted)" fontWeight={800} textTransform="uppercase">Home Address</Typography>
                                        <Typography fontWeight={600} mt={0.5}>{selectedStudent.residence_address}</Typography>
                                    </Box>

                                    <Box sx={{ mt: 2, p: 2.5, bgcolor: 'var(--clr-surface-2)', borderRadius: 3 }}>
                                        <Typography variant="caption" color="var(--clr-text-muted)" fontWeight={800} textTransform="uppercase">Current Address</Typography>
                                        <Typography fontWeight={600} mt={0.5}>{selectedStudent.current_address}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, borderTop: '1px solid var(--clr-border)', gap: 1 }}>
                            <Button
                                onClick={() => setSelectedStudent(null)}
                                disabled={actionLoading}
                                sx={{ color: 'var(--clr-text-muted)', fontWeight: 700 }}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => handleVerify(selectedStudent.id, 'rejected')}
                                disabled={actionLoading}
                                variant="outlined"
                                color="error"
                                startIcon={<CancelRounded />}
                                sx={{ borderRadius: 2, fontWeight: 800 }}
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleVerify(selectedStudent.id, 'verified')}
                                disabled={actionLoading}
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleRounded />}
                                sx={{ borderRadius: 2, fontWeight: 800, px: 4 }}
                            >
                                {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Approve & Verify'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AdminVerification;

const RequestCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px;
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--clr-primary);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DetailItem = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="var(--clr-text-muted)" fontWeight={800} textTransform="uppercase" letterSpacing="0.05em">
            {label}
        </Typography>
        <Typography fontWeight={700} color="var(--clr-text-primary)">
            {value || 'N/A'}
        </Typography>
    </Box>
);
