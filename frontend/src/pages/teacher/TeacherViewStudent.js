import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    Chip,
    Stack,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const { currentUser, userDetails, loading } = useSelector((state) => state.user);

    const studentID = params.id;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, "Student"));
    }, [dispatch, studentID]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(userDetails.attendance || []);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Wrapper>
            <ProfileHeader>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <StyledAvatar sx={{ width: 150, height: 150, fontSize: '4rem' }}>
                            {userDetails.name?.charAt(0)}
                        </StyledAvatar>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <NameStack>
                            <Typography variant="h3" fontWeight={900} color="var(--clr-text-primary)">
                                {userDetails.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={`Roll: ${userDetails.rollNum}`} color="primary" sx={{ fontWeight: 800 }} />
                                {userDetails.isBranchRep && <Chip label="Branch Representative" sx={{ bgcolor: 'var(--grad-primary)', color: '#fff', fontWeight: 800 }} />}
                            </Box>
                        </NameStack>

                        <StatsInfo container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="textSecondary" fontWeight={700}>REGISTRATION NO.</Typography>
                                <Typography variant="body1" fontWeight={700}>{userDetails.registrationNum || "N/A"}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="textSecondary" fontWeight={700}>CURRENT SEMESTER</Typography>
                                <Typography variant="body1" fontWeight={700}>{userDetails.currentSemester || "N/A"}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="textSecondary" fontWeight={700}>CURRENT SECTION</Typography>
                                <Typography variant="body1" fontWeight={700}>{userDetails.section || "A"}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="textSecondary" fontWeight={700}>BATCH</Typography>
                                <Typography variant="body1" fontWeight={700}>{userDetails.sclassName?.sclassName || "N/A"}</Typography>
                            </Grid>
                        </StatsInfo>
                    </Grid>
                </Grid>
            </ProfileHeader>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <SectionPaper>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <EventAvailableRoundedIcon color="primary" /> Attendance Overview
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                            <Box>
                                <Typography variant="h3" fontWeight={900} color="var(--clr-primary)">
                                    {overallAttendancePercentage.toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight={600}>Total Academic Attendance</Typography>
                            </Box>
                            <Box sx={{ width: 120, height: 120 }}>
                                <CustomPieChart data={chartData} />
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                            sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800, background: 'var(--grad-primary)' }}
                        >
                            Mark Today's Attendance
                        </Button>
                    </SectionPaper>

                    <SectionPaper sx={{ mt: 4 }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AssignmentTurnedInRoundedIcon color="primary" /> Internal Evaluations
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="textSecondary" mb={3}>View and upload periodic assessment marks for this student.</Typography>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                            sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800, borderColor: 'var(--clr-primary)', color: 'var(--clr-primary)' }}
                        >
                            Update Marks
                        </Button>
                    </SectionPaper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <SectionPaper>
                        <Typography variant="h6" fontWeight={800} mb={3}>Department Details</Typography>
                        <Stack spacing={3}>
                            <Box sx={{ p: 2, bgcolor: 'var(--clr-surface-2)', borderRadius: '16px' }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <SchoolRoundedIcon color="primary" />
                                    <Typography variant="body2" fontWeight={700}>Institute: {userDetails.school?.schoolName}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'var(--clr-surface-2)', borderRadius: '16px' }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <BadgeRoundedIcon color="primary" />
                                    <Typography variant="body2" fontWeight={700}>Branch ID: CIVIL-IGIT-{userDetails.rollNum}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'var(--clr-surface-2)', borderRadius: '16px' }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <ClassRoundedIcon color="primary" />
                                    <Typography variant="body2" fontWeight={700}>Coordinator: Prof. Admin</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </SectionPaper>
                </Grid>
            </Grid>
        </Wrapper>
    );
};

export default TeacherViewStudent;

const Wrapper = styled.div`
    padding-bottom: 60px;
    animation: ${fadeUp} 0.5s ease-out;
`;

const ProfileHeader = styled(Paper)`
    padding: 48px;
    margin-bottom: 40px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 32px !important;
    box-shadow: var(--shadow-sm) !important;
`;

const StyledAvatar = styled(Avatar)`
    background: var(--grad-primary) !important;
    box-shadow: var(--shadow-primary) !important;
    font-weight: 900 !important;
`;

const NameStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StatsInfo = styled(Grid)``;

const SectionPaper = styled(Paper)`
    padding: 32px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 28px !important;
`;