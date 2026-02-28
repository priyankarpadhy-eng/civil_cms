import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Typography, Box, Avatar, Divider, Grid } from '@mui/material';
import styled from 'styled-components';

const AlumniProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ProfilePaper>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <StyledAvatar src={currentUser?.profilePic} sx={{ width: 120, height: 120 }}>
                        {currentUser?.name?.charAt(0)}
                    </StyledAvatar>
                    <Typography variant="h4" fontWeight={900} sx={{ mt: 2 }}>{currentUser?.name}</Typography>
                    <Typography variant="h6" color="primary" fontWeight={700}>Class of {currentUser?.passoutYear}</Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <InfoSection>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>Registration Number</Typography>
                            <Typography variant="body1" fontWeight={700}>{currentUser?.registrationNum}</Typography>
                        </InfoSection>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>Email Address</Typography>
                            <Typography variant="body1" fontWeight={700}>{currentUser?.email}</Typography>
                        </InfoSection>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>Current Company</Typography>
                            <Typography variant="body1" fontWeight={700}>{currentUser?.company || "Not specified"}</Typography>
                        </InfoSection>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoSection>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>Job Title</Typography>
                            <Typography variant="body1" fontWeight={700}>{currentUser?.jobTitle || "Not specified"}</Typography>
                        </InfoSection>
                    </Grid>
                    <Grid item xs={12}>
                        <InfoSection>
                            <Typography variant="overline" color="text.secondary" fontWeight={800}>Biography</Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                "{currentUser?.biography || "No biography added yet."}"
                            </Typography>
                        </InfoSection>
                    </Grid>
                </Grid>
            </ProfilePaper>
        </Container>
    );
};

const ProfilePaper = styled(Paper)`
    padding: 60px;
    border-radius: 32px !important;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: var(--shadow-md) !important;
`;

const StyledAvatar = styled(Avatar)`
    background: var(--grad-primary) !important;
    font-size: 3rem !important;
    font-weight: 900 !important;
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
`;

const InfoSection = styled(Box)`
    margin-bottom: 20px;
`;

export default AlumniProfile;
