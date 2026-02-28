import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, IconButton, TextField, Button, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBackRounded } from '@mui/icons-material';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Popup from '../../components/Popup';
import { useTheme } from '../../context/ThemeContext.js';
import bg from '../../assets/campus.jpg';

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { status, currentUser, response, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('adminName');
    const schoolName = data.get('schoolName');
    const email = data.get('email');
    const password = data.get('password');

    if (!name || !schoolName || !email || !password) return;

    setLoader(true);
    dispatch(registerUser({ name, email, password, role: 'Admin', schoolName }, 'Admin'));
  };

  useEffect(() => {
    if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
      navigate('/Admin/dashboard');
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setLoader(false);
    }
  }, [status, currentUser, currentRole, navigate, response]);

  return (
    <Wrapper>
      <Container
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SidePanel>
          <Overlay />
          <SideContent>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Badge>Administration Registration</Badge>
              <SideTitle>Department Portal Setup</SideTitle>
              <SideSubtitle>IGIT Sarang · Civil Engineering</SideSubtitle>
              <DashedDivider />
              <SideText>
                Initialize the central command center for your department. Manage faculties, students, and academic strategies in one place.
              </SideText>
              <StepsList>
                {[
                  { step: '01', text: 'Create Admin Account' },
                  { step: '02', text: 'Define Department Structure' },
                  { step: '03', text: 'Onboard Faculty & Students' }
                ].map((s, i) => (
                  <StepItem key={s.step} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <StepCircle>{s.step}</StepCircle>
                    <StepText>{s.text}</StepText>
                  </StepItem>
                ))}
              </StepsList>
            </motion.div>
          </SideContent>
        </SidePanel>

        <FormPanel>
          <FormHeader>
            <IconButton component={Link} to="/" sx={{ mb: 2, ml: -1 }}>
              <ArrowBackRounded />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>
              Join the Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
              Create your administrator profile to begin.
            </Typography>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Admin Name"
                  name="adminName"
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Institution Name"
                  name="schoolName"
                  variant="outlined"
                  defaultValue="IGIT Sarang"
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={toggle ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setToggle(!toggle)} edge="end">
                      {toggle ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />

              <TermsBox>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  By registering, you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>.
                </Typography>
              </TermsBox>

              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loader}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loader ? <CircularProgress size={24} color="inherit" /> : 'Register Department'}
              </SubmitButton>

              <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 500 }}>
                Already have an account? <Link to="/Adminlogin" style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>Sign in</Link>
              </Typography>
            </motion.div>
          </form>
        </FormPanel>
      </Container>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Wrapper>
  );
};

export default AdminRegisterPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--clr-bg);
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.5);
    backdrop-filter: blur(8px);
  }
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 1100px;
  background: var(--clr-surface-1);
  border-radius: 32px;
  display: grid;
  grid-template-columns: 480px 1fr;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
  border: 1px solid var(--clr-border);
  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  background: var(--clr-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  @media (max-width: 950px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(129, 140, 248, 0.4) 100%);
`;

const SideContent = styled.div`
  position: relative;
  z-index: 2;
  color: #fff;
`;

const Badge = styled.div`
  background: rgba(255,255,255,0.2);
  display: inline-block;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
`;

const SideTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 8px;
`;

const SideSubtitle = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.85;
  margin-bottom: 32px;
`;

const DashedDivider = styled.div`
  width: 50px;
  height: 4px;
  background: white;
  border-radius: 2px;
  margin-bottom: 32px;
`;

const SideText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.9;
  margin-bottom: 40px;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StepItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: var(--clr-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
`;

const StepText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
`;

const FormPanel = styled.div`
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 600px) {
    padding: 40px 30px;
  }
`;

const FormHeader = styled.div``;

const TermsBox = styled.div`
  margin: 20px 0 32px;
  padding: 12px;
  background: var(--clr-surface-2);
  border-radius: 12px;
  text-align: center;
`;

const SubmitButton = styled(motion(Button))`
  padding: 16px !important;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  border-radius: 16px !important;
  background: var(--grad-primary) !important;
  text-transform: none !important;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3) !important;
`;
