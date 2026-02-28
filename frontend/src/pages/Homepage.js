import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Box,
  Typography,
  Avatar,
  Chip,
  Container,
  IconButton,
  Button,
  Divider,
  Stack,
  Paper,
  useTheme as useMuiTheme
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import campusImg from '../assets/campus.jpg';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Dummy Data
const DUMMY_FACULTY = [
  {
    name: "Dr. Srinivas Sethi",
    designation: "Professor & HOD",
    specialization: "Structural Dynamics & Seismic Design",
    education: "Ph.D. (IIT Roorkee), M.Tech (NIT Rourkela)",
    experience: "24 Years",
    isHOD: true,
    hodMessage: "Our mission is to cultivate engineers who don't just understand formulas, but appreciate the gravity of the structures they build. At IGIT Civil, we blend timeless engineering principles with digital innovation.",
    image: "/assets/hod.jpg"
  },
  {
    name: "Dr. P.K. Pani",
    designation: "Professor",
    specialization: "Geotechnical Engineering",
    education: "Ph.D. (IIT Delhi)",
    experience: "28 Years",
    projects: "Stability Analysis of Fly-Ash Embankments"
  },
  {
    name: "Dr. B.C. Panda",
    designation: "Associate Professor",
    specialization: "Environmental Engineering",
    education: "Ph.D. (IIT Kanpur)",
    experience: "15 Years",
    projects: "Smart Water Management in Urban Areas"
  },
  {
    name: "Prof. S.K. Nayak",
    designation: "Assistant Professor",
    specialization: "Transportation Engineering",
    education: "M.Tech (IIT Kharagpur)",
    experience: "8 Years",
    projects: "Traffic Flow Optimization in Smart Cities"
  },
  {
    name: "Prof. Priya Padhy",
    designation: "Assistant Professor",
    specialization: "Construction Technology",
    education: "M.Tech (NIT Trichy)",
    experience: "6 Years",
    projects: "Sustainable Materials in Infrastructure"
  }
];

