import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AvatarGroup, Avatar } from '@mui/material';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import DomainAddRoundedIcon from '@mui/icons-material/DomainAddRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherIndustry = () => {
    // Dummy Data reflecting Civil Engg Industry linkages
    const visits = [
        { dest: 'Rengali Dam Project', date: '12 Nov 2026', students: 58, status: 'Completed', co_mapped: 'CO4' },
        { dest: 'NALCO Smelter Plant', date: '25 Nov 2026', students: 42, status: 'Upcoming', co_mapped: 'CO2' },
    ];

    const internships = [
        { student: 'Aditya Dash', company: 'L&T Construction', duration: '8 Weeks', status: 'Ongoing', type: 'Summer Intern' },
        { student: 'Sanjay Kumar', company: 'OBCC', duration: '4 Weeks', status: 'Report Submitted', type: 'Vocational' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <FactoryRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Industrial Interface & Readiness</PageTitle>
                        <PageSub>Manage Industry Visits, Internships & Alumni Networking</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <StatsRow>
                <StatCard color="#A855F7">
                    <FactoryRoundedIcon sx={{ fontSize: 24, color: '#C084FC', mb: 1.5 }} />
                    <StatVal>3</StatVal>
                    <StatLbl>Site Visits Planned</StatLbl>
                </StatCard>
                <StatCard color="#F59E0B">
                    <BusinessCenterRoundedIcon sx={{ fontSize: 24, color: '#FBBF24', mb: 1.5 }} />
                    <StatVal>48</StatVal>
                    <StatLbl>Active Internships</StatLbl>
                </StatCard>
                <StatCard color="#22C55E">
                    <DomainAddRoundedIcon sx={{ fontSize: 24, color: '#4ADE80', mb: 1.5 }} />
                    <StatVal>150+</StatVal>
                    <StatLbl>Alumni Connections</StatLbl>
                </StatCard>
            </StatsRow>

            <ContentGrid>
                <div>
                    <SectionTitle>Site & Industrial Visits</SectionTitle>
                    <Grid1>
                        {visits.map((v, i) => (
                            <VisitCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={v.status}>
                                <CardHeader>
                                    <VisitDest>{v.dest}</VisitDest>
                                    <StatusBadge status={v.status}>{v.status}</StatusBadge>
                                </CardHeader>
                                <MetaRow><strong>Date:</strong> {v.date}</MetaRow>
                                <MetaRow><strong>Mapped to:</strong> <span className="co">{v.co_mapped}</span></MetaRow>
                            </VisitCard>
                        ))}
                    </Grid1>
                </div>

                <div>
                    <SectionTitle>Student Internships</SectionTitle>
                    <Grid1>
                        {internships.map((int, i) => (
                            <InternCard key={i} style={{ animationDelay: `${i * 50 + 100}ms` }}>
                                <InternTop>
                                    <Avatar sx={{ width: 36, height: 36, fontSize: '0.9rem', bgcolor: 'rgba(168,85,247,0.1)', color: '#C084FC', fontWeight: 700 }}>{int.student[0]}</Avatar>
                                    <div>
                                        <div className="name">{int.student}</div>
                                        <div className="comp">{int.company}</div>
                                    </div>
                                </InternTop>
                                <InternBottom>
                                    <span style={{ color: int.status === 'Ongoing' ? '#F59E0B' : '#22C55E' }}>{int.status}</span>
                                    <span>{int.duration}</span>
                                </InternBottom>
                            </InternCard>
                        ))}
                    </Grid1>
                </div>
            </ContentGrid>
        </Wrapper>
    );
};

export default TeacherIndustry;

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
`;
const StatLbl = styled.div`font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em;`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const ContentGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 32px; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const Grid1 = styled.div`display: flex; flex-direction: column; gap: 16px;`;

const VisitCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.status === 'Upcoming' ? 'rgba(168,85,247,0.3)' : 'var(--clr-border)'}; border-radius: 16px; padding: 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { transform: translateY(-3px); border-color: ${p => p.status === 'Upcoming' ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.15)'}; }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;`;
const VisitDest = styled.h3`font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary);`;
const StatusBadge = styled.span`
  font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 50px; white-space: nowrap;
  background: ${p => p.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)'};
  color: ${p => p.status === 'Completed' ? '#22C55E' : '#C084FC'};
`;
const MetaRow = styled.div`
  font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: 8px;
  .co { display: inline-block; padding: 2px 8px; background: rgba(168,85,247,0.1); color: #C084FC; font-weight: 700; font-family: var(--font-base); border-radius: 4px; border: 1px solid rgba(168,85,247,0.2); }
`;

const InternCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 16px 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { border-color: rgba(168,85,247,0.3); transform: translateX(4px); }
`;
const InternTop = styled.div`
  display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
  .name { font-size: 0.95rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 2px; }
  .comp { font-size: 0.8rem; color: var(--clr-text-muted); }
`;
const InternBottom = styled.div`
  display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--clr-text-secondary);
  border-top: 1px solid var(--clr-border); padding-top: 12px;
`;
