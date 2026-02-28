import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Backdrop, IconButton, InputAdornment, TextField, Button, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBackRounded } from '@mui/icons-material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import { useTheme } from '../context/ThemeContext.js';
import bg from '../assets/campus.jpg';

const roleConfig = {
  Admin: { emoji: '🏛️', color: '#6366f1', label: 'Admin Portal', subtitle: 'Department Administration' },
  Student: { emoji: '🎓', color: '#8b5cf6', label: 'Student Portal', subtitle: 'Academic Dashboard' },
  Teacher: { emoji: '👨‍🏫', color: '#ec4899', label: 'Teacher Portal', subtitle: 'Faculty Management' },
  Alumni: { emoji: '🎓', color: '#10b981', label: 'Alumni Portal', subtitle: 'Legacy Network' },
};

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { status, currentUser, response, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const cfg = roleConfig[role] || roleConfig.Admin;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = {};

    if (role === "Student") {
      const rollNum = data.get('rollNumber');
      const studentName = data.get('studentName');
      const password = data.get('password');
      if (!rollNum) errors.rollNumber = true;
      if (!studentName) errors.studentName = true;
      if (!password) errors.password = true;

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setLoader(true);
      dispatch(loginUser({ rollNum, studentName, password }, role));
    } else {
      const email = data.get('email');
      const password = data.get('password');
      if (!email) errors.email = true;
      if (!password) errors.password = true;

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setLoader(true);
      dispatch(loginUser({ email, password }, role));
    }
  };

  const guestModeHandler = () => {
    const password = "zxc";
    setGuestLoader(true);
    if (role === "Admin") dispatch(loginUser({ email: "yogendra@12", password }, role));
    else if (role === "Student") dispatch(loginUser({ rollNum: "1", studentName: "Dipesh Awasthi", password }, role));
    else if (role === "Teacher") dispatch(loginUser({ email: "tony@12", password }, role));
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Student') navigate('/Student/dashboard');
      else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
      else if (currentRole === 'Alumni') navigate('/Alumni/dashboard');
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);

  return (
    <Wrapper>
      <AnimatePresence>
        <Container
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <SidePanel color={cfg.color}>
            <Overlay />
            <SideContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <InstitutionLogo>🏛️</InstitutionLogo>
                <SideTitle>{cfg.label}</SideTitle>
                <SideSubtitle>{cfg.subtitle}</SideSubtitle>
                <DashedDivider />
                <SideText>
                  Access the integrated academic management system of the Civil Engineering Department at IGIT Sarang.
                </SideText>
                <FeatureList>
                  {['Course Management', 'Attendance Tracking', 'Performance Analytics'].map((f, i) => (
                    <FeatureItem key={f} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + (i * 0.1) }}>
                      <CheckMark>✓</CheckMark> {f}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </motion.div>
            </SideContent>
          </SidePanel>

          <FormPanel>
            <FormHeader>
              <IconButton component={Link} to="/" sx={{ mb: 2, ml: -1 }}>
                <ArrowBackRounded />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                Please enter your details to sign in as <strong>{role}</strong>
              </Typography>
            </FormHeader>

            <form onSubmit={handleSubmit}>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {role === "Student" ? (
                  <>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      name="rollNumber"
                      type="number"
                      variant="outlined"
                      error={!!formErrors.rollNumber}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="studentName"
                      variant="outlined"
                      error={!!formErrors.studentName}
                      margin="normal"
                      required
                    />
                  </>
                ) : (
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    variant="outlined"
                    error={!!formErrors.email}
                    margin="normal"
                    required
                  />
                )}

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={toggle ? 'text' : 'password'}
                  variant="outlined"
                  error={!!formErrors.password}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setToggle(!toggle)} edge="end">
                          {toggle ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                  <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 700 }}>
                    Forgot Password?
                  </Typography>
                </Box>

                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loader}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loader ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </SubmitButton>

                <GuestButton
                  fullWidth
                  variant="outlined"
                  onClick={guestModeHandler}
                  disabled={guestLoader}
                  sx={{ mt: 2 }}
                >
                  Login as Guest
                </GuestButton>

                {role === 'Admin' && (
                  <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 500 }}>
                    New admin? <Link to="/Adminregister" style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>Create account</Link>
                  </Typography>
                )}
                {role === 'Alumni' && (
                  <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 500 }}>
                    New alumni? <Link to="/Alumniregister" style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>Register here</Link>
                  </Typography>
                )}
              </motion.div>
            </form>
          </FormPanel>
        </Container>
      </AnimatePresence>

      <Backdrop
        sx={{ color: '#fff', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        open={guestLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Wrapper>
  );
};

export default LoginPage;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-bg);
  background-image: 
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,0.1) 0, transparent 50%), 
    url(${bg});
  background-size: cover;
  background-position: center;
  padding: 20px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.4);
    backdrop-filter: blur(5px);
  }
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: var(--clr-surface-1);
  border-radius: 32px;
  display: grid;
  grid-template-columns: 450px 1fr;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
  border: 1px solid var(--clr-border);
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  background: ${p => p.color};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  @media (max-width: 850px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%);
`;

const SideContent = styled.div`
  position: relative;
  z-index: 2;
  color: #fff;
`;

const InstitutionLogo = styled.div`
  font-size: 3.5rem;
  margin-bottom: 24px;
`;

const SideTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const SideSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
`;

const DashedDivider = styled.div`
  width: 60px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  margin-bottom: 24px;
  border-radius: 2px;
`;

const SideText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 32px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
`;

const CheckMark = styled.span`
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const FormPanel = styled.div`
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 500px) {
    padding: 40px 30px;
  }
`;

const FormHeader = styled.div``;

const SubmitButton = styled(motion(Button))`
  padding: 14px !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  border-radius: 14px !important;
  background: var(--grad-primary) !important;
  text-transform: none !important;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3) !important;
`;

const GuestButton = styled(Button)`
  padding: 12px !important;
  font-weight: 600 !important;
  border-radius: 14px !important;
  text-transform: none !important;
  color: var(--clr-text-secondary) !important;
  border-color: var(--clr-border) !important;
  &:hover {
    background: var(--clr-surface-2) !important;
    border-color: var(--clr-primary) !important;
  }
`;