const DUMMY_REPS = [
  { name: "Aditya Mohanty", role: "CDC Coordinator", batch: "2021-25", year: "4th Year" },
  { name: "Ananya Dash", role: "Branch Representative", batch: "2021-25", year: "4th Year" },
  { name: "Rahul Sahoo", role: "CDC Coordinator", batch: "2022-26", year: "3rd Year" },
  { name: "Smruti Jena", role: "Branch Representative", batch: "2022-26", year: "3rd Year" },
  { name: "Sourav Ray", role: "Branch Representative", batch: "2023-27", year: "2nd Year" },
  { name: "Ishani Mishra", role: "Branch Representative", batch: "2024-28", year: "1st Year" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hod = DUMMY_FACULTY.find(f => f.isHOD);
  const professors = DUMMY_FACULTY.filter(f => f.designation === "Professor" && !f.isHOD);
  const assocProfs = DUMMY_FACULTY.filter(f => f.designation === "Associate Professor");
  const asstProfs = DUMMY_FACULTY.filter(f => f.designation === "Assistant Professor");

  return (
    <Wrapper isDarkMode={isDarkMode}>
      {/* Ultra-Premium Navigation */}
      <NavBar scrolled={scrolled} isDarkMode={isDarkMode}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <LogoSection onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoBox>CE</LogoBox>
            <LogoText>
              <Typography variant="h6" fontWeight={900}>IGIT SARANG</Typography>
              <Typography variant="caption" fontWeight={700}>CIVIL ENGINEERING</Typography>
            </LogoText>
          </LogoSection>

          <NavLinks>
            <NavLink href="#faculty">Our Teachers</NavLink>
            <NavLink href="#students">Student Team</NavLink>
            <Link to="/alumni" style={{ textDecoration: 'none' }}><NavLink as="span">Alumni Portal</NavLink></Link>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(128,128,128,0.2)', mx: 1 }} />

            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </ThemeToggle>

            <LoginBtn onClick={() => navigate('/choose')}>Enter Portal</LoginBtn>
          </NavLinks>
        </Container>
      </NavBar>

      {/* Cinematic Hero Section */}
      <HeroSection>
        <HeroBg />
        <HeroOverlay isDarkMode={isDarkMode} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <HeroBadge>
              <SchoolRoundedIcon sx={{ fontSize: 14 }} />
              <span>Department Portal</span>
            </HeroBadge>
            <HeroTitle isDarkMode={isDarkMode}>
              Department of <br />
              <SpanBrand>Civil Engineering</SpanBrand>
            </HeroTitle>
            <HeroSubtitle>
              Indira Gandhi Institute of Technology, Sarang
            </HeroSubtitle>


          </motion.div>
        </Container>

        <ScrollNotice>
          <MouseIcon />
          <Typography variant="caption">SCROLL DOWN</Typography>
        </ScrollNotice>
      </HeroSection>

      {/* A warm Welcome Section */}
      <section id="welcome" style={{ padding: '120px 0', borderBottom: '1px solid var(--clr-border)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <HODProfileCard>
                  <img src={hod.image} alt="HOD" style={{ width: '100%', borderRadius: '32px', filter: 'grayscale(30%)' }} />
                  <HODBadge>
                    <Typography variant="h6" fontWeight={900}>{hod.name}</Typography>
                    <Typography variant="body2" fontWeight={700}>Head of Department</Typography>
                  </HODBadge>
                </HODProfileCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 900, color: 'var(--clr-primary)' }}>
                  A Message from the HOD
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 4, letterSpacing: '-0.02em' }}>
                  Welcome to our <SpanBrand>Community</SpanBrand>
                </Typography>
                <div style={{ position: 'relative' }}>
                  <Typography variant="h5" sx={{
                    fontStyle: 'italic',
                    lineHeight: 1.8,
                    fontWeight: 500,
                    opacity: 0.9,
                    position: 'relative',
                    zIndex: 1,
                    pl: 4,
                    borderLeft: '4px solid var(--clr-primary)'
                  }}>
                    "Hello everyone. As the Head of Department, I want to welcome you to our digital home. Here at IGIT Civil, we believe in hard work, simple values, and helping every student find their path. Whether you are a student, teacher, or an old friend from our alumni, this portal is here to keep us all connected. Let's build a great future together, one step at a time."
                  </Typography>
                </div>
                <Box mt={6}>
                  <Typography variant="h6" fontWeight={900}>{hod.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 800 }}>PROFESSOR & HOD · IGIT SARANG</Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Professional Community */}
      <Section id="faculty" isDarkMode={isDarkMode} darkBg>
        <Container maxWidth="lg">
          <DirectoryHeader>
            <Tag isDarkMode={isDarkMode} centered>Our Team</Tag>
            <Typography variant="h2" fontWeight={950} className="title">Faculty Members</Typography>
          </DirectoryHeader>

          <FacultyTier>
            <TierLabel>Professors</TierLabel>
            <Grid container spacing={4}>
              {professors.map((p, i) => <FacultyCard key={i} data={p} isDarkMode={isDarkMode} />)}
            </Grid>
          </FacultyTier>

          <FacultyTier>
            <TierLabel>Associate Professors</TierLabel>
            <Grid container spacing={4}>
              {assocProfs.map((p, i) => <FacultyCard key={i} data={p} isDarkMode={isDarkMode} />)}
            </Grid>
          </FacultyTier>

          <FacultyTier>
            <TierLabel>Assistant Professors</TierLabel>
            <Grid container spacing={4}>
              {asstProfs.map((p, i) => <FacultyCard key={i} data={p} isDarkMode={isDarkMode} />)}
            </Grid>
          </FacultyTier>
        </Container>
      </Section>

      {/* Student Leadership Track */}
      <Section id="students">
        <Container maxWidth="lg">
          <DirectoryHeader>
            <Tag isDarkMode={isDarkMode} centered>Administration</Tag>
            <Typography variant="h2" fontWeight={950} className="title">Student Representatives</Typography>
          </DirectoryHeader>

          <RepGrid>
            {DUMMY_REPS.map((rep, i) => (
              <RepItem key={i} whileHover={{ y: -5 }}>
                <RepAvatar>{rep.name.charAt(0)}</RepAvatar>
                <RepContent>
                  <Typography variant="h6" fontWeight={900}>{rep.name}</Typography>
                  <Typography variant="caption" fontWeight={800} color="var(--clr-primary)" sx={{ textTransform: 'uppercase' }}>
                    {rep.role}
                  </Typography>
                  <Box mt={1} pt={1} sx={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}>
                    <Typography variant="body2" fontWeight={700} color="textSecondary">
                      {rep.year} · Batch {rep.batch}
                    </Typography>
                  </Box>
                </RepContent>
              </RepItem>
            ))}
          </RepGrid>
        </Container>
      </Section>

      {/* Professional Footer */}
      <Footer isDarkMode={isDarkMode}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <LogoSection sx={{ mb: 3 }}>
                <LogoBox size="small">CE</LogoBox>
                <Typography variant="h6" fontWeight={900} color={isDarkMode ? "#fff" : "#000"}>IGIT CIVIL</Typography>
              </LogoSection>
              <Typography variant="body2" sx={{ opacity: 0.6, lineHeight: 1.8 }}>
                The Department of Civil Engineering at Indira Gandhi Institute of Technology, Sarang,
                is committed to excellence in geotechnical, structural, and environmental engineering.
              </Typography>
              <Stack direction="row" spacing={2} mt={3}>
                <SocialIcon><FacebookIcon /></SocialIcon>
                <SocialIcon><LinkedInIcon /></SocialIcon>
                <SocialIcon><TwitterIcon /></SocialIcon>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FooterTitle>Navigation</FooterTitle>
              <FooterLink href="#leadership">Leadership</FooterLink>
              <FooterLink href="#faculty">Faculty</FooterLink>
              <FooterLink href="#students">Governance</FooterLink>
              <FooterLink onClick={() => navigate('/alumni')}>Alumni Network</FooterLink>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FooterTitle>Portals</FooterTitle>
              <FooterLink onClick={() => navigate('/choose')}>Student Login</FooterLink>
              <FooterLink onClick={() => navigate('/choose')}>Faculty Portal</FooterLink>
              <FooterLink onClick={() => navigate('/AdminLogin')}>Institutional Admin</FooterLink>
            </Grid>
            <Grid item xs={12} md={4}>
              <FooterTitle>Institutional Location</FooterTitle>
              <Typography variant="body2" sx={{ opacity: 0.6, mb: 1 }}>
                At/Po: Sarang, Dist: Dhenkanal<br />
                Odisha, 759146, India
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>+91 (06760) 240399</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 6, borderColor: 'rgba(128,128,128,0.1)' }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ opacity: 0.4 }}>© 2026 Dept. of Civil Engineering, IGIT Sarang.</Typography>
            <Typography variant="caption" sx={{ opacity: 0.4 }}>Autonomous Institute established by Govt. of Odisha</Typography>
          </Box>
        </Container>
      </Footer>
    </Wrapper>
  );
};

