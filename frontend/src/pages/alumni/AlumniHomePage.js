import React from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const AlumniHomePage = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <WelcomeBox>
                    <Box>
                        <Typography variant="h4" fontWeight={900} gutterBottom>
                            Welcome back, {currentUser?.name}!
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>
                            Batch of {currentUser?.passoutYear} · IGIT Civil Alumni
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <StatIcon>🎓</StatIcon>
                    </Box>
                </WelcomeBox>
            </motion.div>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                    <SectionPaper>
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Your Impact
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            As an esteemed alumnus, you play a vital role in the growth of our department. Support the next generation of engineers through mentorship, guest lectures, or industrial collaborations.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ borderRadius: '8px', fontWeight: 700 }}>
                            Explore Volunteer Opportunities
                        </Button>
                    </SectionPaper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SectionPaper>
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <LinkBtn>Update Professional Details</LinkBtn>
                            <LinkBtn>View Department News</LinkBtn>
                            <LinkBtn>Alumni Directory</LinkBtn>
                        </Box>
                    </SectionPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

const WelcomeBox = styled(Box)`
    background: var(--grad-primary);
    color: white;
    padding: 40px;
    border-radius: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
`;

const StatIcon = styled.div`
    font-size: 5rem;
    opacity: 0.2;
`;

const SectionPaper = styled(Paper)`
    padding: 30px;
    border-radius: 20px !important;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    box-shadow: none !important;
`;

const LinkBtn = styled(Button)`
    justify-content: flex-start !important;
    text-transform: none !important;
    font-weight: 700 !important;
    color: var(--clr-text-secondary) !important;
    &:hover {
        background: var(--clr-surface-2) !important;
        color: var(--clr-primary) !important;
    }
`;

export default AlumniHomePage;
