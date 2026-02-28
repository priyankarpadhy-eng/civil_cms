import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LinearProgress } from '@mui/material';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AdminAccreditation = () => {
    // Dummy Data reflecting NBA/NAAC
    const metrics = [
        { name: 'Faculty-to-Student Ratio (SFR)', value: '1:18', target: '1:15', status: 'Needs Improvement', progress: 83 },
        { name: 'Program Outcome (PO) Attainment', value: '72%', target: '65%', status: 'Achieved', progress: 100 },
        { name: 'Faculty Publications (SCI/Scopus)', value: '45', target: '50', status: 'On Track', progress: 90 },
        { name: 'Ph.D. Faculty Percentage', value: '60%', target: '30%', status: 'Achieved', progress: 100 },
    ];

    const sars = [
        { criteria: 'Criterion 1: Vision, Mission and PEOs', score: '50/50', status: 'Completed' },
        { criteria: 'Criterion 2: Program Curriculum', score: '85/100', status: 'Reviewing' },
        { criteria: 'Criterion 3: Course Outcomes and POs', score: '105/120', status: 'Reviewing' },
        { criteria: 'Criterion 4: Students\' Performance', score: '110/150', status: 'Needs Data' },
        { criteria: 'Criterion 5: Faculty Information', score: '180/200', status: 'Completed' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <PolicyRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Accreditation Readiness Monitor</PageTitle>
                        <PageSub>Track NBA & NAAC compliance for Dept. of Civil Engineering</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <SectionTitle>Key Performance Indicators (KPIs)</SectionTitle>
            <Grid>
                {metrics.map((m, i) => (
                    <MetricCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={m.status}>
                        <CardHeader>
                            <MetricName>{m.name}</MetricName>
                            <StatusBadge status={m.status}>{m.status}</StatusBadge>
                        </CardHeader>

                        <MetaRow>
                            <MetaItem>Current: <strong>{m.value}</strong></MetaItem>
                            <MetaItem>Target: <strong>{m.target}</strong></MetaItem>
                        </MetaRow>

                        <ProgressSection>
                            <LinearProgress variant="determinate" value={m.progress} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: m.status === 'Achieved' ? '#22C55E' : m.status === 'On Track' ? '#C084FC' : '#F59E0B' } }} />
                        </ProgressSection>
                    </MetricCard>
                ))}
            </Grid>

            <SectionTitle style={{ marginTop: '32px' }}>NBA SAR (Self Assessment Report) Tracker</SectionTitle>
            <ListGrid>
                {sars.map((sar, i) => (
                    <ListItem key={i} style={{ animationDelay: `${i * 50 + 200}ms` }}>
                        <div className="info">
                            <h4>{sar.criteria}</h4>
                            <p>Current Score: {sar.score}</p>
                        </div>
                        <ListBadge status={sar.status}>{sar.status}</ListBadge>
                    </ListItem>
                ))}
            </ListGrid>
        </Wrapper>
    );
};

export default AdminAccreditation;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`
  width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #6C63FF, #A855F7);
  display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(108,99,255,0.35);
`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;`;
const MetricCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.status === 'Needs Improvement' ? 'rgba(245,158,11,0.3)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { transform: translateY(-3px); border-color: rgba(108,99,255,0.4); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 12px;`;
const MetricName = styled.h3`font-size: 1rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3; margin: 0;`;
const StatusBadge = styled.span`
  font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.status === 'Achieved' ? 'rgba(34,197,94,0.1)' : p.status === 'On Track' ? 'rgba(192,132,252,0.1)' : 'rgba(245,158,11,0.1)'};
  color: ${p => p.status === 'Achieved' ? '#22C55E' : p.status === 'On Track' ? '#C084FC' : '#F59E0B'};
`;
const MetaRow = styled.div`display: flex; gap: 16px; margin-bottom: 16px;`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;
const ProgressSection = styled.div`margin-bottom: 4px;`;

const ListGrid = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const ListItem = styled.div`
  display: flex; align-items: center; justify-content: space-between; background: var(--clr-surface-1); border: 1px solid var(--clr-border); border-radius: 12px; padding: 16px 20px; animation: ${fadeUp} 0.4s var(--ease-out) both;
  &:hover { background: rgba(255,255,255,0.02); }
  .info h4 { font-size: 0.95rem; font-weight: 600; color: var(--clr-text-primary); margin-bottom: 4px; }
  .info p { font-size: 0.8rem; color: var(--clr-text-muted); font-weight: 500;}
`;
const ListBadge = styled.span`
  font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 50px;
  background: ${p => p.status === 'Completed' ? 'rgba(34,197,94,0.1)' : p.status === 'Reviewing' ? 'rgba(192,132,252,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${p => p.status === 'Completed' ? '#22C55E' : p.status === 'Reviewing' ? '#C084FC' : '#EF4444'};
`;
