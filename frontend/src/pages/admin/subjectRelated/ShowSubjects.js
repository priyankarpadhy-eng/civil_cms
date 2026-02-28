import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box,
    Typography,
    Grid,
    Paper,
    InputBase,
    IconButton,
    Stack,
    Chip,
    Avatar,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    SearchRounded,
    PostAddRounded,
    MenuBookRounded,
    DeleteOutlineRounded,
    AssignmentRounded,
    SchoolRounded,
    AccessTimeRounded,
    MoreVertRounded
} from '@mui/icons-material';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setMessage("Deletion restricted from this view. Please contact super admin for data integrity.");
        setShowPopup(true);
    };

    const filteredSubjects = subjectsList?.filter(subject =>
        subject.subName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.sclassName?.sclassName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'var(--clr-bg)' }}>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px', color: 'var(--clr-text-primary)', mb: 1 }}>
                        Subject <Typography component="span" variant="inherit" sx={{ color: 'var(--clr-primary)' }}>Repository</Typography>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', fontWeight: 500 }}>
                        Manage academic curriculum and course distribution across batches.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <SearchWrapper>
                        <SearchRounded sx={{ color: 'var(--clr-text-muted)', fontSize: '1.2rem' }} />
                        <InputBase
                            placeholder="Search subjects or classes..."
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ ml: 1, fontWeight: 600, fontSize: '0.9rem' }}
                        />
                    </SearchWrapper>
                    <AddButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                        <PostAddRounded />
                        <Typography sx={{ ml: 1, fontWeight: 800, display: { xs: 'none', sm: 'block' } }}>Add Subject</Typography>
                    </AddButton>
                </Stack>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <>
                    {filteredSubjects.length > 0 ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <Grid container spacing={4}>
                                {filteredSubjects.map((subject) => (
                                    <Grid item xs={12} sm={6} lg={4} key={subject._id}>
                                        <motion.div variants={itemVariants}>
                                            <SubjectCard>
                                                <CardHeader>
                                                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)', width: 56, height: 56 }}>
                                                        <MenuBookRounded sx={{ fontSize: '1.8rem' }} />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
                                                            {subject.subName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--clr-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                            Code: {subject.subCode || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton size="small"><MoreVertRounded /></IconButton>
                                                </CardHeader>

                                                <CardBody>
                                                    <InfoRow>
                                                        <SchoolRounded sx={{ fontSize: '1.1rem' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{subject.sclassName?.sclassName}</Typography>
                                                    </InfoRow>
                                                    <InfoRow>
                                                        <AccessTimeRounded sx={{ fontSize: '1.1rem' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{subject.sessions} Scheduled Sessions</Typography>
                                                    </InfoRow>
                                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                        <Tooltip title="Subject Assignments">
                                                            <Chip size="small" icon={<AssignmentRounded />} label="Curriculum Active" sx={{ fontWeight: 700, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none' }} />
                                                        </Tooltip>
                                                    </Stack>
                                                </CardBody>

                                                <CardActions>
                                                    <ViewButton onClick={() => navigate(`/Admin/subjects/subject/${subject.sclassName?._id}/${subject._id}`)}>
                                                        Course Details
                                                    </ViewButton>
                                                    <DeleteIconBtn onClick={() => deleteHandler(subject._id, "Subject")}>
                                                        <DeleteOutlineRounded />
                                                    </DeleteIconBtn>
                                                </CardActions>
                                            </SubjectCard>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    ) : (
                        <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <AssignmentRounded sx={{ fontSize: '5rem', color: 'var(--clr-primary)', mb: 3, opacity: 0.2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No Subjects Found</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--clr-text-muted)', mb: 4 }}>
                                Try adjusting your search or add a new core curriculum subject.
                            </Typography>
                            <AddButton onClick={() => navigate("/Admin/subjects/chooseclass")}>
                                <PostAddRounded sx={{ mr: 1 }} /> Create New Subject
                            </AddButton>
                        </EmptyState>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowSubjects;

/* --- Styled Components --- */

const SearchWrapper = styled(Box)`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    border-radius: 16px;
    width: 320px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    
    &:focus-within {
        border-color: var(--clr-primary);
        box-shadow: 0 0 0 4px var(--clr-primary-glow);
        width: 380px;
    }

    @media (max-width: 600px) {
        width: 100%;
        &:focus-within { width: 100%; }
    }
`;

const AddButton = styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 52px;
    background: var(--grad-primary);
    color: white;
    border-radius: 16px;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(99, 102, 241, 0.4);
    }

    @media (max-width: 600px) {
        justify-content: center;
    }
`;

const SubjectCard = styled(Paper)`
    padding: 24px;
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 24px !important;
    box-shadow: var(--shadow-md) !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: var(--shadow-xl) !important;
        border-color: var(--clr-primary) !important;
    }
`;

const CardHeader = styled(Box)`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
`;

const CardBody = styled(Box)`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InfoRow = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--clr-text-secondary);
`;

const CardActions = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
`;

const ViewButton = styled(Box)`
    flex: 1;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--clr-surface-2);
    border: 1px solid var(--clr-border);
    border-radius: 12px;
    font-weight: 800;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: var(--clr-primary);
        color: white;
        border-color: var(--clr-primary);
    }
`;

const DeleteIconBtn = styled(Box)`
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(244, 63, 94, 0.05);
    color: #f43f5e;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f43f5e;
        color: white;
    }
`;

const EmptyState = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    background: var(--clr-surface-1);
    border: 2px dashed var(--clr-border);
    border-radius: 32px;
    text-align: center;
`;