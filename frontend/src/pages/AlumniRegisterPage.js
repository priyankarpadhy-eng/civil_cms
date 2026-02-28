import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, IconButton, TextField, Button, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBackRounded } from '@mui/icons-material';
import { registerUser } from '../redux/userRelated/userHandle';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Popup from '../components/Popup';
import { useTheme } from '../context/ThemeContext.js';
import bg from '../assets/campus.jpg';

const AlumniRegisterPage = () => {
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
        const name = data.get('name');
        const email = data.get('email');
        const registrationNum = data.get('registrationNum');
        const passoutYear = data.get('passoutYear');
        const password = data.get('password');

        if (!name || !email || !registrationNum || !passoutYear || !password) {
            setMessage("Please fill all fields");
            setShowPopup(true);
            return;
        }

        setLoader(true);
        // hardcoding school for now as per project context (IGIT Sarang) 
        // In a real multi-tenant app, this would be selected or derived.
        dispatch(registerUser({ name, email, registrationNum, passoutYear, password, role: 'Alumni' }, 'Alumni'));
    };

    useEffect(() => {
        if (status === 'success') {
            setLoader(false);
            setMessage("Registration successful! Please wait for Admin approval before logging in.");
            setShowPopup(true);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, response]);

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
                            <Badge>Alumni Network</Badge>
                            <SideTitle>Stay Connected</SideTitle>
                            <SideSubtitle>Join the IGIT Civil Legacy</SideSubtitle>
                            <DashedDivider />
                            <SideText>
                                Your professional journey is a testament to our department's excellence. Register to stay connected with your alma mater and mentor future engineers.
                            </SideText>
                        </motion.div>
                    </SideContent>
                </SidePanel>

                <FormPanel>
                    <FormHeader>
                        <IconButton component={Link} to="/Alumnilogin" sx={{ mb: 2, ml: -1 }}>
                            <ArrowBackRounded />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>
                            Alumni Registration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                            Personal details will be verified by the department.
                        </Typography>
                    </FormHeader>

                    <form onSubmit={handleSubmit}>
                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                variant="outlined"
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                required
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Registration No."
                                    name="registrationNum"
                                    variant="outlined"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Passout Year"
                                    name="passoutYear"
                                    type="number"
                                    variant="outlined"
                                    required
                                />
                            </Box>

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

                            <SubmitButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loader}
                                sx={{ mt: 4 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : 'Request Registration'}
                            </SubmitButton>

                            <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 500 }}>
                                Already registered? <Link to="/Alumnilogin" style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>Log in</Link>
                            </Typography>
                        </motion.div>
                    </form>
                </FormPanel>
            </Container>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Wrapper>
    );
};

export default AlumniRegisterPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.6);
    backdrop-filter: blur(8px);
  }
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  background: var(--clr-surface-1);
  border-radius: 32px;
  display: grid;
  grid-template-columns: 400px 1fr;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
  border: 1px solid var(--clr-border);
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  background: #10b981;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  @media (max-width: 900px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.4) 100%);
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
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 8px;
`;

const SideSubtitle = styled.p`
  font-size: 1rem;
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
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const FormPanel = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormHeader = styled.div``;

const SubmitButton = styled(motion(Button))`
  padding: 14px !important;
  font-weight: 800 !important;
  font-size: 1rem !important;
  border-radius: 14px !important;
  background: var(--grad-primary) !important;
  text-transform: none !important;
  color: white !important;
`;
