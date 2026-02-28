import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Stack,
    Chip,
    Button,
    Divider,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    SchoolRounded,
    BadgeRounded,
    WorkspacePremiumRounded,
    AutoGraphRounded,
    EventAvailableRounded,
    MailRounded,
    LinkedIn,
    GitHub,
    LaunchRounded,
    SentimentVerySatisfiedRounded,
    StarRounded
} from '@mui/icons-material';
import { getStudentBySlug } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StudentPortfolio = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userDetails, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getStudentBySlug(slug));
    }, [dispatch, slug]);

    if (loading) return (
        <LoadingScreen>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 800, color: 'white' }}>Crafting Portfolio...</Typography>
        </LoadingScreen>
    );

    if (error || !userDetails) return (
        <ErrorScreen>
            <Typography variant="h2" fontWeight={900}>404</Typography>
            <Typography variant="h5">Portfolio Not Found</Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>Back Home</Button>
        </ErrorScreen>
    );

    const overallAttendance = calculateOverallAttendancePercentage(userDetails?.attendance || []);

    return (
        <PortfolioWrapper>
            {/* HER0 SECTION */}
            <HeroSection>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                                <AvatarWrapper>
                                    <Avatar
                                        src={userDetails?.profilePic}
                                        sx={{ width: 300, height: 300, border: '10px solid white', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
                                    >
                                        {userDetails?.name?.[0]}
                                    </Avatar>
                                    <StatusBadge>AVAILABLE FOR PROJECTS</StatusBadge>
                                </AvatarWrapper>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                                <BadgeStack>
                                    <Chip
                                        icon={<WorkspacePremiumRounded style={{ color: '#fbbf24' }} />}
                                        label="Verified Student"
                                        sx={{ bgcolor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', fontWeight: 900, fontSize: '0.9rem' }}
                                    />
                                    <Chip label={userDetails?.sclassName?.sclassName} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 800 }} />
                                </BadgeStack>
                                <Typography variant="h1" fontWeight={900} sx={{ color: 'white', fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1 }}>
                                    {userDetails?.name}
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3, maxWidth: '600px', fontWeight: 600 }}>
                                    {userDetails?.biography || "Passionate Civil Engineering student at IGIT Sarang, focused on structural design and innovative infrastructure solutions."}
                                </Typography>

                                <SocialStack direction="row" spacing={2} sx={{ mt: 4 }}>
                                    <PortfolioButton variant="contained" startIcon={<MailRounded />}>Hire Me</PortfolioButton>
                                    <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><LinkedIn /></IconButton>
                                    <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><GitHub /></IconButton>
                                </SocialStack>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </HeroSection>

            {/* STATS SECTION */}
            <StatsContainer>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <InfoCard initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <AutoGraphRounded sx={{ fontSize: '3rem', color: 'var(--clr-primary)' }} />
                                    <Typography variant="h3" fontWeight={900}>8.4</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={800} sx={{ mt: 2 }}>Current CGPA</Typography>
                                <Typography variant="body2" color="text.secondary">Consistent academic performance across 6 semesters of engineering.</Typography>
                            </InfoCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoCard initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <EventAvailableRounded sx={{ fontSize: '3rem', color: '#10b981' }} />
                                    <Typography variant="h3" fontWeight={900}>{overallAttendance.toFixed(0)}%</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={800} sx={{ mt: 2 }}>Discipline Rate</Typography>
                                <Typography variant="body2" color="text.secondary">Commitment to learning through high attendance and classroom participation.</Typography>
                            </InfoCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoCard initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <StarRounded sx={{ fontSize: '3rem', color: '#f59e0b' }} />
                                    <Typography variant="h3" fontWeight={900}>12+</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={800} mt={2}>Practical Projects</Typography>
                                <Typography variant="body2" color="text.secondary">Technical projects ranging from CAD designs to concrete mix optimization.</Typography>
                            </InfoCard>
                        </Grid>
                    </Grid>
                </Container>
            </StatsContainer>

            {/* PROJECTS/ACADEMIC GRID */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <SectionTitle variant="h3" fontWeight={900}>Academic Excellence</SectionTitle>
                <Grid container spacing={4}>
                    {userDetails?.examResult?.map((result, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <AcademicCard whileHover={{ y: -10 }}>
                                <Typography variant="caption" fontWeight={900} color="primary">{result?.subName?.subCode || "COURSE"}</Typography>
                                <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>{result?.subName?.subName}</Typography>
                                <ProgressWrapper>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" fontWeight={800}>Scored</Typography>
                                        <Typography variant="body2" fontWeight={900}>{result?.marksObtained}%</Typography>
                                    </Box>
                                    <ProgressBar><ProgressFill width={`${result?.marksObtained}%`} /></ProgressBar>
                                </ProgressWrapper>
                            </AcademicCard>
                        </Grid>
                    ))}
                    {!userDetails?.examResult?.length && (
                        <Grid item xs={12} sx={{ textAlign: 'center', py: 10 }}>
                            <SentimentVerySatisfiedRounded sx={{ fontSize: '4rem', opacity: 0.2, mb: 2 }} />
                            <Typography variant="h6" fontWeight={700}>Academic records are currently private.</Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>

            {/* FOOTER */}
            <PortfolioFooter>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            © 2024 IGIT Sarang • Civil Engineering Department
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="#">Privacy</Link>
                            <Link href="#">Institutional Verification</Link>
                        </Stack>
                    </Stack>
                </Container>
            </PortfolioFooter>
        </PortfolioWrapper>
    );
};

export default StudentPortfolio;

/* STYLED COMPONENTS */

const PortfolioWrapper = styled(Box)`
    background: #0f172a;
    min-height: 100vh;
    color: #f8fafc;
`;

const HeroSection = styled(Box)`
    min-height: 80vh;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent),
                radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.1), transparent);
    display: flex;
    align-items: center;
    padding: 100px 0;
`;

const AvatarWrapper = styled(Box)`
    position: relative;
    width: fit-content;
`;

const StatusBadge = styled(Box)`
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 8px 16px;
    border-radius: 40px;
    font-size: 0.7rem;
    font-weight: 900;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    border: 3px solid white;
`;

const BadgeStack = styled(Stack)`
    flex-direction: row;
    gap: 12px;
    margin-bottom: 24px;
`;

const PortfolioButton = styled(Button)`
    background: #4f46e5 !important;
    padding: 12px 32px !important;
    border-radius: 12px !important;
    font-weight: 900 !important;
    text-transform: none !important;
    font-size: 1.1rem !important;
`;

const StatsContainer = styled(Box)`
    margin-top: -80px;
    position: relative;
    z-index: 10;
`;

const InfoCard = styled(motion.div)`
    background: white;
    color: #1e293b;
    padding: 40px;
    border-radius: 32px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.2);
`;

const AcademicCard = styled(motion.div)`
    background: #1e293b;
    padding: 32px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.05);
`;

const SectionTitle = styled(Typography)`
    margin-bottom: 48px;
    text-align: center;
    background: linear-gradient(90deg, #fff, rgba(255,255,255,0.5));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const ProgressWrapper = styled(Box)`
    margin-top: 24px;
`;

const ProgressBar = styled(Box)`
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
`;

const ProgressFill = styled(Box)`
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    width: ${props => props.width};
`;

const PortfolioFooter = styled(Box)`
    padding: 60px 0;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: #020617;
`;

const Link = styled.a`
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    font-weight: 800;
    font-size: 0.8rem;
    &:hover { color: white; }
`;

const LoadingScreen = styled(Box)`
    height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ErrorScreen = styled(Box)`
    height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
`;

const SocialStack = styled(Stack)`
    button {
        transition: transform 0.2s;
        &:hover { transform: scale(1.1); }
    }
`;
