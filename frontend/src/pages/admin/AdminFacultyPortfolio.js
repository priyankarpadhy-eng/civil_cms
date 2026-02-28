import React from 'react';
import styled, { keyframes } from 'styled-components';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AdminFacultyPortfolio = () => {
    // Dummy Data reflecting IGIT Civil Dept Faculty metrics
    const portfolio = [
        { name: 'Dr. Ramesh Kumar', role: 'Professor', publications: 24, patents: 2, fdps: 5 },
        { name: 'Dr. Smita Panda', role: 'Associate Prof', publications: 18, patents: 1, fdps: 8 },
        { name: 'Sanjay Mishra', role: 'Assistant Prof', publications: 5, patents: 0, fdps: 12 },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <GroupsRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Faculty Portfolio Management</PageTitle>
                        <PageSub>Centralized records of research, patents, and FDPs</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#A855F7">
                    <PictureAsPdfRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>47</StatVal>
                    <StatLbl>Total Publications</StatLbl>
                </StatCard>
                <StatCard color="#3B82F6">
                    <LightbulbRoundedIcon sx={{ fontSize: 24, color: '#60A5FA', mb: 1.5 }} />
                    <StatVal>3</StatVal>
                    <StatLbl>Patents Filed/Granted</StatLbl>
                </StatCard>
                <StatCard color="#22C55E">
                    <GroupsRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal>25</StatVal>
                    <StatLbl>FDPs Attended (YTD)</StatLbl>
                </StatCard>
            </StatsRow>

            <Grid>
                {portfolio.map((fac, i) => (
                    <FacCard key={i} style={{ animationDelay: `${i * 50}ms` }}>
                        <CardHeader>
                            <FacName>{fac.name}</FacName>
                            <RoleBadge>{fac.role}</RoleBadge>
                        </CardHeader>
                        <MetricsGrid>
                            <div className="metric">
                                <span className="lbl">Publications (SCI/Scopus)</span>
                                <span className="val">{fac.publications}</span>
                            </div>
                            <div className="metric">
                                <span className="lbl">Patents</span>
                                <span className="val">{fac.patents}</span>
                            </div>
                            <div className="metric">
                                <span className="lbl">FDPs Attended</span>
                                <span className="val">{fac.fdps}</span>
                            </div>
                        </MetricsGrid>
                        <ActionBtn>View Full Profile</ActionBtn>
                    </FacCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default AdminFacultyPortfolio;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #6C63FF, #A855F7); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(108,99,255,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const StatsRow = styled.div`display: flex; gap: 20px; margin-bottom: 32px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both; @media (max-width: 600px) { flex-direction: column; }`;
const StatCard = styled.div`flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;`;
const StatVal = styled.div`font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px;`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const FacCard = styled.div`background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s; &:hover { border-color: rgba(108,99,255,0.35); transform: translateY(-4px); }`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;`;
const FacName = styled.h3`font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary);`;
const RoleBadge = styled.span`font-size: 0.7rem; font-weight: 700; background: rgba(108,99,255,0.1); color: #C084FC; padding: 4px 10px; border-radius: 50px; white-space: nowrap;`;
const MetricsGrid = styled.div`display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; .metric { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; } .lbl { font-size: 0.85rem; color: var(--clr-text-secondary); } .val { font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: var(--clr-text-primary); }`;
const ActionBtn = styled.button`width: 100%; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; background: transparent; color: #C084FC; border: 1px solid rgba(108,99,255,0.3); &:hover { background: rgba(108,99,255,0.1); }`;
