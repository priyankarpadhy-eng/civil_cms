import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import CountUp from 'react-countup';
import { CircularProgress, Box, Typography } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import { getSubjectList, getClassStudents } from '../../redux/sclassRelated/sclassHandle';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const BranchRepHomePage = () => {
    const dispatch = useDispatch();
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);
    const { subjectsList, sclassStudents } = useSelector((state) => state.sclass);
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName._id;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
    }, [dispatch, currentUser._id, classID]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const sectionStudents = sclassStudents.filter(s => s.section === currentUser.section);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage },
    ];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <Wrapper>
            <WelcomeCard>
                <WelcomeLeft>
                    <WelcomeInstitution>👑 Branch Representative · Dept. of Civil Engineering</WelcomeInstitution>
                    <WelcomeTitle>{greeting}, {currentUser?.name?.split(' ')[0] || 'Rep'} 👋</WelcomeTitle>
                    <WelcomeSub>
                        Batch: <WelcomeHighlight>{currentUser?.sclassName?.sclassName}</WelcomeHighlight>
                        &nbsp;·&nbsp; Section: <WelcomeHighlight>{currentUser?.section || 'A'}</WelcomeHighlight>
                    </WelcomeSub>
                </WelcomeLeft>
                <WelcomeEmoji>🏛️</WelcomeEmoji>
            </WelcomeCard>

            <StatsRow>
                <StatCard color="#A855F7" glow="rgba(168,85,247,0.22)">
                    <StatTop>
                        <StatInfo>
                            <StatLabel>Section Students</StatLabel>
                            <StatValue>
                                <CountUp start={0} end={sectionStudents.length} duration={2} />
                            </StatValue>
                            <StatSub>Your Section: {currentUser.section || 'A'}</StatSub>
                        </StatInfo>
                        <StatIconBox gradient="linear-gradient(135deg,#A855F7,#EC4899)">
                            <PeopleAltRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                        </StatIconBox>
                    </StatTop>
                    <StatBar gradient="linear-gradient(90deg,#A855F7,#EC4899)" />
                </StatCard>

                <StatCard color="#3B82F6" glow="rgba(59,130,246,0.22)">
                    <StatTop>
                        <StatInfo>
                            <StatLabel>Total Subjects</StatLabel>
                            <StatValue>
                                <CountUp start={0} end={subjectsList?.length || 0} duration={2} />
                            </StatValue>
                            <StatSub>Academic Year</StatSub>
                        </StatInfo>
                        <StatIconBox gradient="linear-gradient(135deg,#3B82F6,#06B6D4)">
                            <MenuBookRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                        </StatIconBox>
                    </StatTop>
                    <StatBar gradient="linear-gradient(90deg,#3B82F6,#06B6D4)" />
                </StatCard>

                <StatCard color="#22C55E" glow="rgba(34,197,94,0.2)">
                    <StatTop>
                        <StatInfo>
                            <StatLabel>My Attendance</StatLabel>
                            <StatValue>
                                {loading ? <CircularProgress size={20} /> : <><CountUp start={0} end={overallAttendancePercentage} duration={2} decimals={1} />%</>}
                            </StatValue>
                            <StatSub>Personal Progress</StatSub>
                        </StatInfo>
                        <StatIconBox gradient="linear-gradient(135deg,#22C55E,#10B981)">
                            <CheckBoxRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                        </StatIconBox>
                    </StatTop>
                    <StatBar gradient="linear-gradient(90deg,#22C55E,#10B981)" />
                </StatCard>
            </StatsRow>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, fontFamily: 'var(--font-display)' }}>📢 Recent Notices</Typography>
                <NoticeCard>
                    <SeeNotice />
                </NoticeCard>
            </Box>
        </Wrapper>
    );
};

export default BranchRepHomePage;

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const WelcomeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.06) 100%);
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
`;

const WelcomeLeft = styled.div``;

const WelcomeInstitution = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #A855F7;
  letter-spacing: 0.03em;
  margin-bottom: 6px;
`;

const WelcomeTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 8px;
`;

const WelcomeSub = styled.p`
  font-size: 0.88rem;
  color: var(--clr-text-secondary);
`;

const WelcomeHighlight = styled.span`
  font-weight: 700;
  color: #A855F7;
`;

const WelcomeEmoji = styled.div`
  font-size: 3.5rem;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid ${p => p.color + '25'};
  border-radius: 18px;
  padding: 22px 22px 0;
  overflow: hidden;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
`;

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.73rem;
  font-weight: 700;
  color: var(--clr-text-muted);
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--clr-text-primary);
`;

const StatSub = styled.p`
  font-size: 0.75rem;
  color: var(--clr-text-muted);
`;

const StatIconBox = styled.div`
  width: 48px; height: 48px;
  border-radius: 14px;
  background: ${p => p.gradient};
  display: flex; align-items: center; justify-content: center;
`;

const StatBar = styled.div`
  height: 3px;
  background: ${p => p.gradient};
  margin: 0 -22px;
`;

const NoticeCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 18px;
  padding: 24px;
`;
