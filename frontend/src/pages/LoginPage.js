import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Backdrop, IconButton, InputAdornment, TextField, Button, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBackRounded, EmailRounded, LockRounded } from '@mui/icons-material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import { useTheme } from '../context/ThemeContext.js';
import bg from '../assets/campus.jpg';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { status, currentUser, response, currentRole } = useSelector(state => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (status === 'success' && currentUser !== null) {
      // Role-based logic is handled by userSlice, just navigate based on currentRole
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Student' || currentRole === 'BranchRep' || currentRole === 'CdcCoordinator') navigate('/Student/dashboard');
      else if (currentRole === 'Teacher' || currentRole === 'Faculty' || currentRole === 'CdcFaculty') navigate('/Teacher/dashboard');
      else if (currentRole === 'Alumni') navigate('/Alumni/dashboard');
    } else if (status === 'failed') {
      setMessage(response || "Invalid credentials or email not verified.");
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
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
          <SidePanel>
            <Overlay />
            <SideContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <InstitutionLogo>🏛️</InstitutionLogo>
                <SideTitle>Portal Access</SideTitle>
                <SideSubtitle>Civil Engineering · IGIT Sarang</SideSubtitle>
                <DashedDivider />
                <SideText>
                  Welcome to the integrated Civil Engineering Management System.
                  Please use your registered institutional email to sign in.
                </SideText>
                <FeatureList>
                  {['Course Registration', 'Verified Attendance', 'Strategic Analytics'].map((f, i) => (
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
              <IconButton component={Link} to="/" sx={{ mb: 2, ml: -1, color: 'var(--clr-text-secondary)' }}>
                <ArrowBackRounded />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: 'var(--clr-text-primary)' }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, fontWeight: 500, color: 'var(--clr-text-muted)' }}>
                Secure sign-in to your academic dashboard
              </Typography>
            </FormHeader>

            <form onSubmit={handleSubmit}>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <TextField
                  fullWidth
                  label="Institutional Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment> }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={toggle ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment>,
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
                  <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 800 }}>
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

                <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 600, color: 'var(--clr-text-secondary)' }}>
                  New user? <Link to="/register" style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>Create Account</Link>
                </Typography>
              </motion.div>
            </form>
          </FormPanel>
        </Container>
      </AnimatePresence>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Wrapper>
  );
};

export default LoginPage;

// Reuse the styled components from RegisterPage if possible, 
// but for now I'll include the same styles to ensure it works.

const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(${bg}) center/cover no-repeat;
    position: relative;
    padding: 20px;
    &::before { content: ''; position: absolute; inset: 0; background: rgba(3, 7, 18, 0.4); backdrop-filter: blur(4px); }
`;

const Container = styled(motion.div)`
    width: 100%;
    max-width: 1000px;
    background: var(--clr-surface-1);
    border-radius: 32px;
    display: grid;
    grid-template-columns: 450px 1fr;
    overflow: hidden;
    position: relative;
    z-index: 1;
    box-shadow: 0 40px 100px rgba(0,0,0,0.4);
    @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

const SidePanel = styled.div`
    background: linear-gradient(135deg, #1e293b, #0f172a);
    position: relative;
    padding: 60px;
    @media (max-width: 850px) { display: none; }
`;

const Overlay = styled.div`
    position: absolute; inset: 0; opacity: 0.2;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 40%);
`;

const SideContent = styled.div`position: relative; z-index: 2; color: #fff;`;
const InstitutionLogo = styled.div`font-size: 3.5rem; margin-bottom: 24px;`;
const SideTitle = styled.h2`font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; margin-bottom: 4px; color: #fff;`;
const SideSubtitle = styled.p`font-size: 1rem; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; color: #818cf8;`;
const DashedDivider = styled.div`width: 60px; height: 4px; background: rgba(255,255,255,0.3); margin-bottom: 24px; border-radius: 2px;`;
const SideText = styled.p`font-size: 1.1rem; line-height: 1.6; opacity: 0.9; margin-bottom: 32px;`;
const FeatureList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const FeatureItem = styled(motion.div)`display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 600;`;
const CheckMark = styled.span`width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;`;

const FormPanel = styled.div`
    padding: 60px 80px;
    @media (max-width: 600px) { padding: 40px 30px; }
`;

const FormHeader = styled.div``;
const SubmitButton = styled(motion(Button))`
    padding: 14px !important;
    font-weight: 800 !important;
    font-size: 1rem !important;
    border-radius: 14px !important;
    background: var(--grad-primary) !important;
    text-transform: none !important;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3) !important;
`;
