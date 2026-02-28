import React from 'react';
import styled, { keyframes } from 'styled-components';
import ArchitectureRoundedIcon from '@mui/icons-material/ArchitectureRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const AdminStrategy = () => {
    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <ArchitectureRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Departmental Strategy Hub</PageTitle>
                        <PageSub>Define and revise Vision, Mission, and PEOs</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <ContentGrid>
                <Section>
                    <h2>Vision Statement</h2>
                    <textarea defaultValue="To be a center of excellence in Civil Engineering education, producing technically competent and socially responsible professionals capable of addressing modern infrastructure challenges." />
                    <ActionBtn>Update Vision</ActionBtn>
                </Section>
                <Section>
                    <h2>Mission Statement</h2>
                    <textarea defaultValue="M1: To provide robust academic curricula aligned with industry standards.\nM2: To foster a culture of research, innovation, and consultancy.\nM3: To instill ethical values and leadership qualities in students." />
                    <ActionBtn>Update Mission</ActionBtn>
                </Section>
                <Section className="span-all">
                    <h2>Program Educational Objectives (PEOs)</h2>
                    <div className="peo-list">
                        <div className="peo">
                            <span className="num">PEO 1</span>
                            <textarea defaultValue="Graduates will have successful careers in core Civil Engineering and related fields, demonstrating professional competence." />
                        </div>
                        <div className="peo">
                            <span className="num">PEO 2</span>
                            <textarea defaultValue="Graduates will engage in lifelong learning, pursuing higher education or advanced certifications." />
                        </div>
                        <div className="peo">
                            <span className="num">PEO 3</span>
                            <textarea defaultValue="Graduates will exhibit leadership, effective communication, and ethical standards in interdisciplinary teams." />
                        </div>
                    </div>
                    <ActionBtn style={{ marginTop: 16 }}>Save PEOs</ActionBtn>
                </Section>
            </ContentGrid>
        </Wrapper>
    );
};

export default AdminStrategy;

const Wrapper = styled.div`padding-bottom: 48px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: ${fadeUp} 0.4s var(--ease-out) both;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const IconWrap = styled.div`width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #6C63FF, #A855F7); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(108,99,255,0.35);`;
const Titles = styled.div``;
const PageTitle = styled.h1`font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text-primary); margin-bottom: 4px;`;
const PageSub = styled.p`font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;`;

const ContentGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 24px; @media (max-width: 900px) { grid-template-columns: 1fr; }
.span-all { grid-column: 1 / -1; }`;
const Section = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 16px; padding: 24px; animation: ${fadeUp} 0.5s var(--ease-out) both;
  h2 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 16px; }
  textarea { width: 100%; min-height: 120px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: 12px; color: var(--clr-text-secondary); font-family: var(--font-base); font-size: 0.95rem; line-height: 1.6; resize: vertical; outline: none; transition: border 0.2s; &:focus { border-color: #6C63FF; } }
  .peo-list { display: flex; flex-direction: column; gap: 12px; }
  .peo { display: flex; gap: 12px; align-items: flex-start; }
  .peo .num { background: rgba(108,99,255,0.1); color: #C084FC; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; white-space: nowrap; margin-top: 4px; border: 1px solid rgba(108,99,255,0.2); }
  .peo textarea { min-height: 80px; }
`;
const ActionBtn = styled.button`margin-top: 16px; padding: 10px 20px; background: rgba(108,99,255,0.15); color: #C084FC; font-weight: 600; font-size: 0.9rem; border: 1px solid rgba(108,99,255,0.3); border-radius: 8px; cursor: pointer; transition: all 0.2s; &:hover { background: rgba(108,99,255,0.25); border-color: #C084FC; }`;
