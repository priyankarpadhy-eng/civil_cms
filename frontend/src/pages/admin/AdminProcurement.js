import React from 'react';
import styled, { keyframes } from 'styled-components';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AdminProcurement = () => {
    // Dummy Data reflecting IGIT Civil Dept Procurement workflows
    const requests = [
        { item: 'Digital Triaxial Testing System', lab: 'Geotechnical Engg Lab', cost: '₹14,50,000', status: 'PO Generated', requestedBy: 'Dr. R. K. Mohanty', priority: 'High' },
        { item: 'A3 Laser Printer Consumables', lab: 'CAD Lab', cost: '₹45,000', status: 'Pending HOD Approval', requestedBy: 'Sanjay Mishra', priority: 'Normal' },
        { item: 'Replacement Proving Rings (50kN)', lab: 'Strength of Materials Lab', cost: '₹12,000', status: 'Delivered', requestedBy: 'Dr. Smita Panda', priority: 'Low' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <ShoppingCartRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Procurement & Stores</PageTitle>
                        <PageSub>Automated requisition to Vendor PO generation</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#3B82F6">
                    <HourglassEmptyRoundedIcon sx={{ fontSize: 24, color: '#60A5FA', mb: 1.5 }} />
                    <StatVal>4</StatVal>
                    <StatLbl>Pending Approvals</StatLbl>
                </StatCard>
                <StatCard color="#F59E0B">
                    <AssignmentTurnedInRoundedIcon sx={{ fontSize: 24, color: '#FBBF24', mb: 1.5 }} />
                    <StatVal>3</StatVal>
                    <StatLbl>Active Tenders</StatLbl>
                </StatCard>
                <StatCard color="#A855F7">
                    <CheckCircleRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>12</StatVal>
                    <StatLbl>POs Fulfilled (YTD)</StatLbl>
                </StatCard>
            </StatsRow>

            <SectionTitle>Recent Hardware & Consumable Requisitions</SectionTitle>
            <Grid>
                {requests.map((req, i) => (
                    <ReqCard key={i} style={{ animationDelay: `${i * 50}ms` }} priority={req.priority}>
                        <CardHeader>
                            <ReqTitle>{req.item}</ReqTitle>
                            <StatusBadge status={req.status}>
                                {req.status === 'PO Generated' && <AssignmentTurnedInRoundedIcon sx={{ fontSize: 14 }} />}
                                {req.status === 'Pending HOD Approval' && <HourglassEmptyRoundedIcon sx={{ fontSize: 14 }} />}
                                {req.status === 'Delivered' && <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
                                {req.status}
                            </StatusBadge>
                        </CardHeader>

                        <MetaGrid>
                            <MetaItem>
                                <strong>Lab/Scope:</strong> {req.lab}
                            </MetaItem>
                            <MetaItem>
                                <strong>Indented By:</strong> {req.requestedBy}
                            </MetaItem>
                            <MetaItem>
                                <strong>Est. Cost:</strong> <span style={{ color: '#C084FC', fontWeight: 800 }}>{req.cost}</span>
                            </MetaItem>
                            <MetaItem>
                                <strong>Priority:</strong> <span style={{ color: req.priority === 'High' ? '#EF4444' : req.priority === 'Normal' ? '#F59E0B' : '#22C55E' }}>{req.priority}</span>
                            </MetaItem>
                        </MetaGrid>

                        <ActionRow>
                            {req.status === 'Pending HOD Approval' ? (
                                <>
                                    <ActionBtn approve>Approve</ActionBtn>
                                    <ActionBtn reject>Reject</ActionBtn>
                                </>
                            ) : (
                                <ActionBtn outline>View Workflow</ActionBtn>
                            )}
                        </ActionRow>
                    </ReqCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default AdminProcurement;

/* Styled Components */
const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #6C63FF, #A855F7); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(108,99,255,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const StatsRow = styled.div`display: flex; gap: 20px; margin-bottom: 32px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both; @media (max-width: 600px) { flex-direction: column; }`;
const StatCard = styled.div`
  flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;
`;
const StatVal = styled.div`font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 8px;`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;`;
const ReqCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.priority === 'High' ? 'rgba(239,68,68,0.2)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s; display: flex; flex-direction: column;
  &:hover { transform: translateY(-4px); border-color: rgba(108,99,255,0.35); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px;`;
const ReqTitle = styled.h3`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); line-height: 1.3; flex: 1;`;
const StatusBadge = styled.span`
  display: flex; align-items: center; gap: 4px; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : p.status === 'PO Generated' ? 'rgba(192,132,252,0.1)' : 'rgba(245,158,11,0.1)'};
  color: ${p => p.status === 'Delivered' ? '#22C55E' : p.status === 'PO Generated' ? '#C084FC' : '#F59E0B'};
`;
const MetaGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;`;
const MetaItem = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary);`;

const ActionRow = styled.div`display: flex; gap: 12px; margin-top: auto; border-top: 1px solid var(--clr-border); padding-top: 16px;`;
const ActionBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  background: ${p => p.approve ? 'rgba(34,197,94,0.1)' : p.reject ? 'rgba(239,68,68,0.1)' : 'transparent'};
  color: ${p => p.approve ? '#22C55E' : p.reject ? '#EF4444' : '#C084FC'};
  border: 1px solid ${p => p.approve ? 'rgba(34,197,94,0.25)' : p.reject ? 'rgba(239,68,68,0.25)' : 'rgba(108,99,255,0.3)'};
  &:hover { background: ${p => p.approve ? 'rgba(34,197,94,0.15)' : p.reject ? 'rgba(239,68,68,0.15)' : 'rgba(108,99,255,0.1)'}; }
`;
