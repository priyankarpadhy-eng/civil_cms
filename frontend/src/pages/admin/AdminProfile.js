import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    Paper,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import {
    EditRounded,
    EmailRounded,
    SchoolRounded,
    PersonRounded,
    SaveRounded,
    CancelRounded
} from '@mui/icons-material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// import { updateUser } from '../../redux/userRelated/userHandle';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);

    // Form state (local for now as we don't have the API fully wired in the redacted snippet)
    const [formData, setFormData] = useState({
        name: currentUser.name,
        email: currentUser.email,
        schoolName: currentUser.schoolName
    });

    const handleToggleEdit = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Typography variant="h4" sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                mb: 4,
                color: 'var(--clr-text-primary)',
                letterSpacing: '-0.02em'
            }}>
                Account Settings
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <ProfileCard>
                        <AvatarWrapper>
                            <Avatar sx={{
                                width: 120, height: 120,
                                background: 'var(--grad-primary)',
                                fontSize: '3rem',
                                fontWeight: 800,
                                border: '4px solid var(--clr-surface-2)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                {String(currentUser.name).charAt(0)}
                            </Avatar>
                            <EditAvatarButton size="small">
                                <EditRounded fontSize="small" />
                            </EditAvatarButton>
                        </AvatarWrapper>
                        <ProfileName>{currentUser.name}</ProfileName>
                        <ProfileRole>Administrator</ProfileRole>
                        <Divider sx={{ width: '100%', my: 3, borderColor: 'var(--clr-border)' }} />
                        <StatsRow>
                            <StatItem>
                                <StatVal>Portal Admin</StatVal>
                                <StatLabel>Access Level</StatLabel>
                            </StatItem>
                            <StatDivider />
                            <StatItem>
                                <StatVal>Active</StatVal>
                                <StatLabel>Status</StatLabel>
                            </StatItem>
                        </StatsRow>
                    </ProfileCard>
                </Grid>

                <Grid item xs={12} md={8}>
                    <DetailsCard>
                        <CardHeader>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)' }}>
                                Personal Information
                            </Typography>
                            {!isEditing ? (
                                <Button
                                    startIcon={<EditRounded />}
                                    onClick={handleToggleEdit}
                                    sx={{ fontWeight: 700, borderRadius: '10px', textTransform: 'none' }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        color="error"
                                        startIcon={<CancelRounded />}
                                        onClick={handleToggleEdit}
                                        sx={{ fontWeight: 700, borderRadius: '10px', textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveRounded />}
                                        onClick={handleToggleEdit}
                                        sx={{ fontWeight: 700, borderRadius: '10px', textTransform: 'none', background: 'var(--grad-primary)' }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </CardHeader>

                        <Box sx={{ mt: 4 }}>
                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div
                                        key="view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <InfoRow>
                                            <InfoIconBox><PersonRounded /></InfoIconBox>
                                            <InfoContent>
                                                <InfoLabel>Full Name</InfoLabel>
                                                <InfoValue>{currentUser.name}</InfoValue>
                                            </InfoContent>
                                        </InfoRow>

                                        <InfoRow>
                                            <InfoIconBox><EmailRounded /></InfoIconBox>
                                            <InfoContent>
                                                <InfoLabel>Email Address</InfoLabel>
                                                <InfoValue>{currentUser.email}</InfoValue>
                                            </InfoContent>
                                        </InfoRow>

                                        <InfoRow>
                                            <InfoIconBox><SchoolRounded /></InfoIconBox>
                                            <InfoContent>
                                                <InfoLabel>Institution</InfoLabel>
                                                <InfoValue>{currentUser.schoolName}</InfoValue>
                                            </InfoContent>
                                        </InfoRow>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="edit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Full Name" name="name"
                                                    value={formData.name} onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Institution" name="schoolName"
                                                    value={formData.schoolName} onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="Email Address" name="email"
                                                    value={formData.email} onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="New Password" type="password"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </Grid>
                                        </Grid>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    </DetailsCard>
                </Grid>
            </Grid>
        </motion.div>
    );
}

export default AdminProfile;

const ProfileCard = styled(Paper)`
  background: var(--clr-surface-1) !important;
  border: 1px solid var(--clr-border) !important;
  border-radius: 24px !important;
  padding: 40px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm) !important;
`;

const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const EditAvatarButton = styled(IconButton)`
  position: absolute !important;
  bottom: 0; right: 0;
  background: var(--clr-primary) !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
  &:hover { background: var(--clr-primary-light) !important; }
`;

const ProfileName = styled.h2`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 4px;
`;

const ProfileRole = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--clr-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatVal = styled.p`
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--clr-text-primary);
`;

const StatLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--clr-text-muted);
  text-transform: uppercase;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 24px;
  background: var(--clr-border);
`;

const DetailsCard = styled(Paper)`
  background: var(--clr-surface-1) !important;
  border: 1px solid var(--clr-border) !important;
  border-radius: 24px !important;
  padding: 40px !important;
  box-shadow: var(--shadow-sm) !important;
  height: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--clr-border);
  &:last-child { border-bottom: none; }
`;

const InfoIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--clr-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-primary);
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

const InfoValue = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--clr-text-primary);
`;