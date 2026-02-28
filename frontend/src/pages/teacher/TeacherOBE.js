import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LinearProgress } from '@mui/material';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherOBE = () => {
    // Dummy Data reflecting CO-PO mapping and attainment for Civil Engg
    const outcomes = [
        { code: 'CO1', desc: 'Design a three-story building using seismic codes', attainment: 75, target: 70, status: 'Achieved' },
        { code: 'CO2', desc: 'Analyze soil bearing capacity for deep foundations', attainment: 62, target: 65, status: 'Gap Identified' },
        { code: 'CO3', desc: 'Apply fluid mechanics principles to open channel flow', attainment: 81, target: 75, status: 'Achieved' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <TimelineRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>OBE & Accreditation (NBA/NAAC)</PageTitle>
                        <PageSub>Course Outcome (CO) Attainment & Gap Analysis</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <AlertCard>
                <WarningAmberRoundedIcon sx={{ color: '#F59E0B', fontSize: 24, flexShrink: 0 }} />
                <div>
                    <strong>Action Required:</strong> Gap identified in CO2 (Soil Bearing Capacity). A remedial class or revised mapping to PO3 (Design/Development of Solutions) is recommended.
                </div>
            </AlertCard>

            <Grid>
                {outcomes.map((co, i) => (
                    <COCard key={i} style={{ animationDelay: `${i * 50}ms` }} gap={co.status === 'Gap Identified'}>
                        <CardHeader>
                            <COCode>{co.code}</COCode>
                            <StatusBadge gap={co.status === 'Gap Identified'}>
                                {co.status === 'Achieved' ? <CheckCircleRoundedIcon sx={{ fontSize: 14 }} /> : <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />}
                                {co.status}
                            </StatusBadge>
                        </CardHeader>
                        <CODesc>{co.desc}</CODesc>

                        <ProgressSection>
                            <div className="top">
                                <span>Attainment: <strong style={{ color: co.status === 'Achieved' ? '#22C55E' : '#EF4444' }}>{co.attainment}%</strong></span>
                                <span>Target: {co.target}%</span>
                            </div>
                            <LinearProgress variant="determinate" value={co.attainment} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: co.status === 'Achieved' ? '#22C55E' : '#EF4444' } }} />
                        </ProgressSection>
                    </COCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherOBE;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`
  width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #A855F7, #6C63FF);
  display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(168,85,247,0.35);
`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const AlertCard = styled.div`
  display: flex; align-items: flex-start; gap: 14px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
  padding: 16px 20px; border-radius: 12px; font-size: 0.85rem; color: rgba(240,239,255,0.8); line-height: 1.5; margin-bottom: 24px;
  animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
  strong { color: #F59E0B; }
`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const COCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.gap ? 'rgba(239,68,68,0.3)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); border-color: ${p => p.gap ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.35)'}; }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;`;
const COCode = styled.div`font-size: 0.95rem; font-weight: 800; color: #C084FC; font-family: var(--font-base); background: rgba(168,85,247,0.1); padding: 4px 10px; border-radius: 6px;`;
const StatusBadge = styled.span`
  display: flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px;
  background: ${p => p.gap ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'};
  color: ${p => p.gap ? '#EF4444' : '#22C55E'};
`;
const CODesc = styled.p`font-size: 0.9rem; color: var(--clr-text-primary); line-height: 1.4; margin-bottom: 24px;`;
const ProgressSection = styled.div`
  .top { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--clr-text-secondary); margin-bottom: 8px; }
`;
