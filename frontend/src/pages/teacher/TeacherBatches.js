import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Stack } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherBatches = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    // In a more advanced version, this would be an array of batches. 
    // For now, we use the single teachSclass assigned to the teacher.
    const assignedBatches = currentUser?.teachSclass ? [currentUser.teachSclass] : [];

    return (
        <Wrapper>
            <Header>
                <HeaderLeft>
                    <IconWrap>
                        <GroupsRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </IconWrap>
                    <Titles>
                        <PageTitle>Active Batches</PageTitle>
                        <PageSub>Manage students and progress for your assigned cohorts</PageSub>
                    </Titles>
                </HeaderLeft>
            </Header>

            {assignedBatches.length > 0 ? (
                <BatchGrid>
                    {assignedBatches.map((batch, index) => (
                        <BatchCard key={batch._id} onClick={() => navigate(`/Teacher/batch/${batch._id}`)}>
                            <CardTop>
                                <BatchIcon>
                                    <SchoolRoundedIcon sx={{ fontSize: 32, color: 'var(--clr-primary)' }} />
                                </BatchIcon>
                                <BatchInfo>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)' }}>
                                        {batch.sclassName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>
                                        Batch Code: {batch.batchNumber || 'N/A'} · Passout: {batch.passoutYear || 'N/A'}
                                    </Typography>
                                </BatchInfo>
                            </CardTop>
                            <Divider sx={{ my: 2, borderColor: 'var(--clr-border)' }} />
                            <CardBottom>
                                <Box>
                                    <Typography variant="caption" color="textSecondary" fontWeight={600}>Subject Assigned</Typography>
                                    <Typography variant="body2" fontWeight={700}>{currentUser?.teachSubject?.subName || 'General Instruction'}</Typography>
                                </Box>
                                <ViewIcon>
                                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />
                                </ViewIcon>
                            </CardBottom>
                        </BatchCard>
                    ))}
                </BatchGrid>
            ) : (
                <EmptyState>
                    <Typography variant="h6">No assigned batches found.</Typography>
                    <Typography variant="body2" color="textSecondary">Please contact the administrator to assign batches to your profile.</Typography>
                </EmptyState>
            )}
        </Wrapper>
    );
};

export default TeacherBatches;

const Wrapper = styled.div`
    animation: ${fadeUp} 0.5s ease-out;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 40px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const IconWrap = styled.div`
    width: 60px; height: 60px;
    border-radius: 18px;
    background: var(--grad-primary);
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-primary);
`;

const Titles = styled.div``;

const PageTitle = styled.h1`
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--clr-text-primary);
    margin-bottom: 4px;
`;

const PageSub = styled.p`
    font-size: 0.9rem;
    color: var(--clr-text-muted);
    font-weight: 500;
`;

const BatchGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
`;

const BatchCard = styled(Paper)`
    padding: 24px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 24px !important;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    &:hover {
        transform: translateY(-8px);
        border-color: var(--clr-primary) !important;
        box-shadow: var(--shadow-lg) !important;
    }
`;

const CardTop = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const BatchIcon = styled.div`
    width: 56px; height: 56px;
    border-radius: 14px;
    background: var(--clr-surface-2);
    display: flex; align-items: center; justify-content: center;
`;

const BatchInfo = styled.div``;

const CardBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const ViewIcon = styled.div`
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--clr-text-muted);
    background: var(--clr-surface-2);
    transition: all 0.2s;
    ${BatchCard}:hover & {
        background: var(--clr-primary);
        color: white;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px;
    background: var(--clr-surface-1);
    border-radius: 24px;
    border: 1px dashed var(--clr-border);
`;