const FacultyCard = ({ data, isDarkMode }) => (
  <Grid item xs={12} sm={6} md={4}>
    <FCard isDarkMode={isDarkMode} whileHover={{ y: -8 }}>
      <Box display="flex" alignItems="center" gap={2.5} mb={3}>
        <FAvatar isDarkMode={isDarkMode}>{data.name.charAt(0)}</FAvatar>
        <Box>
          <Typography variant="h6" fontWeight={900}>{data.name}</Typography>
          <Typography variant="body2" fontWeight={800} color="var(--clr-primary)">{data.designation}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2.5, opacity: 0.1 }} />
      <Stack spacing={1.5}>
        <FDetail>
          <SchoolRoundedIcon sx={{ fontSize: 16 }} />
          <span>{data.education}</span>
        </FDetail>
        <FDetail>
          <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />
          <span>Focus: {data.specialization}</span>
        </FDetail>
        <FDetail>
          <AccountTreeRoundedIcon sx={{ fontSize: 16 }} />
          <span>{data.projects || "Academic Research Group"}</span>
        </FDetail>
      </Stack>
    </FCard>
  </Grid>
);

export default LandingPage;

/* ── Styled Components ── */

const Wrapper = styled.div`
    background: ${p => p.isDarkMode ? '#030712' : '#fff'};
    color: ${p => p.isDarkMode ? '#f8fafc' : '#0f172a'};
    transition: background 0.4s ease;
`;

