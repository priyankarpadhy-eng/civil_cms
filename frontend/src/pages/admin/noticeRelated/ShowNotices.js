import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Paper,
    IconButton,
    Stack,
    Tooltip,
    CircularProgress,
    Button,
    Avatar,
    Chip
} from '@mui/material';
import {
    PostAddRounded,
    DeleteOutlineRounded,
    CampaignRounded,
    CalendarTodayRounded,
    ContentPasteRounded,
    NotificationsActiveRounded
} from "@mui/icons-material";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Popup from '../../../components/Popup';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
                if (address === "Notices") {
                    setMessage("All notices deleted successfully");
                } else {
                    setMessage("Notice deleted successfully");
                }
                // Note: deleteUser is currently restricted in userHandle, 
                // but we keep the logic for when it's re-enabled.
                setShowPopup(true);
            });
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} thickness={4} />
        </Box>
    );

    return (
        <Container>
            <Header>
                <Box>
                    <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--clr-text-primary)', letterSpacing: '-1px' }}>
                        Notice Center
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        Broadcast updates and critical announcements to the department.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<PostAddRounded />}
                        onClick={() => navigate("/Admin/addnotice")}
                        sx={{ borderRadius: '16px', px: 3, py: 1.5, fontWeight: 900, textTransform: 'none', fontSize: '1rem' }}
                    >
                        Create Notice
                    </Button>
                    {noticesList?.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineRounded />}
                            onClick={() => deleteHandler(currentUser._id, "Notices")}
                            sx={{ borderRadius: '16px', px: 3, fontWeight: 800, textTransform: 'none' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Stack>
            </Header>

            <AnimatePresence mode="popLayout">
                {noticesList && noticesList.length > 0 ? (
                    <Grid container spacing={4}>
                        {noticesList.map((notice, index) => (
                            <Grid item xs={12} md={6} lg={4} key={notice._id}>
                                <NoticeCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <CardTop>
                                        <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'var(--clr-primary)', width: 56, height: 56 }}>
                                            <NotificationsActiveRounded />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" fontWeight={800} noWrap sx={{ color: 'var(--clr-text-primary)' }}>
                                                {notice.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontWeight: 700 }}>
                                                <CalendarTodayRounded fontSize="inherit" />
                                                {new Date(notice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </Typography>
                                        </Box>
                                        <IconButton size="small" color="error" onClick={() => deleteHandler(notice._id, "Notice")}>
                                            <DeleteOutlineRounded />
                                        </IconButton>
                                    </CardTop>

                                    <CardContent>
                                        <Typography variant="body1" sx={{ color: 'var(--clr-text-secondary)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                            {notice.details}
                                        </Typography>
                                    </CardContent>

                                    <CardFooter>
                                        <Chip
                                            icon={<ContentPasteRounded sx={{ fontSize: '0.9rem !important' }} />}
                                            label="OFFICIAL NOTICE"
                                            size="small"
                                            sx={{ fontWeight: 900, bgcolor: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', px: 1 }}
                                        />
                                        <IconButton size="small" sx={{ ml: 'auto', border: '1px solid var(--clr-border)' }}>
                                            <CampaignRounded sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </CardFooter>
                                </NoticeCard>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <EmptyState
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Box sx={{ textAlign: 'center', p: 10 }}>
                            <NotificationsActiveRounded sx={{ fontSize: '6rem', opacity: 0.05, mb: 2 }} />
                            <Typography variant="h4" fontWeight={900} color="text.secondary">No Active Notices</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                                The notice board is currently empty. Start by sharing an announcement.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate("/Admin/addnotice")}>Post a Notice</Button>
                        </Box>
                    </EmptyState>
                )}
            </AnimatePresence>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowNotices;

const Container = styled(Box)`
    padding: 40px;
    background: var(--clr-bg);
    min-height: 100vh;
`;

const Header = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 50px;
    
    @media (max-width: 900px) {
        flex-direction: column;
        gap: 24px;
    }
`;

const NoticeCard = styled(motion.div)`
    background: white;
    border: 1px solid var(--clr-border);
    border-radius: 32px;
    padding: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    transition: box-shadow 0.3s ease;
    
    &:hover {
        box-shadow: var(--shadow-xl);
        border-color: var(--clr-primary-glow);
    }
`;

const CardTop = styled(Box)`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
`;

const CardContent = styled(Box)`
    flex: 1;
    margin-bottom: 24px;
`;

const CardFooter = styled(Box)`
    display: flex;
    align-items: center;
    padding-top: 20px;
    border-top: 1px dashed var(--clr-border);
`;

const EmptyState = styled(motion.div)`
    border: 4px dashed var(--clr-border);
    border-radius: 40px;
    background: rgba(0,0,0,0.01);
`;