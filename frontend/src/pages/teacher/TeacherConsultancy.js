import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Avatar, LinearProgress } from '@mui/material';
import ArchitectureRoundedIcon from '@mui/icons-material/ArchitectureRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherConsultancy = () => {
    // Dummy Data
    const projects = [
        { title: 'Soil Testing for NH-55 Bypass', client: 'NHAI', value: '₹4,50,000', completed: 80, status: 'Active', ra_bill: 'Generated' },
        { title: 'Structural Audit of OBCC Building', client: 'OBCC', value: '₹12,00,000', completed: 100, status: 'Completed', ra_bill: 'Cleared' },
        { title: 'Concrete Mix Design Approval', client: 'L&T Construction', value: '₹1,20,000', completed: 30, status: 'Active', ra_bill: 'Pending' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <ArchitectureRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Industrial Consultancy & Billing</PageTitle>
                        <PageSub>Manage Civil Engg Projects, RA Invoicing & Measurement Books</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#22C55E">
                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 28, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal>₹17.7<span className="unit">L</span></StatVal>
                    <StatLbl>Total Consultancy Revenue</StatLbl>
                </StatCard>
                <StatCard color="#A855F7">
                    <ReceiptRoundedIcon sx={{ fontSize: 28, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>3</StatVal>
                    <StatLbl>Active Technical Projects</StatLbl>
                </StatCard>
            </StatsRow>

            <Grid>
                {projects.map((proj, i) => (
                    <ProjCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={proj.status}>
                        <CardHeader>
                            <ProjTitle>{proj.title}</ProjTitle>
                            <StatusBadge status={proj.status}>{proj.status}</StatusBadge>
                        </CardHeader>

                        <MetaGrid>
                            <MetaItem>
                                <strong>Client:</strong> {proj.client}
                            </MetaItem>
                            <MetaItem>
                                <strong>Value:</strong> <span style={{ color: '#22C55E', fontWeight: 800 }}>{proj.value}</span>
                            </MetaItem>
                        </MetaGrid>

                        <ProgressSection>
                            <div className="top"><span>Project Progress</span><span>{proj.completed}%</span></div>
                            <LinearProgress variant="determinate" value={proj.completed} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: proj.status === 'Completed' ? '#22C55E' : '#A855F7' } }} />
                        </ProgressSection>

                        <ActionRow>
                            <MetaItem><strong>RA Bill:</strong> <span style={{ color: proj.ra_bill === 'Cleared' ? '#22C55E' : '#F59E0B' }}>{proj.ra_bill}</span></MetaItem>
                            <ActionBtn>View MB <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} /></ActionBtn>
                        </ActionRow>
                    </ProjCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherConsultancy;

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
  flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px;
`;
const StatVal = styled.div`
  font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px;
  .unit { font-size: 1.2rem; margin-left: 2px; opacity: 0.7; }
`;
const StatLbl = styled.div`font-size: 0.8rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;`;
const ProjCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s; display: flex; flex-direction: column;
  &:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-4px); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;`;
const ProjTitle = styled.h3`font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3; flex: 1; padding-right: 12px;`;
const StatusBadge = styled.span`
  font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)'};
  color: ${p => p.status === 'Completed' ? '#22C55E' : '#C084FC'};
`;
const MetaGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;
const ProgressSection = styled.div`
  margin-bottom: 24px;
  .top { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 8px; }
`;
const ActionRow = styled.div`display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--clr-border); padding-top: 16px;`;
const ActionBtn = styled.button`
  display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
  background: rgba(168,85,247,0.1); color: #C084FC; border: 1px solid rgba(168,85,247,0.2);
  &:hover { background: rgba(168,85,247,0.15); }
`;
