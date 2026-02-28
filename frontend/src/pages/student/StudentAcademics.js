import React from 'react';
import styled, { keyframes } from 'styled-components';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import { CircularProgress } from '@mui/material';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentAcademics = () => {
    // Current Academic Status Data
    const attendance = 78;
    const cgpa = 8.42;

    const subjects = [
        { name: 'Structural Analysis II', type: 'Theory', marked: 24, total: 30, internal: true },
        { name: 'Geotechnical Engineering', type: 'Theory', marked: 18, total: 30, internal: true },
        { name: 'Transportation Lab', type: 'Practical', marked: 45, total: 50, internal: true },
    ];

    const results = [
        { sem: 'Semester V', sgpa: 8.6, date: 'Result Published: 12 Jan 2026', link: '#' },
        { sem: 'Semester IV', sgpa: 8.2, date: 'Result Published: 05 Jun 2025', link: '#' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <FactCheckRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Academic Transparency Portal</PageTitle>
                        <PageSub>Real-time tracking of attendance, internals, and BPUT results</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <TopGrid>
                <StatCard color="#3B82F6">
                    <div className="info">
                        <h3>Current Attendance</h3>
                        <p>BPUT Eligibility: 75% Min</p>
                    </div>
                    <div className="progress">
                        <CircularProgress variant="determinate" value={attendance} size={64} thickness={5} sx={{ color: attendance >= 75 ? '#3B82F6' : '#EF4444' }} />
                        <span className="val" style={{ color: attendance >= 75 ? '#3B82F6' : '#EF4444' }}>{attendance}%</span>
                    </div>
                </StatCard>
                <StatCard color="#A855F7">
                    <div className="info">
                        <h3>Cumulative Grade</h3>
                        <p>Upto Semester V</p>
                    </div>
                    <div className="progress">
                        <span className="cgpa">{cgpa}</span>
                        <span className="scale">/ 10.0</span>
                    </div>
                </StatCard>
            </TopGrid>

            <ContentGrid>
                <Section>
                    <div className="sec-header">
                        <h2>Continuous Internal Evaluation (CIE)</h2>
                        <span className="badge">Semester VI On-going</span>
                    </div>
                    <List>
                        {subjects.map((sub, i) => (
                            <ListItem key={i} style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="sub-info">
                                    <h4>{sub.name}</h4>
                                    <span className="type">{sub.type}</span>
                                </div>
                                <div className="marks-box">
                                    <span className="score">{sub.marked}</span>
                                    <span className="base">/ {sub.total}</span>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Section>

                <Section>
                    <div className="sec-header">
                        <h2>BPUT Semester Results</h2>
                        <button className="apply-btn">Apply Re-evaluation (7 days)</button>
                    </div>
                    <List>
                        {results.map((res, i) => (
                            <ListItem key={i} style={{ animationDelay: `${i * 50 + 100}ms` }}>
                                <div className="sub-info">
                                    <h4>{res.sem}</h4>
                                    <span className="date">{res.date}</span>
                                </div>
                                <div className="rs-right">
                                    <div className="sgpa-box">SGPA <strong>{res.sgpa}</strong></div>
                                    <button className="dl-btn">Transcript</button>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Section>
            </ContentGrid>
        </Wrapper>
    );
};

export default StudentAcademics;

const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #3B82F6, #06B6D4); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(59,130,246,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const TopGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; @media (max-width: 768px) { grid-template-columns: 1fr; }`;
const StatCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.color}30; border-radius: 16px; padding: 24px; animation: ${fadeUp} 0.5s var(--ease-out) both; display: flex; justify-content: space-between; align-items: center;
  .info h3 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 6px; }
  .info p { font-size: 0.85rem; color: var(--clr-text-secondary); font-weight: 500; }
  .progress { position: relative; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; }
  .val { position: absolute; font-size: 0.95rem; font-weight: 800; }
  .cgpa { font-family: var(--font-display); font-size: 2.4rem; font-weight: 800; color: #C084FC; line-height: 1; } .scale { font-weight: 700; color: var(--clr-text-muted); margin-left: 4px; }
`;

const ContentGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 24px; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const Section = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 24px; animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
  .sec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .sec-header h2 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary); }
  .badge { font-size: 0.75rem; font-weight: 700; background: rgba(59,130,246,0.1); color: #60A5FA; padding: 4px 10px; border-radius: 50px; }
  .apply-btn { font-size: 0.75rem; font-weight: 600; background: rgba(239,68,68,0.1); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: 0.2s; &:hover { background: rgba(239,68,68,0.2); } }
`;
const List = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const ListItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; animation: ${fadeUp} 0.4s var(--ease-out) both;
  .sub-info h4 { font-size: 0.95rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 6px; }
  .type { font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .date { font-size: 0.8rem; color: var(--clr-text-secondary); }
  .marks-box { background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
  .score { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: #60A5FA; } .base { font-size: 0.8rem; font-weight: 600; color: var(--clr-text-muted); margin-left: 2px; }
  .rs-right { display: flex; align-items: center; gap: 16px; }
  .sgpa-box { font-size: 0.85rem; color: var(--clr-text-secondary); strong { font-family: var(--font-display); font-size: 1.1rem; color: #C084FC; margin-left: 4px; } }
  .dl-btn { font-size: 0.75rem; font-weight: 600; color: #60A5FA; border: 1px solid rgba(59,130,246,0.3); background: transparent; padding: 6px 12px; border-radius: 6px; cursor: pointer; &:hover { background: rgba(59,130,246,0.1); } }
`;
