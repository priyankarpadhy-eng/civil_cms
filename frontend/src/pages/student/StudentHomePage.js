import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { CircularProgress, Box, Typography } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { useTheme } from '../../context/ThemeContext.js';

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  if (!currentUser) return null;

  const classID = currentUser?.sclassName?._id || currentUser?.sclass_id || null;

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
    if (classID) {
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, currentUser, classID]);

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const numberOfSubjects = subjectsList?.length || 0;
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;
  const attendanceOk = overallAttendancePercentage >= 75;

  const chartData = [
    { name: 'Present', value: overallAttendancePercentage },
    { name: 'Absent', value: overallAbsentPercentage },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Wrapper>
      <HeaderCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <Badge>IGIT Sarang · Civil Engineering</Badge>
          <GreetingText>{greeting}, {currentUser?.name?.split(' ')[0]}</GreetingText>
          <ClassInfo>
            <InfoItem>Class: <strong>{currentUser?.sclassName?.sclassName}</strong></InfoItem>
            <InfoItemDivider />
            <InfoItem>Roll No: <strong>{currentUser?.rollNum}</strong></InfoItem>
          </ClassInfo>
        </HeaderContent>
        <HeaderIllustration>📚</HeaderIllustration>
      </HeaderCard>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          color="#6366f1"
        >
          <StatHeader>
            <IconWrapper color="#6366f1">
              <MenuBookRoundedIcon />
            </IconWrapper>
            <StatLabel>Academic Load</StatLabel>
          </StatHeader>
          <StatValue>
            <CountUp start={0} end={numberOfSubjects} duration={2} />
            <StatUnit>Subjects</StatUnit>
          </StatValue>
          <StatFooter>Enrolled this semester</StatFooter>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          color={attendanceOk ? "#10b981" : "#f43f5e"}
        >
          <StatHeader>
            <IconWrapper color={attendanceOk ? "#10b981" : "#f43f5e"}>
              <CheckBoxRoundedIcon />
            </IconWrapper>
            <StatLabel>Attendance Rate</StatLabel>
          </StatHeader>
          <StatValue>
            {loading ? <CircularProgress size={24} /> : (
              <>
                <CountUp start={0} end={overallAttendancePercentage} duration={2} decimals={1} />
                <StatUnit>%</StatUnit>
              </>
            )}
          </StatValue>
          <StatIndicator ok={attendanceOk}>
            {attendanceOk ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
            {attendanceOk ? 'Requirement Met' : 'Action Required'}
          </StatIndicator>
        </StatCard>

        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Attendance Breakdown
          </Typography>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {subjectAttendance.length > 0 ? (
              <CustomPieChart data={chartData} />
            ) : (
              <Typography variant="body2" color="text.secondary">No records found</Typography>
            )}
          </Box>
        </ChartCard>
      </StatsGrid>

      <BottomGrid>
        <NoticeSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SectionTitle>📢 Department Notices</SectionTitle>
          <SeeNotice />
        </NoticeSection>
      </BottomGrid>
    </Wrapper>
  );
};

export default StudentHomePage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeaderCard = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 300px; height: 100%;
    background: linear-gradient(90deg, transparent, var(--clr-surface-2));
    opacity: 0.5;
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Badge = styled.div`
  background: var(--clr-primary-glow);
  color: var(--clr-primary);
  display: inline-block;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
`;

const GreetingText = styled.h1`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--clr-text-primary);
  margin-bottom: 12px;
`;

const ClassInfo = styled.div`
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
  font-size: 5rem;
  position: relative;
  z-index: 1;
  @media (max-width: 600px) { display: none; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const StatCard = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${p => p.color + '15'};
  color: ${p => p.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  color: var(--clr-text-primary);
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
`;

const StatUnit = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--clr-text-muted);
`;

const StatFooter = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--clr-text-muted);
`;

const StatIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => p.ok ? '#10b981' : '#f43f5e'};
  svg { font-size: 1rem; }
`;

const ChartCard = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
`;

const NoticeSection = styled(motion.div)`
  background: var(--clr-surface-1);
  border: 1px solid var(--clr-border);
  border-radius: 28px;
  padding: 40px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`;