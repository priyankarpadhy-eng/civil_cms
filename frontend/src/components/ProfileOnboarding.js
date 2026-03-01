import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/userRelated/userHandle';
import { getAllSclasses } from '../redux/sclassRelated/sclassHandle';
import styled from 'styled-components';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';

const ProfileOnboarding = ({ user, type }) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const { sclassesList } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (type === 'Student') {
            dispatch(getAllSclasses(user._id || user.id, "Sclass")); // Fetch batches
        }
    }, [dispatch, type, user._id, user.id]);

    // Student fields
    const [studentData, setStudentData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        roll_num: user.roll_num || '',
        registration_num: user.registration_num || '',
        admission_num: user.admission_num || '',
        residence_address: user.residence_address || '', // Home Address
        current_address: user.current_address || '', // Hostel/Mess or Day scholar
        sclass_id: user.sclass_id || '', // Batch Number
        avatar_url: user.avatar_url || '',
        verification_status: 'pending' // Automatically go into pending verification
    });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStudentData({ ...studentData, avatar_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

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
        dispatch(updateUser(studentData, user._id || user.id));
    };

    const handleFacultySubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        dispatch(updateUser(facultyData, user._id || user.id));
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
                        ? "Please fill in all details including a profile photo to submit for admin verification."
                        : "Faculty details help in departmental coordination and accreditation."}
                </Alert>

                <form onSubmit={type === 'Student' ? handleStudentSubmit : handleFacultySubmit}>
                    <Grid container spacing={3}>
                        {type === 'Student' ? (
                            <>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={studentData.avatar_url}
                                        sx={{ width: 100, height: 100, mb: 2, background: 'var(--clr-surface-2)', border: '2px solid var(--clr-primary)' }}
                                    />
                                    <Button variant="outlined" component="label" startIcon={<PhotoCameraRoundedIcon />} sx={{ borderRadius: 2 }}>
                                        Upload Profile Photo
                                        <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Email Address (Verified)"
                                        value={user.email || ''}
                                        disabled
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Full Name"
                                        value={studentData.name}
                                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Mobile Number"
                                        value={studentData.phone}
                                        onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Select Batch Number</InputLabel>
                                        <Select
                                            value={studentData.sclass_id}
                                            label="Select Batch Number"
                                            onChange={(e) => setStudentData({ ...studentData, sclass_id: e.target.value })}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {sclassesList && sclassesList.map((sclass) => (
                                                <MenuItem key={sclass._id} value={sclass._id}>
                                                    {sclass.sclassName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth label="Roll Number"
                                        value={studentData.roll_num}
                                        onChange={(e) => setStudentData({ ...studentData, roll_num: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth label="Registration Number"
                                        value={studentData.registration_num}
                                        onChange={(e) => setStudentData({ ...studentData, registration_num: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth label="Admission Number"
                                        value={studentData.admission_num}
                                        onChange={(e) => setStudentData({ ...studentData, admission_num: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Home Address" multiline rows={2}
                                        value={studentData.residence_address}
                                        onChange={(e) => setStudentData({ ...studentData, residence_address: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Current Address (Hostel/Mess/Day Scholar)" multiline rows={2}
                                        value={studentData.current_address}
                                        onChange={(e) => setStudentData({ ...studentData, current_address: e.target.value })}
                                        placeholder="e.g. Mahanadi Hall of Residence, Room 112"
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
                                {loader ? <CircularProgress size={24} color="inherit" /> : (type === 'Student' ? 'Verify and Save' : 'Save & Continue')}
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
