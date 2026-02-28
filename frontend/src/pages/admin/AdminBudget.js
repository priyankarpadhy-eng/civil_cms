import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LinearProgress } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AdminBudget = () => {
    // Dummy Data reflecting IGIT Civil Dept Budget
    const budgets = [
        { category: 'Lab Consumables (Cement, Sand, Aggregates)', allocated: 500000, spent: 320000, status: 'On Track' },
        { category: 'TEQIP Equipment Upgrades', allocated: 2500000, spent: 2100000, status: 'Warning' },
        { category: 'Software Renewals (AutoCAD, STAAD.Pro)', allocated: 800000, spent: 800000, status: 'Exhausted' },
        { category: 'Faculty FDP/Conference Travel', allocated: 300000, spent: 120000, status: 'On Track' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <AccountBalanceWalletRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Strategic Budgeting Module</PageTitle>
                        <PageSub>Allocation of funds for TEQIP, Lab Upgrades, and Consumables</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#22C55E">
                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal>₹41<span className="unit">.0L</span></StatVal>
                    <StatLbl>Total Allocated (FY 2026)</StatLbl>
                </StatCard>
                <StatCard color="#F59E0B">
                    <RequestQuoteRoundedIcon sx={{ fontSize: 24, color: '#FBBF24', mb: 1.5 }} />
                    <StatVal>₹33<span className="unit">.4L</span></StatVal>
                    <StatLbl>Total Spent</StatLbl>
                </StatCard>
                <StatCard color="#A855F7">
                    <ReceiptLongRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>18%</StatVal>
                    <StatLbl>Remaining Buffer</StatLbl>
                </StatCard>
            </StatsRow>

            <SectionTitle>Departmental Fund Allocation</SectionTitle>
            <Grid>
                {budgets.map((b, i) => {
                    const percent = Math.min((b.spent / b.allocated) * 100, 100);
                    return (
                        <BudgetCard key={i} style={{ animationDelay: `${i * 50}ms` }} exhausted={b.status === 'Exhausted'}>
                            <CardHeader>
                                <CategoryName>{b.category}</CategoryName>
                            </CardHeader>
                            <ProgressSection>
                                <div className="top">
                                    <span>Spent: <strong>₹{(b.spent / 100000).toFixed(2)}L</strong></span>
                                    <span>Allocated: <strong>₹{(b.allocated / 100000).toFixed(2)}L</strong></span>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={percent}
                                    sx={{
                                        height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)',
                                        '& .MuiLinearProgress-bar': { backgroundColor: b.status === 'Exhausted' ? '#EF4444' : b.status === 'Warning' ? '#F59E0B' : '#C084FC' }
                                    }}
                                />
                                <StatusRow>
                                    <span style={{ color: b.status === 'Exhausted' ? '#EF4444' : 'var(--clr-text-muted)' }}>
                                        {b.status === 'Exhausted' ? 'Funds Exhausted' : b.status === 'Warning' ? 'Approaching Limit' : 'Healthy Pipeline'}
                                    </span>
                                    <span>{percent.toFixed(0)}% Utilized</span>
                                </StatusRow>
                            </ProgressSection>
                        </BudgetCard>
                    );
                })}
            </Grid>
        </Wrapper>
    );
};

export default AdminBudget;

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
const StatVal = styled.div`font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px; .unit { font-size: 1.2rem; margin-left: 2px; opacity: 0.7; }`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;`;
const BudgetCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.exhausted ? 'rgba(239,68,68,0.3)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { transform: translateY(-4px); border-color: ${p => p.exhausted ? 'rgba(239,68,68,0.5)' : 'rgba(108,99,255,0.35)'}; }
`;
const CardHeader = styled.div`margin-bottom: 24px;`;
const CategoryName = styled.h3`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3;`;
const ProgressSection = styled.div`
  .top { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: 12px; }
`;
const StatusRow = styled.div`display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px;`;
