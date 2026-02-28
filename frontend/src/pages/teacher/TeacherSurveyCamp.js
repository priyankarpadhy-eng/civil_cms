import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Avatar, AvatarGroup } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherSurveyCamp = () => {
    // Dummy Data reflecting civil eng Survey Camp logistics
    const camps = [
        {
            group: 'Group A - Delta',
            terrain: 'Hillock Section A',
            equipment: ['Total Station', 'Prism', 'Tripod'],
            status: 'Data Processing',
            members: ['Aditya', 'Priya', 'Sanjay', 'Sneha']
        },
        {
            group: 'Group B - Sigma',
            terrain: 'Lake Boundary',
            equipment: ['Dumpy Level', 'Ranging Rods', 'Metallic Tape'],
            status: 'Fieldwork Active',
            members: ['Rahul', 'Amit', 'Neha', 'Rohan']
        },
        {
            group: 'Group C - Omega',
            terrain: 'Campus Perimeter',
            equipment: ['Electronic Theodolite', 'Chain'],
            status: 'Pending Checkout',
            members: ['Vivek', 'Riya', 'Karan', 'Pooja']
        },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <MapRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Survey Camp Logistics</PageTitle>
                        <PageSub>Manage 5-Day Intensive Topographical Mapping</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#3B82F6">
                    <GroupsRoundedIcon sx={{ fontSize: 24, color: '#60A5FA', mb: 1 }} />
                    <StatVal>12</StatVal>
                    <StatLbl>Active Groups</StatLbl>
                </StatCard>
                <StatCard color="#F59E0B">
                    <HandymanRoundedIcon sx={{ fontSize: 24, color: '#FBBF24', mb: 1 }} />
                    <StatVal>38</StatVal>
                    <StatLbl>Equipment Checked Out</StatLbl>
                </StatCard>
                <StatCard color="#22C55E">
                    <MapRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1 }} />
                    <StatVal>2</StatVal>
                    <StatLbl>Traverse Reports Uploaded</StatLbl>
                </StatCard>
            </StatsRow>

            <SectionTitle>Field Assignments</SectionTitle>
            <Grid>
                {camps.map((camp, i) => (
                    <CampCard key={i} style={{ animationDelay: `${i * 50}ms` }}>
                        <CardHeader>
                            <GroupName>{camp.group}</GroupName>
                            <StatusBadge status={camp.status}>{camp.status}</StatusBadge>
                        </CardHeader>

                        <InfoRow><strong>Terrain:</strong> {camp.terrain}</InfoRow>

                        <EquipmentList>
                            <div className="title">Checked Out Equipment:</div>
                            <div className="tags">
                                {camp.equipment.map(eq => <span key={eq} className="tag">{eq}</span>)}
                            </div>
                        </EquipmentList>

                        <MembersRow>
                            <span className="lbl">Team:</span>
                            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.9rem', borderColor: 'var(--clr-surface-2)' } }}>
                                {camp.members.map(m => <Avatar key={m}>{m[0]}</Avatar>)}
                            </AvatarGroup>
                        </MembersRow>

                        <ActionRow status={camp.status}>
                            <ActionBtn>
                                {camp.status === 'Fieldwork Active' ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : <PublishRoundedIcon sx={{ fontSize: 16 }} />}
                                {camp.status === 'Fieldwork Active' ? 'Mark Completed' : camp.status === 'Pending Checkout' ? 'Authorize Equipment' : 'Review Field Book'}
                            </ActionBtn>
                        </ActionRow>
                    </CampCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherSurveyCamp;

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
  flex: 1; background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 20px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
`;
const StatVal = styled.div`font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--clr-text-primary); line-height: 1; margin-bottom: 6px;`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const CampCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-4px); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;`;
const GroupName = styled.h3`font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary);`;
const StatusBadge = styled.span`
  font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.status === 'Fieldwork Active' ? 'rgba(34,197,94,0.1)' : p.status === 'Data Processing' ? 'rgba(168,85,247,0.1)' : 'rgba(245,158,11,0.1)'};
  color: ${p => p.status === 'Fieldwork Active' ? '#22C55E' : p.status === 'Data Processing' ? '#C084FC' : '#F59E0B'};
`;
const InfoRow = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: 14px;`;
const EquipmentList = styled.div`
  margin-bottom: 16px;
  .title { font-size: 0.75rem; font-weight: 700; color: var(--clr-text-muted); margin-bottom: 8px; text-transform: uppercase; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { font-size: 0.75rem; font-weight: 600; padding: 4px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--clr-text-secondary); }
`;
const MembersRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--clr-border); padding-top: 14px; margin-bottom: 20px;
  .lbl { font-size: 0.85rem; font-weight: 600; color: var(--clr-text-secondary); }
`;
const ActionRow = styled.div`display: flex;`;
const ActionBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  background: rgba(168,85,247,0.1); color: #C084FC; border: 1px solid rgba(168,85,247,0.2);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  &:hover { background: rgba(168,85,247,0.15); }
`;
