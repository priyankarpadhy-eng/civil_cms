import React from 'react';
import styled, { keyframes } from 'styled-components';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentAlumni = () => {
    // Dummy Data reflecting Alumni Network
    const events = [
        { title: 'Tech Talk: High-Speed Rail in India', by: 'Ashish Mahapatra (Batch \'15)', role: 'Sr. Engineer, NHSRCL', date: '12 Apr 2026', type: 'Expert Talk' },
        { title: 'Civil Dept. Silver Jubilee Reunion', by: 'Alumni Association IGIT', role: 'Various', date: '20 Oct 2026', type: 'Reunion' },
    ];

    const jobs = [
        { role: 'Site Engineer Trainee', company: 'Shapoorji Pallonji', location: 'Bhubaneswar', postedBy: 'S. Rath (Batch \'18)' },
        { role: 'Junior structural designer', company: 'DesignTech Solutions', location: 'Remote', postedBy: 'M. Dash (Batch \'20)' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <HandshakeRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Alumni Engagement Network</PageTitle>
                        <PageSub>Connect with predecessors, seek mentorship, and find referral jobs</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <TopGrid>
                <div className="left-panes">
                    <StatCard color="#10B981">
                        <div className="icon"><GroupsRoundedIcon sx={{ fontSize: 28, color: '#10B981' }} /></div>
                        <div className="info">
                            <h3>Find a Mentor</h3>
                            <p>Connect with 400+ Alumni across globe</p>
                            <button className="action-btn">Browse Directory</button>
                        </div>
                    </StatCard>
                </div>

                <div className="right-pane">
                    <SectionTitle style={{ marginBottom: 12 }}>Alumni Referral Job Board</SectionTitle>
                    <List>
                        {jobs.map((job, i) => (
                            <ListItem key={i} style={{ animationDelay: `${i * 50 + 100}ms` }}>
                                <div className="info-main">
                                    <h4>{job.role}</h4>
                                    <p>{job.company} · {job.location}</p>
                                </div>
                                <div className="info-meta">
                                    <span className="ref">Referred by: {job.postedBy}</span>
                                    <button className="apply">Apply</button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </TopGrid>

            <SectionTitle>Upcoming Network Events</SectionTitle>
            <Grid>
                {events.map((ev, i) => (
                    <EventCard key={i} style={{ animationDelay: `${i * 50 + 200}ms` }}>
                        <div className="date-box">
                            <EventAvailableRoundedIcon sx={{ fontSize: 24, mb: 0.5, color: '#C084FC' }} />
                            <span>{ev.date}</span>
                        </div>
                        <div className="ev-details">
                            <span className="badge">{ev.type}</span>
                            <h3>{ev.title}</h3>
                            <p><strong>Speaker/Host:</strong> {ev.by}</p>
                            <p><strong>Profile:</strong> {ev.role}</p>
                        </div>
                        <button className="rsvp">RSVP</button>
                    </EventCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default StudentAlumni;

const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #10B981, #059669); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(16,185,129,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const TopGrid = styled.div`display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; margin-bottom: 32px; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const StatCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 24px; animation: ${fadeUp} 0.5s var(--ease-out) both; height: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;
  .icon { width: 64px; height: 64px; border-radius: 16px; background: rgba(16,185,129,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .info h3 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 8px; }
  .info p { font-size: 0.9rem; color: var(--clr-text-secondary); line-height: 1.4; margin-bottom: 24px; }
  .action-btn { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; &:hover { background: rgba(16,185,129,0.25); } }
`;

const SectionTitle = styled.h2`font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;`;

const List = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const ListItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; background: var(--clr-surface-2); border: 1px solid var(--clr-border); padding: 16px 20px; border-radius: 12px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: 0.2s; &:hover { border-color: rgba(59,130,246,0.3); }
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 12px; }
  .info-main h4 { font-size: 1.05rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 4px; }
  .info-main p { font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;}
  .info-meta { display: flex; align-items: center; gap: 16px; }
  .ref { font-size: 0.8rem; padding: 4px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; color: var(--clr-text-secondary); }
  .apply { font-size: 0.8rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #3B82F6, #06B6D4); padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer; }
`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;`;
const EventCard = styled.div`
  display: flex; align-items: center; gap: 20px; background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 16px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: 0.2s; &:hover { transform: translateY(-3px); border-color: rgba(168,85,247,0.3); }
  .date-box { background: rgba(168,85,247,0.1); border-radius: 12px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-width: 80px; }
  .date-box span { font-size: 0.75rem; font-weight: 700; color: #C084FC; line-height: 1.2; }
  .ev-details { flex: 1; }
  .badge { display: inline-block; font-size: 0.65rem; font-weight: 700; background: rgba(255,255,255,0.05); color: var(--clr-text-muted); padding: 3px 8px; border-radius: 4px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .ev-details h3 { font-size: 1rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 8px; line-height: 1.3; }
  .ev-details p { font-size: 0.8rem; color: var(--clr-text-secondary); margin-bottom: 4px; }
  .rsvp { padding: 8px; border-radius: 8px; border: 1px solid rgba(168,85,247,0.3); background: transparent; color: #C084FC; font-weight: 600; font-size: 0.8rem; cursor: pointer; align-self: flex-start; &:hover { background: rgba(168,85,247,0.1); } }
`;