const NavBar = styled.nav`
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 80px;
    z-index: 1000;
    display: flex;
    align-items: center;
    padding: 0 40px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 2px solid transparent;
    
    ${p => p.scrolled ? css`
        background: ${p.isDarkMode ? 'rgba(3, 7, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
        backdrop-filter: blur(20px);
        height: 70px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        border-bottom: 2px solid var(--clr-primary);
    ` : css`
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(5px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `}
`;

const LogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
`;

const LogoBox = styled.div`
    width: ${p => p.size === 'small' ? '32px' : '44px'};
    height: ${p => p.size === 'small' ? '32px' : '44px'};
    background: var(--grad-primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    font-size: ${p => p.size === 'small' ? '0.8rem' : '1.1rem'};
    box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
`;

const LogoText = styled.div``;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 32px;
`;

const NavLink = styled.a`
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s;
    &:hover { opacity: 1; color: var(--clr-primary); }
`;

const ThemeToggle = styled(IconButton)`
    border: 1px solid rgba(128,128,128,0.2) !important;
    border-radius: 12px !important;
    color: inherit !important;
    padding: 8px !important;
`;

const LoginBtn = styled.button`
    background: var(--grad-primary);
    color: white;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 950;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    transition: all 0.3s;
    &:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4); }
`;

const HeroSection = styled.section`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
`;

const HeroBg = styled.div`
    position: absolute;
    inset: 0;
    background: url(${campusImg}) center/cover no-repeat;
    transform: scale(1.05);
`;

const HeroOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: ${p => p.isDarkMode
    ? 'rgba(3,7,18,0.7)'
    : 'rgba(255,255,255,0.4)'};
`;

const HeroBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: inherit;
    margin-bottom: 32px;
`;

const HeroTitle = styled.h1`
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    font-weight: 950;
    line-height: 1.1;
    letter-spacing: -0.04em;
    margin-bottom: 24px;
    color: ${p => p.isDarkMode ? '#fff' : '#030712'};
`;

const SpanBrand = styled.span`
    color: var(--clr-primary);
    position: relative;
    &::after {
        content: '';
        position: absolute;
        bottom: 5px; left: 0; width: 100%; height: 4px;
        background: var(--clr-primary);
        opacity: 0.2;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.1rem;
    opacity: 0.7;
    font-weight: 600;
    line-height: 1.8;
`;

const HeroActions = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 48px;
`;

const PrimaryAction = styled.button`
    padding: 16px 32px;
    border-radius: 12px;
    background: var(--clr-primary);
    color: white;
    border: none;
    font-weight: 900;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
    transition: all 0.3s;
    &:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(139, 92, 246, 0.3); }
`;

const SecondaryAction = styled.button`
    padding: 16px 32px;
    border-radius: 12px;
    background: white;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s;
    &:hover { background: #f9fafb; border-color: #d1d5db; }
`;

const ScrollNotice = styled.div`
    position: absolute;
    bottom: 40px;
    left: 50%; transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    opacity: 0.4;
    z-index: 10;
`;

const MouseIcon = styled.div`
    width: 24px; height: 40px;
    border: 2px solid currentColor;
    border-radius: 20px;
    position: relative;
    &::after {
        content: '';
        position: absolute;
        top: 8px; left: 50%; transform: translateX(-50%);
        width: 4px; height: 8px;
        background: currentColor;
        border-radius: 2px;
        animation: ${float} 2s infinite;
    }
`;

const Section = styled.section`
    padding: 140px 0;
    ${p => p.darkBg && css`
        background: ${p.isDarkMode ? '#0f172a10' : '#f8fafc'};
    `}
`;

const Tag = styled.div`
    display: inline-block;
    padding: 6px 16px;
    background: ${p => p.isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'};
    color: var(--clr-primary);
    border-radius: 8px;
    font-weight: 950;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    margin-bottom: 16px;
    ${p => p.centered && `margin-left: auto; margin-right: auto; display: table;`}
`;

const QuoteWrapper = styled.div`
    position: relative;
    padding-left: 32px;
    &::before {
        content: '"';
        position: absolute;
        top: -10px; left: -10px;
        font-size: 4rem;
        font-family: serif;
        color: var(--clr-primary);
        opacity: 0.3;
    }
    border-left: 4px solid var(--clr-primary);
`;

const LeadershipPoster = styled.div`
    position: relative;
    border-radius: 40px;
    overflow: hidden;
    aspect-ratio: 4/5;
    box-shadow: 0 40px 80px rgba(0,0,0,0.1);
`;

const PosterImg = styled.img`
    width: 100%; height: 100%;
    object-fit: cover;
`;

const PosterOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%);
`;

const PosterDetails = styled.div`
    position: absolute;
    bottom: 40px; left: 40px; right: 40px;
    color: white;
`;

const SignatureBox = styled.div``;

const HODProfileCard = styled.div`
  position: relative;
  padding: 20px;
  background: var(--clr-surface-2);
  border-radius: 40px;
  box-shadow: var(--shadow-lg);
`;

const HODBadge = styled.div`
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: white;
  padding: 20px 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  color: black;
  border: 1px solid var(--clr-border);
`;

const DirectoryHeader = styled.div`
    text-align: center;
    margin-bottom: 80px;
    .title { letter-spacing: -0.04em; }
`;

const FacultyTier = styled.div`
    margin-bottom: 100px;
`;

const TierLabel = styled.h4`
    font-size: 1.25rem;
    font-weight: 900;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    gap: 20px;
    &::after { content: ''; flex: 1; height: 1px; background: rgba(128,128,128,0.1); }
`;

const FCard = styled(motion.div)`
    background: ${p => p.isDarkMode ? '#0f172a' : '#fff'};
    padding: 32px;
    border-radius: 24px;
    border: 1px solid ${p => p.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    box-shadow: ${p => p.isDarkMode ? 'none' : '0 10px 30px rgba(0,0,0,0.02)'};
    height: 100%;
    transition: border-color 0.3s;
    &:hover { border-color: var(--clr-primary); }
`;

const FAvatar = styled(Avatar)`
    width: 60px; height: 60px;
    background: ${p => p.isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#f3f4f6'} !important;
    color: var(--clr-primary) !important;
    font-weight: 900 !important;
    border: 1px solid rgba(139, 92, 246, 0.2) !important;
`;

const FDetail = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.85rem;
    opacity: 0.7;
    font-weight: 600;
    color: inherit;
    svg { margin-top: 2px; color: var(--clr-primary); }
`;

const RepGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
`;

const RepItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: rgba(128,128,128,0.03);
    border-radius: 20px;
    border: 1px solid rgba(128,128,128,0.05);
`;

const RepAvatar = styled.div`
    width: 64px; height: 64px;
    border-radius: 16px;
    background: var(--grad-primary);
    color: white;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 1.5rem;
`;

const RepContent = styled.div``;

const Footer = styled.footer`
    padding: 100px 0 60px;
    background: ${p => p.isDarkMode ? '#030712' : '#f8fafc'};
    border-top: 1px solid ${p => p.isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
`;

const FooterTitle = styled.h6`
    font-size: 1rem;
    font-weight: 850;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const FooterLink = styled.a`
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0.5;
    margin-bottom: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { opacity: 1; color: var(--clr-primary); transform: translateX(5px); }
`;

const SocialIcon = styled(IconButton)`
    background: rgba(128,128,128,0.1) !important;
    color: inherit !important;
    &:hover { background: var(--clr-primary) !important; color: white !important; }
`;
