import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Avatar, InputBase, LinearProgress } from '@mui/material';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherMentorship = () => {
    // Dummy Data
    const mentees = [
        { name: 'Aditya Dash', roll: '23CE001', cgpa: 8.4, attendance: 85, backlogs: 0 },
        { name: 'Priya Patel', roll: '23CE002', cgpa: 7.2, attendance: 68, backlogs: 1, alert: true },
        { name: 'Sanjay Kumar', roll: '23CE003', cgpa: 9.1, attendance: 92, backlogs: 0 },
        { name: 'Sneha Rao', roll: '23CE004', cgpa: 6.5, attendance: 70, backlogs: 2, alert: true },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <Diversity3RoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Mentorship & Advisement</PageTitle>
                        <PageSub>Track CGPA, Backlogs, and Attendance of Assigned Mentees</PageSub>
                    </Titles>
                </HeaderLeft>
                <SearchBox>
                    <SearchRoundedIcon sx={{ color: 'var(--clr-text-muted)', fontSize: 20 }} />
                    <InputBase placeholder="Search mentee name or roll..." sx={{ color: 'var(--clr-text-primary)', ml: 1, flex: 1, fontSize: '0.9rem' }} />
                </SearchBox>
            </Header>

            <Grid>
                {mentees.map((mentee, i) => (
                    <MenteeCard key={i} alert={mentee.alert} style={{ animationDelay: `${i * 50}ms` }}>
                        <CardTop>
                            <AvatarWrap>
                                <Avatar sx={{ width: 48, height: 48, background: mentee.alert ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)', color: mentee.alert ? '#EF4444' : '#A855F7', fontWeight: 800 }}>
                                    {mentee.name[0]}
                                </Avatar>
                            </AvatarWrap>
                            <MenteeInfo>
                                <MenteeName>{mentee.name}</MenteeName>
                                <MenteeRoll>Roll No. {mentee.roll}</MenteeRoll>
                            </MenteeInfo>
                            {mentee.alert && (
                                <AlertIcon>
                                    <WarningAmberRoundedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
                                </AlertIcon>
                            )}
                        </CardTop>

                        <StatsRow>
                            <Stat>
                                <StatLbl>CGPA</StatLbl>
                                <StatVal>{mentee.cgpa.toFixed(1)} <TrendingUpRoundedIcon sx={{ fontSize: 14, color: mentee.cgpa >= 8 ? '#22C55E' : '#F59E0B' }} /></StatVal>
                            </Stat>
                            <Stat>
                                <StatLbl>Attendance</StatLbl>
                                <StatVal color={mentee.attendance >= 75 ? '#22C55E' : '#EF4444'}>{mentee.attendance}%</StatVal>
                            </Stat>
                            <Stat>
                                <StatLbl>Backlogs</StatLbl>
                                <StatVal color={mentee.backlogs > 0 ? '#EF4444' : 'var(--clr-text-primary)'}>{mentee.backlogs}</StatVal>
                            </Stat>
                        </StatsRow>

                        <ActionRow>
                            <ActionBtn alert={mentee.alert}>
                                {mentee.alert ? 'Schedule Counseling' : 'View Full Profile'}
                            </ActionBtn>
                        </ActionRow>
                    </MenteeCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherMentorship;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;
`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, #A855F7, #6C63FF);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(168,85,247,0.35);
`;
const Titles = styled.div``;
const PageTitle = styled.h1`
  font-family: var(--font-display); font-size: 1.6rem; font-weight: 800;
  color: var(--clr-text-primary); margin-bottom: 4px; letter-spacing: -0.02em;
`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;
const SearchBox = styled.div`
  display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border);
  padding: 8px 16px; border-radius: 50px; min-width: 250px; transition: all 0.2s;
  &:focus-within { border-color: #C084FC; background: rgba(168,85,247,0.05); }
`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;`;
const MenteeCard = styled.div`
  background: var(--clr-surface-2); 
  border: 1px solid ${p => p.alert ? 'rgba(239,68,68,0.2)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
  transition: all 0.25s; flex-direction: column; display: flex;
  &:hover { border-color: ${p => p.alert ? 'rgba(239,68,68,0.4)' : 'rgba(168,85,247,0.35)'}; transform: translateY(-4px); }
`;
const CardTop = styled.div`display: flex; align-items: center; gap: 14px; margin-bottom: 20px; position: relative;`;
const AvatarWrap = styled.div``;
const MenteeInfo = styled.div`flex: 1;`;
const MenteeName = styled.h3`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.2;`;
const MenteeRoll = styled.p`font-size: 0.8rem; font-weight: 600; color: var(--clr-text-muted); margin-top: 4px;`;
const AlertIcon = styled.div`position: absolute; top: 0; right: 0;`;

const StatsRow = styled.div`display: flex; justify-content: space-between; border-top: 1px solid var(--clr-border); border-bottom: 1px solid var(--clr-border); padding: 14px 0; margin-bottom: 16px;`;
const Stat = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const StatLbl = styled.p`font-size: 0.72rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase;`;
const StatVal = styled.p`font-size: 1.1rem; font-weight: 800; color: ${p => p.color || 'var(--clr-text-primary)'}; display: flex; align-items: center; gap: 4px;`;

const ActionRow = styled.div`display: flex;`;
const ActionBtn = styled.button`
  width: 100%; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  background: ${p => p.alert ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)'};
  color: ${p => p.alert ? '#EF4444' : '#A855F7'};
  border: 1px solid ${p => p.alert ? 'rgba(239,68,68,0.2)' : 'rgba(168,85,247,0.2)'};
  &:hover { background: ${p => p.alert ? 'rgba(239,68,68,0.15)' : 'rgba(168,85,247,0.15)'}; }
`;
