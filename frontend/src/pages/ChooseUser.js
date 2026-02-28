import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Backdrop, Box, Typography } from '@mui/material';
import { AccountCircle, School, Group, WorkspacePremium } from '@mui/icons-material';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import { useTheme } from '../context/ThemeContext.js';
import bg from '../assets/campus.jpg';

const cards = [
  {
    key: 'Admin',
    icon: <AccountCircle sx={{ fontSize: 32 }} />,
    title: 'Administrator',
    desc: 'Manage departments, classes, and academic records.',
    color: '#6366f1',
    emoji: '🏛️',
  },
  {
    key: 'Teacher',
    icon: <Group sx={{ fontSize: 32 }} />,
    title: 'Faculty Member',
    desc: 'Access your courses and student performance data.',
    color: '#ec4899',
    emoji: '👨‍🏫',
  },
  {
    key: 'Student',
    icon: <School sx={{ fontSize: 32 }} />,
    title: 'Student',
    desc: 'View your grades, attendance, and course materials.',
    color: '#8b5cf6',
    emoji: '🎓',
  },
  {
    key: 'Alumni',
    icon: <WorkspacePremium sx={{ fontSize: 32 }} />,
    title: 'Alumni',
    desc: 'Connect with peers and share your professional journey.',
    color: '#10b981',
    emoji: '🏛️',
  },
];

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (visitor === "guest") {
      setLoader(true);
      if (user === "Admin") dispatch(loginUser({ email: "yogendra@12", password }, user));
      else if (user === "Student") dispatch(loginUser({ rollNum: "1", studentName: "Dipesh Awasthi", password }, user));
      else if (user === "Teacher") dispatch(loginUser({ email: "tony@12", password }, user));
    } else {
      navigate(`/${user}login`);
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Student') navigate('/Student/dashboard');
      else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
      else if (currentRole === 'Alumni') navigate('/Alumni/dashboard');
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <Wrapper>
      <Overlay />

      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge>{visitor === 'guest' ? 'Guest Access' : 'Secure Login'}</Badge>
        <Title>Select Your Profile</Title>
        <Subtitle>Civil Engineering Portal · IGIT Sarang</Subtitle>
      </Header>

      <Grid
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            color={card.color}
            onClick={() => navigateHandler(card.key)}
          >
            <CardEmoji>{card.emoji}</CardEmoji>
            <IconCircle color={card.color}>
              {card.icon}
            </IconCircle>
            <CardTitle>{card.title}</CardTitle>
            <CardDesc>{card.desc}</CardDesc>
            <ActionText color={card.color}>
              {visitor === 'guest' ? 'Continue as Guest' : 'Login to Account'} →
            </ActionText>
          </Card>
        ))}
      </Grid>

      <AnimatePresence>
        {loader && (
          <Backdrop
            sx={{ color: '#fff', zIndex: 9999, backdropFilter: 'blur(8px)' }}
            open={loader}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress sx={{ color: 'var(--clr-primary)' }} />
              <Typography sx={{ fontWeight: 600, color: 'white' }}>Establishing session...</Typography>
            </Box>
          </Backdrop>
        )}
      </AnimatePresence>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Wrapper>
  );
};

export default ChooseUser;

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--clr-bg);
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(3, 7, 18, 0.7) 0%, rgba(3, 7, 18, 0.9) 100%);
  backdrop-filter: blur(4px);
`;

const Header = styled(motion.div)`
  text-align: center;
  position: relative;
  z-index: 2;
  margin-bottom: 60px;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 6px 16px;
  background: var(--clr-primary);
  color: white;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const Card = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: border-color 0.3s ease;
  &:hover {
    border-color: ${p => p.color};
  }
`;

const CardEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  background: ${p => p.color + '15'};
  color: ${p => p.color};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 6px 12px ${p => p.color + '10'};
`;

const CardTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

const CardDesc = styled.p`
  font-size: 0.85rem;
  color: var(--clr-text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
  min-height: 2.5rem;
`;

const ActionText = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${p => p.color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;