import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LinearProgress } from '@mui/material';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherResearch = () => {
    // Dummy Data reflecting Civil Engg PhD Tracking & Grants
    const scholars = [
        { name: 'Dr. R. K. Mohanty (Candidate: Ashok)', topic: 'Geotechnical Applications of Flyash', progress: 65, phase: 'Periodic Review' },
        { name: 'Dr. S. Panda (Candidate: Sushil)', topic: 'Earthquake Resistant Design Mapping', progress: 95, phase: 'Thesis Submission' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <ScienceRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Advanced Research & PhD Tracking</PageTitle>
                        <PageSub>Manage BPUT Research Milestones & Sponsored Projects</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#A855F7">
                    <ScienceRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>4</StatVal>
                    <StatLbl>Active PhD Scholars</StatLbl>
                </StatCard>
                <StatCard color="#3B82F6">
                    <EmojiEventsRoundedIcon sx={{ fontSize: 24, color: '#60A5FA', mb: 1.5 }} />
                    <StatVal>₹12.5<span className="unit">L</span></StatVal>
                    <StatLbl>R&D Grant Funds</StatLbl>
                </StatCard>
                <StatCard color="#22C55E">
                    <MenuBookRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal>14</StatVal>
                    <StatLbl>Faculty Publications</StatLbl>
                </StatCard>
            </StatsRow>

            <SectionTitle>Doctoral Scholar Lifecycle Status</SectionTitle>
            <Grid>
                {scholars.map((scholar, i) => (
                    <ProjCard key={i} style={{ animationDelay: `${i * 50}ms` }}>
                        <CardHeader>
                            <ProjTitle>{scholar.topic}</ProjTitle>
                        </CardHeader>
                        <MetaGrid>
                            <MetaItem>
                                <strong>Supervisor:</strong> {scholar.name}
                            </MetaItem>
                            <MetaItem>
                                <strong>Phase:</strong> <span style={{ color: '#C084FC', fontWeight: 700 }}>{scholar.phase}</span>
                            </MetaItem>
                        </MetaGrid>

                        <ProgressSection>
                            <div className="top"><span>BPUT Milestone Progress</span><span>{scholar.progress}%</span></div>
                            <LinearProgress variant="determinate" value={scholar.progress} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: '#A855F7' } }} />
                        </ProgressSection>
                    </ProjCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherResearch;

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

const StatsRow = styled.div`display: flex; gap: 20px; margin-bottom: 32px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both; @media (max-width: 600px) { flex-direction: column; }`;
const StatCard = styled.div`
  flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;
`;
const StatVal = styled.div`
  font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px;
  .unit { font-size: 1.2rem; margin-left: 2px; opacity: 0.7; }
`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;`;
const ProjCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s; display: flex; flex-direction: column;
  &:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-4px); }
`;
const CardHeader = styled.div`margin-bottom: 16px;`;
const ProjTitle = styled.h3`font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3;`;
const MetaGrid = styled.div`display: grid; gap: 12px; margin-bottom: 24px;`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;
const ProgressSection = styled.div`
  .top { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 8px; }
`;
