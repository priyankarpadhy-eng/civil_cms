import React, { useEffect } from 'react';
import styled from 'styled-components';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, LinearProgress, Paper, Divider } from '@mui/material';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import SeeNotice from '../../components/SeeNotice';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import { useTheme } from '../../context/ThemeContext.js';

const TeacherHomePage = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const numberOfStudents = sclassStudents?.length || 0;
  const numberOfSessions = subjectDetails?.sessions || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Dummy Progress Log
  const syllabusProgress = 65; // This could be dynamic based on sessions logged vs total sessions
  const logs = [
    { date: '2024-02-27', activity: 'Conducted Lecture on Soil Liquefaction', batch: currentUser.teachSclass?.sclassName },
    { date: '2024-02-26', activity: 'Practical Session: Sieve Analysis Lab', batch: currentUser.teachSclass?.sclassName },
    { date: '2024-02-24', activity: 'Assignment 2 Evaluation Completed', batch: currentUser.teachSclass?.sclassName },
  ];

  return (
    <Wrapper>
      <HeaderCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <Badge>Faculty Portal · Civil Engineering</Badge>
          <GreetingText>{greeting}, {currentUser?.name?.split(' ')[0]}</GreetingText>
          <ContextInfo>
            <InfoItem>Primary Batch: <strong>{currentUser?.teachSclass?.sclassName}</strong></InfoItem>
            <InfoItemDivider />
            <InfoItem>Specialization: <strong>Structures</strong></InfoItem>
          </ContextInfo>
        </HeaderContent>
        <HeaderIllustration>🏛️</HeaderIllustration>
      </HeaderCard>

      <StatsGrid>
        <StatCard delay={0.1} color="#6366f1">
          <StatHeader>
            <IconWrapper color="#6366f1"><GroupsRoundedIcon /></IconWrapper>
            <StatLabel>Total Students</StatLabel>
          </StatHeader>
          <StatValue><CountUp start={0} end={numberOfStudents} duration={2} /></StatValue>
          <StatFooter>Across assigned batches</StatFooter>
        </StatCard>

        <StatCard delay={0.2} color="#ec4899">
          <StatHeader>
            <IconWrapper color="#ec4899"><LibraryBooksRoundedIcon /></IconWrapper>
            <StatLabel>Total Sessions</StatLabel>
          </StatHeader>
          <StatValue><CountUp start={0} end={numberOfSessions} duration={2} /></StatValue>
          <StatFooter>Planned for this semester</StatFooter>
        </StatCard>

        <StatCard delay={0.3} color="#10b981">
          <StatHeader>
            <IconWrapper color="#10b981"><AssignmentRoundedIcon /></IconWrapper>
            <StatLabel>Evaluations</StatLabel>
          </StatHeader>
          <StatValue><CountUp start={0} end={12} duration={2} /></StatValue>
          <StatFooter>Tests & Assignments</StatFooter>
        </StatCard>

        <StatCard delay={0.4} color="#f59e0b">
          <StatHeader>
            <IconWrapper color="#f59e0b"><AccessTimeFilledRoundedIcon /></IconWrapper>
            <StatLabel>Academic Hours</StatLabel>
          </StatHeader>
          <StatValue>
            <CountUp start={0} end={45} duration={2} />
            <StatUnit>hrs</StatUnit>
          </StatValue>
          <StatFooter>Logged teaching time</StatFooter>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainColumn
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionTitle>📚 Assigned Batches & Progress</SectionTitle>
          <BatchCard>
            <BatchHeader>
              <Box>
                <Typography variant="h6" fontWeight={800}>{currentUser?.teachSclass?.sclassName}</Typography>
                <Typography variant="caption" color="textSecondary" fontWeight={700}>SECTION A & B · 2024-2028 COHORT</Typography>
              </Box>
              <Badge small color="#6366f1">Active</Badge>
            </BatchHeader>
            <Divider sx={{ my: 2 }} />
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight={700} color="textSecondary">
                  Subject: {currentUser?.teachSubject?.subName}
                </Typography>
                <Typography variant="body2" fontWeight={800} color="primary">
                  {syllabusProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={syllabusProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'var(--clr-surface-3)',
                  '& .MuiLinearProgress-bar': { background: 'var(--grad-primary)' }
                }}
              />
            </Box>
            <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase' }}>Recent Progress Log</Typography>
            <LogList>
              {logs.map((log, i) => (
                <LogItem key={i}>
                  <LogDot />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{log.activity}</Typography>
                    <Typography variant="caption" color="textSecondary">{log.date} · {log.batch}</Typography>
                  </Box>
                </LogItem>
              ))}
            </LogList>
          </BatchCard>

          <Box mt={4}>
            <SectionTitle>📢 Department Notices</SectionTitle>
            <NoticeCard>
              <SeeNotice />
            </NoticeCard>
          </Box>
        </MainColumn>

        <SideColumn
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SectionTitle>⚡ Fast Actions</SectionTitle>
          <QuickActionsList>
            <ActionItem whileHover={{ x: 8 }} color="#6366f1">
              <GroupsRoundedIcon />
              <span>Mark Batch Attendance</span>
            </ActionItem>
            <ActionItem whileHover={{ x: 8 }} color="#ec4899">
              <AssignmentRoundedIcon />
              <span>Upload IA Marks</span>
            </ActionItem>
            <ActionItem whileHover={{ x: 8 }} color="#10b981">
              <TimelineRoundedIcon />
              <span>Update Syllabus Log</span>
            </ActionItem>
          </QuickActionsList>

          <SyllabusTrackerCard mt={4}>
            <Typography variant="subtitle2" fontWeight={800} mb={2}>SYLLABUS DEADLINE</Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgressWrapper>
                <svg width="100" height="100">
                  <circle cx="50" cy="50" r="40" stroke="var(--clr-border)" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="var(--clr-primary)" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 75) / 100} strokeLinecap="round" />
                </svg>
                <CenterText>75%</CenterText>
              </CircularProgressWrapper>
            </Box>
            <Typography variant="body2" color="textSecondary" mt={2} textAlign="center">
              Estimated <strong>15 days</strong> left to complete Module 4 as per academic calendar.
            </Typography>
          </SyllabusTrackerCard>
        </SideColumn>
      </ContentGrid>
    </Wrapper>
  );
};

