import React from 'react';
import styled, { keyframes } from 'styled-components';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentPlacement = () => {
    // Dummy Data reflecting Placement and T&P Activities
    const drives = [
        { company: 'L&T Construction', type: 'Core Drive', ctc: '6.5 LPA', deadline: '20 Mar 2026', eligibility: 'CGPA >= 7.5, No Backlogs' },
        { company: 'TATA Projects', type: 'Core Drive', ctc: '6.0 LPA', deadline: '25 Mar 2026', eligibility: 'CGPA >= 7.0' },
        { company: 'TCS Ninja/Digital', type: 'IT Drive', ctc: '3.3 - 7.0 LPA', deadline: '05 Apr 2026', eligibility: 'CGPA >= 6.0' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <WorkRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Training & Placement (T&P)</PageTitle>
                        <PageSub>Campus drives, internships, and career readiness</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#A855F7">
                    <WorkRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>3</StatVal>
                    <StatLbl>Active Drives</StatLbl>
                </StatCard>
                <StatCard color="#22C55E">
                    <BusinessRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal style={{ fontSize: '1.2rem', paddingTop: '10px', paddingBottom: '10px' }}>Upload PPT</StatVal>
                    <StatLbl>Summer Internship Report</StatLbl>
                </StatCard>
                <StatCard color="#3B82F6">
                    <CodeRoundedIcon sx={{ fontSize: 24, color: '#60A5FA', mb: 1.5 }} />
                    <StatVal style={{ fontSize: '1.2rem', paddingTop: '10px', paddingBottom: '10px' }}>Register</StatVal>
                    <StatLbl>Aptitude Boot Camp</StatLbl>
                </StatCard>
            </StatsRow>

            <SectionTitle>Upcoming Campus Drives</SectionTitle>
            <Grid>
                {drives.map((drive, i) => (
                    <DriveCard key={i} style={{ animationDelay: `${i * 50}ms` }}>
                        <CardHeader>
                            <CompanyName>{drive.company}</CompanyName>
                            <TypeBadge type={drive.type}>{drive.type}</TypeBadge>
                        </CardHeader>

                        <MetaGrid>
                            <MetaItem>
                                <strong>Package (CTC):</strong> <span style={{ color: '#C084FC', fontWeight: 800 }}>{drive.ctc}</span>
                            </MetaItem>
                            <MetaItem>
                                <strong>Deadline:</strong> {drive.deadline}
                            </MetaItem>
                            <MetaItem className="span-all">
                                <strong>Eligibility:</strong> {drive.eligibility}
                            </MetaItem>
                        </MetaGrid>

                        <ActionBtn>Apply for Drive</ActionBtn>
                    </DriveCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default StudentPlacement;

const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #A855F7, #6C63FF); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(168,85,247,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const StatsRow = styled.div`display: flex; gap: 20px; margin-bottom: 32px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both; @media (max-width: 600px) { flex-direction: column; }`;
const StatCard = styled.div`flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; &:hover { transform: translateY(-3px); border-color: ${p => p.color}60; }`;
const StatVal = styled.div`font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px;`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const DriveCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s; display: flex; flex-direction: column;
  &:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.35); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px;`;
const CompanyName = styled.h3`font-size: 1.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1.2; flex: 1;`;
const TypeBadge = styled.span`
  font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.type === 'Core Drive' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)'};
  color: ${p => p.type === 'Core Drive' ? '#22C55E' : '#60A5FA'};
`;
const MetaGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; .span-all { grid-column: 1 / -1; }`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;

const ActionBtn = styled.button`
  width: 100%; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; margin-top: auto;
  background: rgba(168,85,247,0.1); color: #C084FC; border: 1px solid rgba(168,85,247,0.3);
  &:hover { background: rgba(168,85,247,0.2); }
`;
