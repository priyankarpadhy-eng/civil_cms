import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Divider,
    Dialog
} from '@mui/material';
import { supabase } from '../supabaseClient';
import { Visibility, VisibilityOff, ArrowBackRounded, EmailRounded, LocalPhoneRounded, PersonRounded, LockRounded } from '@mui/icons-material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { registerUser } from '../redux/userRelated/userHandle';
import { underControl } from '../redux/userRelated/userSlice';
import Popup from '../components/Popup';
import bg from '../assets/campus.jpg';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, response, error } = useSelector(state => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

    useEffect(() => {
        // Auto-refresh when user clicks link in email and gets authenticated
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Reload page cleanly so Redux rebuilds the user profile correctly from the new session
                window.location.href = '/';
            }
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            setShowPopup(true);
            return;
        }

        setLoader(true);
        dispatch(registerUser({ name, email, phone, password }));
    };

    useEffect(() => {
        if (status === 'added') {
            setLoader(false);
            setVerifyDialogOpen(true);
            dispatch(underControl());
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error — please try again.");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, response, error, dispatch]);

    return (
        <Wrapper>
            <Container
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <FormPanel>
                    <FormHeader>
                        <IconButton component={Link} to="/" sx={{ mb: 2, ml: -1, color: 'var(--clr-text-secondary)' }}>
                            <ArrowBackRounded />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: 'var(--clr-text-primary)' }}>
                            Join the Portal
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4, fontWeight: 500, color: 'var(--clr-text-muted)' }}>
                            Student Signup · BPUT Curriculum · Civil IGIT Sarang
                        </Typography>
                    </FormHeader>

                    <form onSubmit={handleRegister}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment> }}
                        />

                        <TextField
                            fullWidth
                            label="Institutional Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment> }}
                        />

                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment> }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: 'var(--clr-primary)', fontSize: 18 }} /></InputAdornment> }}
                        />

                        <SubmitButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loader}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            sx={{ mt: 4 }}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </SubmitButton>

                        <Typography variant="body2" align="center" sx={{ mt: 3, fontWeight: 600, color: 'var(--clr-text-secondary)' }}>
                            Already registered? <Link to="/login" style={{ color: 'var(--clr-primary)', textDecoration: 'none' }}>Sign In here</Link>
                        </Typography>
                    </form>
                </FormPanel>

                <RightPanel>
                    <Overlay />
                    <Content>
                        <Badge>v2.0 Beta</Badge>
                        <SideTitle>Secure Access</SideTitle>
                        <Divider sx={{ width: 40, height: 3, background: '#fff', borderRadius: 2, mb: 3 }} />
                        <SideText>
                            Verify your institutional email to unlock your personal ERP dashboard.
                            Academic records, placement tracking, and attendance reports are one step away.
                        </SideText>
                        <PointList>
                            {['Email Verification required', 'Role assignment by department', 'Encrypted data storage'].map(p => (
                                <Point key={p}>⚡ {p}</Point>
                            ))}
                        </PointList>
                    </Content>
                </RightPanel>
            </Container>

            {/* Email Verification Dialog */}
            <Dialog
                open={verifyDialogOpen}
                PaperProps={{
                    sx: { borderRadius: 5, p: 2, textAlign: 'center', maxWidth: 420, background: 'var(--clr-surface-1)', border: '1px solid var(--clr-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }
                }}
            >
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: 80, height: 80, background: 'rgba(108, 99, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <EmailRounded sx={{ fontSize: 40, color: 'var(--clr-primary)' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={900} mb={1.5} color="var(--clr-text-primary)">
                        Check Your Email
                    </Typography>
                    <Typography color="var(--clr-text-secondary)" mb={4} lineHeight={1.6}>
                        We've sent a verification link to <strong>{email}</strong>.
                        Please click the link inside to activate your account.
                        <br /><br />
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Waiting for verification...</span>
                    </Typography>
                    <CircularProgress size={30} thickness={5} sx={{ color: 'var(--clr-primary)' }} />
                </Box>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Wrapper>
    );
};

export default RegisterPage;

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
    grid-template-columns: 1fr 400px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    box-shadow: 0 40px 100px rgba(0,0,0,0.4);
    @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

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

const RightPanel = styled.div`
    background: linear-gradient(135deg, #1e293b, #0f172a);
    position: relative;
    padding: 60px 40px;
    display: flex;
    align-items: center;
    @media (max-width: 850px) { display: none; }
`;

const Overlay = styled.div`
    position: absolute; inset: 0;
    opacity: 0.1;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 40%);
`;

const Content = styled.div`position: relative; z-index: 2; color: #fff;`;
const Badge = styled.div`display: inline-block; padding: 4px 12px; border-radius: 50px; background: rgba(255,255,255,0.1); font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.2);`;
const SideTitle = styled.h2`font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: 12px;`;
const SideText = styled.p`font-size: 0.95rem; line-height: 1.6; opacity: 0.8; margin-bottom: 30px;`;
const PointList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const Point = styled.div`font-size: 0.85rem; font-weight: 600; opacity: 0.9;`;
