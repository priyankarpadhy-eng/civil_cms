import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Grid,
    Box,
    Typography,
    Avatar,
    Container,
    Paper,
    Divider,
    IconButton,
    InputBase
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { useTheme } from '../context/ThemeContext';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(30px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AlumniPage = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [alumni, setAlumni] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                // Using dummy data if API fails or is empty for preview
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/PublicAlumni`);
                const data = res.data.length > 0 ? res.data : [
                    { name: "Rahul Sharma", passoutYear: 2018, company: "L&T Construction", jobTitle: "Senior Project Manager", biography: "IGIT Sarang provided the foundation for my career in mega-structures. Proud civil engineer." },
                    { name: "Sneh Lata", passoutYear: 2020, company: "Public Works Dept.", jobTitle: "Assistant Engineer", biography: "Dedicated to building sustainable urban infrastructure in Odisha." },
                    { name: "Vikram Das", passoutYear: 2015, company: "Tata Steel", jobTitle: "Lead Structural Consultant", biography: "Structural engineering is an art I learned in the laboratories of IGIT." }
                ];
                setAlumni(data);
            } catch (err) {
                console.error("Error fetching alumni:", err);
            }
        };
        fetchAlumni();
    }, []);

    const filteredAlumni = alumni.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.company && a.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.sclassName?.passoutYear?.toString().includes(searchTerm)) ||
        (a.passoutYear?.toString().includes(searchTerm))
    );

    return (
        <Wrapper isDarkMode={isDarkMode}>
            {/* Nav */}
            <NavBar isDarkMode={isDarkMode}>
                <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <LogoSection onClick={() => navigate('/')}>
                        <LogoIcon>🏛️</LogoIcon>
                        <LogoText>
                            <Typography variant="h6" fontWeight={900}>IGIT SARANG</Typography>
                            <Typography variant="caption" fontWeight={700}>CIVIL ALUMNI NETWORK</Typography>
                        </LogoText>
                    </LogoSection>

                    <NavActions>
                        <ThemeToggle onClick={toggleTheme}>
                            {isDarkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                        </ThemeToggle>
                        <NavBtn isDarkMode={isDarkMode} onClick={() => navigate('/choose')}>Back to Portal</NavBtn>
                    </NavActions>
                </Container>
            </NavBar>

            <Hero>
                <Container maxWidth="md">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Tag isDarkMode={isDarkMode}>Legacy Of Excellence</Tag>
                        <Typography variant="h2" fontWeight={950} sx={{ mb: 2, letterSpacing: '-0.04em' }}>The Alumni Collective</Typography>
                        <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.6, mb: 6 }}>
                            Connect with the pioneers who shaped the infrastructure of our nation. <br />
                            The professional gateway for IGIT Civil Engineering graduates.
                        </Typography>

                        <SearchBar isDarkMode={isDarkMode}>
                            <SearchRoundedIcon sx={{ color: 'var(--clr-primary)', mr: 2 }} />
                            <InputBase
                                placeholder="Search by name, company or graduation year..."
                                fullWidth
                                sx={{ color: 'inherit', fontWeight: 600 }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchBar>
                    </motion.div>
                </Container>
            </Hero>

            <Container maxWidth="lg" sx={{ pb: 10 }}>
                <Grid container spacing={4}>
                    {filteredAlumni.map((alum, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <AlumniCard isDarkMode={isDarkMode} whileHover={{ y: -8 }}>
                                <TopSection>
                                    <StyledAvatar src={alum.profilePic}>
                                        {alum.name.charAt(0)}
                                    </StyledAvatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={900}>{alum.name}</Typography>
                                        <Typography variant="body2" fontWeight={800} color="var(--clr-primary)">
                                            Batch {alum.passoutYear || alum.sclassName?.passoutYear}
                                        </Typography>
                                    </Box>
                                </TopSection>
                                <Divider sx={{ my: 2.5, opacity: 0.1 }} />
                                <MidSection>
                                    <DetailRow>
                                        <BusinessCenterRoundedIcon sx={{ fontSize: 18, color: 'var(--clr-primary)' }} />
                                        <Typography variant="body2" fontWeight={800}>
                                            {alum.jobTitle || "Professional Engineer"} at {alum.company || "Infrastructure Sector"}
                                        </Typography>
                                    </DetailRow>
                                    <Typography variant="body2" sx={{ my: 2, opacity: 0.7, fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>
                                        "{alum.biography || "Contributing to the engineering excellence of the nation since graduation from IGIT Sarang."}"
                                    </Typography>
                                </MidSection>
                                <BottomSection>
                                    <ActionBtn startIcon={<LinkedInIcon />}>View LinkedIn Profile</ActionBtn>
                                </BottomSection>
                            </AlumniCard>
                        </Grid>
                    ))}
                </Grid>

                {filteredAlumni.length === 0 && (
                    <Box textAlign="center" py={10}>
                        <Typography variant="h5" sx={{ opacity: 0.5 }}>No alumni profiles found matching your criteria.</Typography>
                    </Box>
                )}
            </Container>

            <Footer isDarkMode={isDarkMode}>
                <Container maxWidth="lg">
                    <Typography variant="body2" textAlign="center" sx={{ opacity: 0.4, fontWeight: 700 }}>
                        Building Connections since 1982. IGIT Sarang Civil Engineering Department.
                    </Typography>
                </Container>
            </Footer>
        </Wrapper>
    );
};

export default AlumniPage;

const Wrapper = styled.div`
    background: ${p => p.isDarkMode ? '#030712' : '#fdfdfd'};
    color: ${p => p.isDarkMode ? '#f8fafc' : '#0f172a'};
    min-height: 100vh;
    transition: background 0.4s ease;
`;

const NavBar = styled.nav`
    height: 80px;
    background: ${p => p.isDarkMode ? 'rgba(3, 7, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${p => p.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
`;

const LogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
`;

const LogoIcon = styled.div`font-size: 2rem;`;
const LogoText = styled.div``;

const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const ThemeToggle = styled(IconButton)`
    border: 1px solid rgba(128,128,128,0.2) !important;
    border-radius: 12px !important;
    color: inherit !important;
`;

const NavBtn = styled.button`
    padding: 10px 24px;
    border-radius: 12px;
    border: 1px solid rgba(128,128,128,0.2);
    background: transparent;
    color: inherit;
    font-weight: 800;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: rgba(128,128,128,0.1); border-color: var(--clr-primary); }
`;

const Hero = styled.section`
    padding: 120px 0 80px;
    text-align: center;
`;

const Tag = styled.div`
    display: inline-block;
    padding: 6px 16px;
    background: rgba(139, 92, 246, 0.1);
    color: var(--clr-primary);
    border-radius: 8px;
    font-weight: 950;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    margin-bottom: 16px;
`;

const SearchBar = styled.div`
    max-width: 650px;
    margin: 0 auto;
    background: ${p => p.isDarkMode ? '#0f172a' : '#fff'};
    padding: 12px 28px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    border: 1px solid ${p => p.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    display: flex;
    align-items: center;
    transition: all 0.3s;
    &:focus-within {
        box-shadow: 0 20px 50px rgba(139, 92, 246, 0.15);
        border-color: var(--clr-primary);
        transform: translateY(-2px);
    }
`;

const AlumniCard = styled(motion.div)`
    padding: 36px;
    border-radius: 32px;
    background: ${p => p.isDarkMode ? '#0f172a' : '#fff'};
    border: 1px solid ${p => p.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    box-shadow: ${p => p.isDarkMode ? 'none' : '0 10px 40px rgba(0,0,0,0.02)'};
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const TopSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const StyledAvatar = styled(Avatar)`
    width: 68px; height: 68px;
    background: var(--grad-primary) !important;
    font-weight: 900 !important;
    font-size: 1.5rem !important;
`;

const MidSection = styled.div`
    flex: 1;
`;

const DetailRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
`;

const BottomSection = styled.div`
    margin-top: 32px;
`;

const ActionBtn = styled(Box)`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 900;
    font-size: 0.85rem;
    color: var(--clr-primary);
    cursor: pointer;
    transition: all 0.2s;
    &:hover { opacity: 0.7; transform: translateX(5px); }
`;

const Footer = styled.footer`
    padding: 80px 0;
    border-top: 1px solid ${p => p.isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
`;
