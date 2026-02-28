import React from 'react';
import styled, { keyframes } from 'styled-components';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentFeesHostel = () => {
    // Dummy Data reflecting Fee and Hostel Details
    const fees = [
        { type: 'BPUT Examination Fee (Sem VI)', amount: '₹1,500', dueDate: '15 Mar 2026', status: 'Pending' },
        { type: 'Hostel Mess Advanced', amount: '₹18,000', dueDate: '30 Jan 2026', status: 'Paid' },
        { type: 'Institute Tuition Fee (Even Sem)', amount: '₹22,500', dueDate: '10 Feb 2026', status: 'Paid' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <PaymentsRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Fees & Hostel Management</PageTitle>
                        <PageSub>Online payments, e-receipts, and residential details</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <TopGrid>
                <StatCard color="#F59E0B">
                    <div className="icon"><PaymentsRoundedIcon sx={{ fontSize: 24, color: '#FBBF24' }} /></div>
                    <div className="info">
                        <h3>Outstanding Dues</h3>
                        <p className="val">₹1,500</p>
                        <PayBtn>Pay Now via UPI/Card</PayBtn>
                    </div>
                </StatCard>
                <StatCard color="#22C55E">
                    <div className="icon"><HomeWorkRoundedIcon sx={{ fontSize: 24, color: '#4ADE80' }} /></div>
                    <div className="info">
                        <h3>Hostel Details</h3>
                        <p className="val" style={{ fontSize: '1.2rem', color: 'var(--clr-text-primary)' }}>Akash Bhawan (Room 214)</p>
                        <span className="badge">Mess Preference: Non-Veg</span>
                    </div>
                </StatCard>
            </TopGrid>

            <SectionTitle>Recent Fee Transactions</SectionTitle>
            <Grid>
                {fees.map((fee, i) => (
                    <FeeCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={fee.status}>
                        <div className="left">
                            <div className="icon-box" style={{ background: fee.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: fee.status === 'Paid' ? '#22C55E' : '#EF4444' }}>
                                <ReceiptLongRoundedIcon sx={{ fontSize: 20 }} />
                            </div>
                            <div className="details">
                                <h4>{fee.type}</h4>
                                <span>Due: {fee.dueDate}</span>
                            </div>
                        </div>
                        <div className="right">
                            <div className="amount">{fee.amount}</div>
                            <StatusBadge status={fee.status}>{fee.status}</StatusBadge>
                        </div>
                    </FeeCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default StudentFeesHostel;

const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #F59E0B, #EF4444); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(245,158,11,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const TopGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; @media (max-width: 768px) { grid-template-columns: 1fr; }`;
const StatCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; animation: ${fadeUp} 0.5s var(--ease-out) both;
  display: flex; gap: 20px; align-items: flex-start;
  .icon { width: 48px; height: 48px; border-radius: 12px; background: ${p => p.color}15; display: flex; align-items: center; justify-content: center; }
  .info h3 { font-size: 0.85rem; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
  .val { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #F59E0B; line-height: 1; margin-bottom: 16px; min-height: 32px; }
  .badge { display: inline-block; font-size: 0.75rem; font-weight: 700; background: rgba(34,197,94,0.1); color: #4ADE80; padding: 4px 12px; border-radius: 6px; }
`;
const PayBtn = styled.button`padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; background: linear-gradient(135deg, #F59E0B, #EF4444); color: #fff; border: none; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.3); &:hover { transform: translateY(-2px); }`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const FeeCard = styled.div`
  display: flex; justify-content: space-between; align-items: center; background: var(--clr-surface-2); border: 1px solid ${p => p.status === 'Paid' ? 'var(--clr-border)' : 'rgba(239,68,68,0.3)'}; padding: 16px 20px; border-radius: 12px; animation: ${fadeUp} 0.4s var(--ease-out) both;
  .left { display: flex; align-items: center; gap: 16px; }
  .icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .details h4 { font-size: 0.95rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 4px; }
  .details span { font-size: 0.8rem; color: var(--clr-text-muted); font-weight: 500; }
  .right { text-align: right; }
  .amount { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 6px; }
`;
const StatusBadge = styled.div`
  font-size: 0.7rem; font-weight: 700; display: inline-block; padding: 4px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em;
  background: ${p => p.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${p => p.status === 'Paid' ? '#22C55E' : '#EF4444'};
`;
