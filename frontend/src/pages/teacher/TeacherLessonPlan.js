import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Avatar, LinearProgress } from '@mui/material';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherLessonPlan = () => {
    // Dummy Data for UI demonstration
    const units = [
        { title: 'Unit 1: Introduction to Soil Mechanics', hours: 8, completed: 8, status: 'Completed', bloom: 'Understanding' },
        { title: 'Unit 2: Permeability and Seepage', hours: 10, completed: 6, status: 'In Progress', bloom: 'Applying' },
        { title: 'Unit 3: Consolidation of Soils', hours: 12, completed: 0, status: 'Pending', bloom: 'Evaluating' },
        { title: 'Unit 4: Shear Strength', hours: 8, completed: 0, status: 'Pending', bloom: 'Analyzing' },
    ];

    const totalHours = units.reduce((acc, u) => acc + u.hours, 0);
    const completedHours = units.reduce((acc, u) => acc + u.completed, 0);
    const progress = Math.round((completedHours / totalHours) * 100);

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <AutoStoriesRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Lesson Planning & Curriculum</PageTitle>
                        <PageSub>Track BPUT Syllabus Coverage & Bloom's Taxonomy</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <ProgressCard>
                <ProgressTitle>Overall Syllabus Coverage</ProgressTitle>
                <ProgressBarWrap>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(168,85,247,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #A855F7, #6C63FF)' } }} />
                </ProgressBarWrap>
                <ProgressStats>
                    <span>{progress}% Completed</span>
                    <span>{completedHours} / {totalHours} Hours</span>
                </ProgressStats>
            </ProgressCard>

            <Grid>
                {units.map((unit, i) => (
                    <UnitCard key={i} style={{ animationDelay: `${i * 50}ms` }}>
                        <UnitHeader>
                            <UnitTitle>{unit.title}</UnitTitle>
                            <StatusBadge status={unit.status}>
                                {unit.status === 'Completed' ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : <PendingRoundedIcon sx={{ fontSize: 16 }} />}
                                {unit.status}
                            </StatusBadge>
                        </UnitHeader>
                        <UnitMeta>
                            <MetaItem><strong>Allocated Hours:</strong> {unit.hours} hrs</MetaItem>
                            <MetaItem><strong>Bloom's Level:</strong> {unit.bloom}</MetaItem>
                        </UnitMeta>
                        <LinearProgress variant="determinate" value={(unit.completed / unit.hours) * 100} sx={{ height: 6, borderRadius: 3, mb: 1, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: unit.status === 'Completed' ? '#22C55E' : '#A855F7' } }} />
                    </UnitCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherLessonPlan;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
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

const ProgressCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border);
  border-radius: 18px; padding: 24px; margin-bottom: 24px;
  animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
`;
const ProgressTitle = styled.h3`font-size: 1rem; font-weight: 700; margin-bottom: 16px;`;
const ProgressBarWrap = styled.div`margin-bottom: 12px;`;
const ProgressStats = styled.div`display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 600;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const UnitCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border);
  border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
  transition: all 0.25s;
  &:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-4px); }
`;
const UnitHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;`;
const UnitTitle = styled.h4`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3; flex: 1; padding-right: 12px;`;
const StatusBadge = styled.div`
  display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700;
  background: ${p => p.status === 'Completed' ? 'rgba(34,197,94,0.1)' : p.status === 'In Progress' ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.05)'};
  color: ${p => p.status === 'Completed' ? '#22C55E' : p.status === 'In Progress' ? '#C084FC' : 'var(--clr-text-muted)'};
  border: 1px solid ${p => p.status === 'Completed' ? 'rgba(34,197,94,0.2)' : p.status === 'In Progress' ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.1)'};
`;
const UnitMeta = styled.div`display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;
