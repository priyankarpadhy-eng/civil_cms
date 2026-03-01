import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUser } from '../../redux/userRelated/userHandle';
import { authSuccess } from '../../redux/userRelated/userSlice';

// Icons
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

import ProfileOnboarding from '../../components/ProfileOnboarding';

const TeacherProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, status, error } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    officialEmail: currentUser?.officialEmail || '',
    subjectExpertise: currentUser?.subjectExpertise || '',
    education: currentUser?.education || '',
    officeLocation: currentUser?.officeLocation || '',
    experience: currentUser?.experience || '',
    projects: currentUser?.projects || '',
    designation: currentUser?.designation || 'Assistant Professor',
    hodMessage: currentUser?.hodMessage || '',
    profilePic: currentUser?.profilePic || '',
  });

  useEffect(() => {
    setFormData({
      officialEmail: currentUser?.officialEmail || '',
      subjectExpertise: currentUser?.subjectExpertise || '',
      education: currentUser?.education || '',
      officeLocation: currentUser?.officeLocation || '',
      experience: currentUser?.experience || '',
      projects: currentUser?.projects || '',
      designation: currentUser?.designation || 'Assistant Professor',
      hodMessage: currentUser?.hodMessage || '',
      profilePic: currentUser?.profilePic || '',
    });
  }, [currentUser]);

  useEffect(() => {
    if (status === 'added' || status === 'success') {
      setLoader(false);
      setIsEditing(false);
    }
  }, [status]);

  if (!currentUser) return null;

  // Verify onboarding
  const isComplete = currentUser.designation && currentUser.officialEmail;

  if (!isComplete) {
    return <ProfileOnboarding user={currentUser} type="Faculty" />;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoader(true);
    dispatch(updateUser(formData, currentUser._id));
  };

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const infoFields = [
    { icon: <EmailRoundedIcon />, label: 'Official Email', name: 'officialEmail', value: currentUser.officialEmail || 'Not set' },
    { icon: <WorkspacePremiumRoundedIcon />, label: 'Designation', name: 'designation', value: currentUser.designation || 'Assistant Professor' },
    { icon: <WorkspacePremiumRoundedIcon />, label: 'Subject Expertise', name: 'subjectExpertise', value: currentUser.subjectExpertise || 'Not set' },
    { icon: <SchoolRoundedIcon />, label: 'Education', name: 'education', value: currentUser.education || 'Not set' },
    { icon: <LocationOnRoundedIcon />, label: 'Office Location', name: 'officeLocation', value: currentUser.officeLocation || 'Not set' },
    { icon: <WorkHistoryRoundedIcon />, label: 'Experience', name: 'experience', value: currentUser.experience || 'Not set' },
    { icon: <AccountTreeRoundedIcon />, label: 'Research Projects', name: 'projects', value: currentUser.projects || 'Not set' },
    { icon: <AccountTreeRoundedIcon />, label: 'Profile Picture URL', name: 'profilePic', value: currentUser.profilePic || 'Default' },
    { icon: <AccountTreeRoundedIcon />, label: 'HOD Message (If HOD)', name: 'hodMessage', value: currentUser.hodMessage || 'N/A' },
  ];

  return (
    <Wrapper>
      <HeaderRow>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--clr-text-primary)' }}>
          My Faculty Profile
        </Typography>
        {!isEditing ? (
          <EditBtn onClick={() => setIsEditing(true)} startIcon={<EditRoundedIcon />}>
            Customize Profile
          </EditBtn>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} startIcon={<CancelRoundedIcon />}>
              Cancel
            </Button>
            <SaveBtn onClick={handleSave} disabled={loader} startIcon={loader ? <CircularProgress size={20} /> : <SaveRoundedIcon />}>
              Save Changes
            </SaveBtn>
          </Stack>
        )}
      </HeaderRow>

      <Grid container spacing={4}>
        {/* Sidebar Profile Card */}
        <Grid item xs={12} md={4}>
          <SidebarCard>
            <AvatarBox>
              <StyledAvatar sx={{ width: 140, height: 140 }}>
                {initials}
              </StyledAvatar>
            </AvatarBox>
            <NameText>{currentUser.name}</NameText>
            <RoleText>{currentUser.designation || "Assistant Professor"}</RoleText>
            <DeptChip>Civil Engineering Department</DeptChip>
            <Divider sx={{ width: '100%', my: 3 }} />
            <InstitutionInfo>
              <BusinessRoundedIcon sx={{ color: 'var(--clr-text-muted)', fontSize: '1.2rem' }} />
              <Typography variant="body2" fontWeight={700}>IGIT Sarang, Odisha</Typography>
            </InstitutionInfo>
          </SidebarCard>
        </Grid>

        {/* Main Details Area */}
        <Grid item xs={12} md={8}>
          <MainPaper elevation={0}>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Grid container spacing={4}>
                    {infoFields.map((field, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <InfoItem>
                          <IconCircle>{field.icon}</IconCircle>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {field.label}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--clr-text-primary)', mt: 0.5 }}>
                              {field.value}
                            </Typography>
                          </Box>
                        </InfoItem>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Grid container spacing={3}>
                    {infoFields.map((field, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, display: 'block', color: 'var(--clr-primary)' }}>
                          {field.label}
                        </Typography>
                        <StyledTextField
                          fullWidth
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          variant="outlined"
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          multiline={field.name === 'projects' || field.name === 'experience'}
                          rows={field.name === 'projects' || field.name === 'experience' ? 3 : 1}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>
          </MainPaper>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default TeacherProfile;

const Wrapper = styled.div`
    animation: ${fadeUp} 0.5s ease-out;
`;

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const EditBtn = styled(Button)`
    background: var(--grad-primary) !important;
    color: white !important;
    padding: 10px 24px !important;
    border-radius: 12px !important;
    font-weight: 800 !important;
    box-shadow: var(--shadow-primary) !important;
    text-transform: none !important;
`;

const SaveBtn = styled(Button)`
    background: #22c55e !important;
    color: white !important;
    padding: 10px 24px !important;
    border-radius: 12px !important;
    font-weight: 800 !important;
    text-transform: none !important;
`;

const SidebarCard = styled(Paper)`
    padding: 40px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 32px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--shadow-sm) !important;
`;

const AvatarBox = styled.div`
    margin-bottom: 24px;
`;

const StyledAvatar = styled(Avatar)`
    background: var(--grad-primary) !important;
    font-family: var(--font-display) !important;
    font-weight: 950 !important;
    font-size: 3rem !important;
    border: 5px solid var(--clr-surface-2) !important;
    box-shadow: var(--shadow-primary) !important;
`;

const NameText = styled.h2`
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--clr-text-primary);
    margin-bottom: 4px;
`;

const RoleText = styled.p`
    font-size: 1rem;
    font-weight: 700;
    color: var(--clr-text-muted);
    margin-bottom: 16px;
`;

const DeptChip = styled.div`
    background: rgba(168, 85, 247, 0.1);
    color: var(--clr-primary);
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 800;
`;

const InstitutionInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--clr-text-secondary);
`;

const MainPaper = styled(Paper)`
    padding: 48px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 32px !important;
    box-shadow: var(--shadow-sm) !important;
    min-height: 400px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    height: 100%;
`;

const IconCircle = styled.div`
    width: 48px; height: 48px;
    border-radius: 14px;
    background: var(--clr-surface-2);
    display: flex; align-items: center; justify-content: center;
    color: var(--clr-primary);
    flex-shrink: 0;
    svg { font-size: 1.4rem; }
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        background: var(--clr-surface-2);
        border-radius: 12px;
        & fieldset { border-color: var(--clr-border); }
        &:hover fieldset { border-color: var(--clr-primary); }
    }
`;