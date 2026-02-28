import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
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
    CircularProgress,
    Button,
    Menu,
    MenuItem
} from '@mui/material';
import {
    SearchRounded,
    PersonAddAlt1Rounded,
    BadgeRounded,
    DeleteOutlineRounded,
    SchoolRounded,
    AssignmentIndRounded,
    MoreVertRounded,
    EventAvailableRounded,
    FactCheckRounded,
    FilterListRounded
} from '@mui/icons-material';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Popup from '../../../components/Popup';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setMessage("Student deletion is restricted for data integrity. Please contact administrator.");
        setShowPopup(true);
    };

    const handleMenuOpen = (event, student) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedStudent(null);
    };

    const filteredStudents = studentsList?.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNum?.toString().includes(searchTerm) ||
        student.sclassName?.sclassName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        show: { scale: 1, opacity: 1 }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'var(--clr-bg)' }}>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px', color: 'var(--clr-text-primary)' }}>
                        Student <Typography component="span" variant="inherit" sx={{ color: 'var(--clr-primary)' }}>Registry</Typography>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', fontWeight: 500, mt: 1 }}>
                        Maintain and monitor the academic performance and attendance of all enrolled students.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <SearchWrapper>
                        <SearchRounded sx={{ color: 'var(--clr-text-muted)' }} />
                        <InputBase
                            placeholder="Search by name, roll, or class..."
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ ml: 1, fontWeight: 600, fontSize: '0.9rem' }}
                        />
                    </SearchWrapper>
                    <AddButton onClick={() => navigate("/Admin/addstudents")}>
                        <PersonAddAlt1Rounded />
                        <Typography sx={{ ml: 1, fontWeight: 800, display: { xs: 'none', sm: 'block' } }}>Enroll Student</Typography>
                    </AddButton>
                </Stack>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <>
                    {filteredStudents.length > 0 ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="show">
                            <Grid container spacing={3}>
                                {filteredStudents.map((student) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                                        <motion.div variants={itemVariants}>
                                            <StudentCard>
                                                <CardTop>
                                                    <Avatar
                                                        src={student.profilePic}
                                                        sx={{ width: 64, height: 64, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    >
                                                        {student.name.charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)', lineHeight: 1.2 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--clr-primary)', fontWeight: 800 }}>
                                                            Roll: {student.rollNum}
                                                        </Typography>
                                                    </Box>
                                                </CardTop>

                                                <CardInfoStack spacing={1}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SchoolRounded sx={{ fontSize: '1rem', color: 'var(--clr-text-muted)' }} />
                                                        <Typography variant="body2" fontWeight={600}>{student.sclassName?.sclassName}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <BadgeRounded sx={{ fontSize: '1rem', color: 'var(--clr-text-muted)' }} />
                                                        <Typography variant="body2" fontWeight={600}>Reg: {student.registrationNum || 'PENDING'}</Typography>
                                                    </Box>
                                                </CardInfoStack>

                                                <CardFooter>
                                                    <Tooltip title="View Profile">
                                                        <ActionIcon onClick={() => navigate("/Admin/students/student/" + student._id)}>
                                                            <AssignmentIndRounded fontSize="small" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip title="Attendance">
                                                        <ActionIcon onClick={() => navigate("/Admin/students/student/attendance/" + student._id)}>
                                                            <EventAvailableRounded fontSize="small" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip title="Performance">
                                                        <ActionIcon onClick={() => navigate("/Admin/students/student/marks/" + student._id)}>
                                                            <FactCheckRounded fontSize="small" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip title="Manage">
                                                        <ActionIcon onClick={(e) => handleMenuOpen(e, student)}>
                                                            <MoreVertRounded fontSize="small" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </CardFooter>
                                            </StudentCard>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    ) : (
                        <EmptyState initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <AssignmentIndRounded sx={{ fontSize: '5rem', color: 'var(--clr-primary)', mb: 3, opacity: 0.2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Zero Students Records</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--clr-text-muted)', mb: 4 }}>
                                No matches found for your criteria. Time to enroll fresh talent?
                            </Typography>
                            <AddButton onClick={() => navigate("/Admin/addstudents")}>
                                <PersonAddAlt1Rounded sx={{ mr: 1 }} /> Enrollment Portal
                            </AddButton>
                        </EmptyState>
                    )}
                </>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { borderRadius: '12px', mt: 1, minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
                }}
            >
                <MenuItem onClick={() => { navigate("/Admin/students/student/" + selectedStudent?._id); handleMenuClose(); }}>
                    <AssignmentIndRounded sx={{ mr: 1.5, fontSize: '1.2rem' }} /> Full Profile
                </MenuItem>
                <MenuItem onClick={() => { deleteHandler(selectedStudent?._id, "Student"); handleMenuClose(); }} sx={{ color: '#f43f5e' }}>
                    <DeleteOutlineRounded sx={{ mr: 1.5, fontSize: '1.2rem' }} /> Archive Record
                </MenuItem>
            </Menu>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowStudents;

/* --- Styled Components --- */

const SearchWrapper = styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 52px;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    border-radius: 14px;
    width: 340px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    &:focus-within {
        border-color: var(--clr-primary);
        box-shadow: 0 0 0 4px var(--clr-primary-glow);
        width: 400px;
    }

    @media (max-width: 600px) {
        width: 100%;
        &:focus-within { width: 100%; }
    }
`;

const AddButton = styled(Box)`
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 52px;
    background: var(--grad-primary);
    color: white;
    border-radius: 14px;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }
`;

const StudentCard = styled(Paper)`
    padding: 20px;
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 20px !important;
    box-shadow: var(--shadow-sm) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg) !important;
        border-color: var(--clr-primary) !important;
    }
`;

const CardTop = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const CardInfoStack = styled(Stack)`
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    background: var(--clr-surface-2);
    border-radius: 12px;
`;

const CardFooter = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
    border-top: 1px solid var(--clr-border);
    padding-top: 16px;
`;

const ActionIcon = styled(IconButton)`
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    transition: all 0.2s !important;
    
    &:hover {
        background: var(--clr-primary) !important;
        color: white !important;
        border-color: var(--clr-primary) !important;
        transform: scale(1.1);
    }
`;

const EmptyState = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120px 20px;
    text-align: center;
    background: var(--clr-surface-1);
    border: 2px dashed var(--clr-border);
    border-radius: 40px;
`;