export default TeacherHomePage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeaderCard = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 32px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%; right: -10%;
    width: 400px; height: 200%;
    background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Badge = styled.div`
  background: ${p => p.color || '#fdf2f8'};
  color: ${p => p.color ? '#fff' : '#db2777'};
  display: inline-block;
  padding: ${p => p.small ? '4px 12px' : '6px 14px'};
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${p => p.small ? '0' : '20px'};
`;

const GreetingText = styled.h1`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--clr-text-primary);
  margin-bottom: 12px;
`;

const ContextInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const InfoItem = styled.span`
  font-size: 0.95rem;
  color: var(--clr-text-secondary);
  strong { color: var(--clr-text-primary); }
`;

const InfoItemDivider = styled.div`
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--clr-text-muted);
`;

const HeaderIllustration = styled.div`
  font-size: 4rem;
  position: relative;
  z-index: 1;
  opacity: 0.8;
  @media (max-width: 600px) { display: none; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const StatCard = styled(({ delay, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    {...props}
  />
))`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 24px;
  padding: 24px;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.color + '15'};
  color: ${p => p.color};
  display: flex;
  align-items: center;
  justify-content: center;
  svg { font-size: 1.25rem; }
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--clr-text-primary);
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
`;

const StatUnit = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text-muted);
`;

const StatFooter = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--clr-text-muted);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const MainColumn = styled(motion.div)``;
const SideColumn = styled(motion.div)``;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 24px;
`;

const BatchCard = styled.div`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
`;

const BatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const LogDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--clr-primary);
  margin-top: 6px;
  flex-shrink: 0;
`;

const NoticeCard = styled.div`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 24px;
`;

const QuickActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionItem = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: ${p => p.color};
  }
  svg {
    color: ${p => p.color};
    font-size: 1.5rem;
  }
  span {
    font-weight: 700;
    color: var(--clr-text-primary);
    font-size: 0.95rem;
  }
`;

const SyllabusTrackerCard = styled(Box)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CircularProgressWrapper = styled.div`
  position: relative;
  width: 100px; height: 100px;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--clr-text-primary);
`;