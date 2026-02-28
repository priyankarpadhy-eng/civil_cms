import React from 'react';
import styled, { keyframes } from 'styled-components';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentRegistration = () => {
    // Dummy Data reflecting subject registration
    const subjects = [
        { code: 'CE-601', name: 'Design of Steel Structures', type: 'Core', credits: 4, status: 'Registered' },
        { code: 'CE-602', name: 'Environmental Engineering - I', type: 'Core', credits: 3, status: 'Registered' },
        { code: 'CE-603', name: 'Transportation Engineering', type: 'Core', credits: 3, status: 'Pending Prerequisite: CE-403' },
        { code: 'PE-CE-604', name: 'Advanced Foundation Engineering', type: 'Elective', credits: 3, status: 'Available' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <AppRegistrationRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Subject Registration</PageTitle>
                        <PageSub>Enrollment constraints and elective choices for BPUT Semester VI</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <AlertBox>
                <WarningRoundedIcon sx={{ color: '#F59E0B' }} />
                <span>Prerequisites Enforced: You cannot register for Advanced Structural papers until backlogs in Mechanics are cleared.</span>
            </AlertBox>

            <SectionTitle>Available Courses (Semester VI)</SectionTitle>
            <Grid>
                {subjects.map((sub, i) => (
                    <CourseCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={sub.status}>
                        <CardHeader>
                            <CourseCode>{sub.code}</CourseCode>
                            <Badge type={sub.type}>{sub.type}</Badge>
                        </CardHeader>
                        <CourseName>{sub.name}</CourseName>

                        <Meta>
                            <span>Credits: <strong>{sub.credits}</strong></span>
                        </Meta>

                        <StatusBox status={sub.status}>
                            {sub.status === 'Registered' && <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                            {sub.status.includes('Pending') && <WarningRoundedIcon sx={{ fontSize: 16 }} />}
                            {sub.status}
                        </StatusBox>

                        <ActionBtn status={sub.status} disabled={sub.status !== 'Available'}>
                            {sub.status === 'Available' ? 'Register Now' : 'Locked'}
                        </ActionBtn>
                    </CourseCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default StudentRegistration;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #3B82F6, #06B6D4); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(59,130,246,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const AlertBox = styled.div`display: flex; align-items: center; gap: 12px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); padding: 16px 20px; border-radius: 12px; margin-bottom: 32px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both; font-size: 0.85rem; font-weight: 600; color: #FBBF24;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;`;
const CourseCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.status === 'Registered' ? 'rgba(34,197,94,0.3)' : p.status.includes('Pending') ? 'rgba(239,68,68,0.3)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; display: flex; flex-direction: column; transition: transform 0.2s;
  &:hover { transform: translateY(-3px); border-color: rgba(59,130,246,0.4); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;`;
const CourseCode = styled.div`font-size: 0.85rem; font-weight: 700; color: #60A5FA; letter-spacing: 0.05em; background: rgba(59,130,246,0.1); padding: 4px 8px; border-radius: 6px;`;
const Badge = styled.span`font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 50px; background: ${p => p.type === 'Core' ? 'rgba(192,132,252,0.1)' : 'rgba(245,158,11,0.1)'}; color: ${p => p.type === 'Core' ? '#C084FC' : '#F59E0B'};`;
const CourseName = styled.h3`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3; margin-bottom: 16px; min-height: 48px;`;
const Meta = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: 16px;`;
const StatusBox = styled.div`
  display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; padding: 10px; border-radius: 8px; margin-bottom: 16px; margin-top: auto;
  background: ${p => p.status === 'Registered' ? 'rgba(34,197,94,0.1)' : p.status.includes('Pending') ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)'};
  color: ${p => p.status === 'Registered' ? '#22C55E' : p.status.includes('Pending') ? '#EF4444' : 'var(--clr-text-secondary)'};
`;
const ActionBtn = styled.button`
  width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'}; transition: all 0.2s;
  background: ${p => p.disabled ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.15)'};
  color: ${p => p.disabled ? 'var(--clr-text-muted)' : '#60A5FA'};
  border: 1px solid ${p => p.disabled ? 'transparent' : 'rgba(59,130,246,0.3)'};
  &:hover { background: ${p => p.disabled ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.25)'}; }
`;
