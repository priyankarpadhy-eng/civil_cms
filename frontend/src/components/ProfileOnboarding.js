import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/userRelated/userHandle';
import styled from 'styled-components';

const ProfileOnboarding = ({ user, type }) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);

    // Student fields
    const [studentData, setStudentData] = useState({
        roll_num: user.roll_num || '',
        registration_num: user.registration_num || '',
        admission_num: user.admission_num || '',
        current_semester: user.current_semester || 1,
        residence_address: user.residence_address || '',
    });

    // Faculty fields
    const [facultyData, setFacultyData] = useState({
        designation: user.designation || '',
        department: user.department || 'Civil Engineering',
        officialEmail: user.officialEmail || '',
        officeLocation: user.officeLocation || '',
    });

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        if (!studentData.registration_num && !studentData.admission_num) {
            alert("Registration Number or Admission Number is mandatory!");
            return;
        }
        setLoader(true);
        dispatch(updateUser(studentData, user.id));
    };

    const handleFacultySubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        dispatch(updateUser(facultyData, user.id));
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid var(--clr-border)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Complete Your Profile
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--clr-text-muted)', mb: 4 }}>
                    Please provide these details to unlock full access to the department portal.
                </Typography>

                <Alert severity="info" sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>
                    {type === 'Student'
                        ? "Registration Number or Admission Number is required for identity verification."
                        : "Faculty details help in departmental coordination and accreditation."}
                </Alert>

                <form onSubmit={type === 'Student' ? handleStudentSubmit : handleFacultySubmit}>
                    <Grid container spacing={3}>
                        {type === 'Student' ? (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Roll Number"
                                        value={studentData.roll_num}
                                        onChange={(e) => setStudentData({ ...studentData, roll_num: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Registration Number"
                                        value={studentData.registration_num}
                                        onChange={(e) => setStudentData({ ...studentData, registration_num: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Admission Number"
                                        value={studentData.admission_num}
                                        onChange={(e) => setStudentData({ ...studentData, admission_num: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Current Semester" type="number"
                                        value={studentData.current_semester}
                                        onChange={(e) => setStudentData({ ...studentData, current_semester: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Residence Address" multiline rows={3}
                                        value={studentData.residence_address}
                                        onChange={(e) => setStudentData({ ...studentData, residence_address: e.target.value })}
                                        required
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Designation"
                                        value={facultyData.designation}
                                        onChange={(e) => setFacultyData({ ...facultyData, designation: e.target.value })}
                                        required placeholder="e.g. Assistant Professor"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Official Email"
                                        value={facultyData.officialEmail}
                                        onChange={(e) => setFacultyData({ ...facultyData, officialEmail: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Office Location"
                                        value={facultyData.officeLocation}
                                        onChange={(e) => setFacultyData({ ...facultyData, officeLocation: e.target.value })}
                                        required placeholder="e.g. Civil HOD Building, Room 204"
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <SubmitBtn
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : 'Save & Continue'}
                            </SubmitBtn>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default ProfileOnboarding;

const SubmitBtn = styled(Button)`
    background: var(--grad-primary) !important;
    padding: 12px !important;
    font-weight: 800 !important;
    border-radius: 12px !important;
    text-transform: none !important;
`;
