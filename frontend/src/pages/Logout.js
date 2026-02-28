import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Avatar } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Logout = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Wrapper>
      <StyledCard
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <IconBox>
          <LogoutRoundedIcon />
        </IconBox>

        <Avatar sx={{
          width: 70, height: 70,
          background: 'var(--grad-primary)',
          mb: 2,
          fontSize: '1.8rem',
          fontWeight: 800,
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
        }}>
          {String(currentUser?.name || 'U').charAt(0)}
        </Avatar>

        <Title variant="h5">Sign Out</Title>
        <Message>
          Hello <strong>{currentUser?.name}</strong>, are you sure you want to end your current session?
        </Message>

        <Actions>
          <CancelBtn onClick={handleCancel}>
            Keep me signed in
          </CancelBtn>
          <LogoutBtn onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Confirm Sign Out
          </LogoutBtn>
        </Actions>
      </StyledCard>
    </Wrapper>
  );
};

export default Logout;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px);
  padding: 20px;
`;

const StyledCard = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 32px;
  padding: 48px;
  width: 100%;
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const Title = styled(Typography)`
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  color: var(--clr-text-primary);
  margin-bottom: 8px !important;
`;

const Message = styled(Typography)`
  color: var(--clr-text-secondary);
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
  margin-bottom: 32px !important;
  strong { color: var(--clr-text-primary); }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const LogoutBtn = styled(motion.button)`
  background: #f43f5e;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #e11d48; }
`;

const CancelBtn = styled.button`
  background: transparent;
  color: var(--clr-text-muted);
  border: 1px solid var(--clr-border);
  padding: 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { 
    background: var(--clr-surface-2); 
    color: var(--clr-text-primary);
    border-color: var(--clr-text-muted);
  }
`;
