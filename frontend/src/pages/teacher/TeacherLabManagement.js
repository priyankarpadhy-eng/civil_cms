import React from 'react';
import styled, { keyframes } from 'styled-components';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherLabManagement = () => {
    const labAssets = [
        { name: 'Compression Testing Machine (2000 kN)', nextCalibration: '12 Nov 2026', status: 'Active', category: 'Strength Testing' },
        { name: 'Universal Testing Machine', nextCalibration: '05 Jan 2027', status: 'Active', category: 'Strength Testing' },
        { name: 'Proctor Compaction Apparatus', nextCalibration: '—', status: 'Maintenance', category: 'Soil Mechanics' },
        { name: 'Total Station', nextCalibration: '10 Oct 2026', status: 'Active', category: 'Surveying' },
        { name: 'Spectrophotometer', nextCalibration: '15 Aug 2026', status: 'Calibration Due', category: 'Environmental' },
    ];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <PrecisionManufacturingRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Smart Logbook & Lab Assets</PageTitle>
                        <PageSub>Track Civil Engg. Laboratory Equipment Lifecycle</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            <Grid>
                {labAssets.map((asset, i) => (
                    <AssetCard key={i} style={{ animationDelay: `${i * 50}ms` }} status={asset.status}>
                        <CardHeader>
                            <CategoryTag>{asset.category}</CategoryTag>
                            <StatusBadge status={asset.status}>{asset.status}</StatusBadge>
                        </CardHeader>
                        <AssetName>{asset.name}</AssetName>
                        <MetaRow>
                            <strong>Next Calibration:</strong> {asset.nextCalibration}
                        </MetaRow>
                        <ActionRow>
                            <LogBtn>
                                <BuildCircleRoundedIcon sx={{ fontSize: 16 }} />
                                Update Logbook
                            </LogBtn>
                        </ActionRow>
                    </AssetCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default TeacherLabManagement;

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

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;`;
const AssetCard = styled.div`
  background: var(--clr-surface-2); border: 1px solid ${p => p.status === 'Calibration Due' ? 'rgba(245,158,11,0.3)' : p.status === 'Maintenance' ? 'rgba(239,68,68,0.3)' : 'var(--clr-border)'};
  border-radius: 16px; padding: 20px; animation: ${fadeUp} 0.4s var(--ease-out) both; transition: all 0.25s;
  &:hover { border-color: rgba(168,85,247,0.35); transform: translateY(-4px); }
`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;`;
const CategoryTag = styled.span`font-size: 0.72rem; font-weight: 700; color: #C084FC; text-transform: uppercase; letter-spacing: 0.05em;`;
const StatusBadge = styled.span`
  font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 50px;
  background: ${p => p.status === 'Active' ? 'rgba(34,197,94,0.1)' : p.status === 'Maintenance' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'};
  color: ${p => p.status === 'Active' ? '#22C55E' : p.status === 'Maintenance' ? '#EF4444' : '#F59E0B'};
`;
const AssetName = styled.h3`font-size: 1.1rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 12px; line-height: 1.3;`;
const MetaRow = styled.div`font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: 20px;`;
const ActionRow = styled.div`display: flex;`;
const LogBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  background: rgba(168,85,247,0.1); color: #C084FC; border: 1px solid rgba(168,85,247,0.2);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  &:hover { background: rgba(168,85,247,0.15); }
`;
