import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';
import styled from 'styled-components';

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch, currentRole, currentUser]);

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 250 },
        { id: 'date', label: 'Date', minWidth: 150 },
    ];

    const noticeRows = noticesList?.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toLocaleDateString('en-GB') : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    }) || [];

    return (
        <Box sx={{ mt: 2 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={30} sx={{ color: 'var(--clr-primary)' }} />
                </Box>
            ) : response ? (
                <EmptyBox>
                    <span style={{ fontSize: '2rem' }}>📭</span>
                    <Typography sx={{ fontWeight: 700, color: 'var(--clr-text-muted)' }}>
                        No new notices at this time
                    </Typography>
                </EmptyBox>
            ) : (
                <StyledPaper>
                    {Array.isArray(noticesList) && noticesList.length > 0 ? (
                        <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
                    ) : (
                        <EmptyBox>
                            <Typography sx={{ fontWeight: 700, color: 'var(--clr-text-muted)' }}>
                                No notices found
                            </Typography>
                        </EmptyBox>
                    )}
                </StyledPaper>
            )}
        </Box>
    )
}

export default SeeNotice;

const StyledPaper = styled(Paper)`
  background: var(--clr-surface-1) !important;
  border: 1px solid var(--clr-border) !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: none !important;
`;

const EmptyBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  background: var(--clr-surface-2);
  border: 1px dashed var(--clr-border);
  border-radius: 20px;
`;