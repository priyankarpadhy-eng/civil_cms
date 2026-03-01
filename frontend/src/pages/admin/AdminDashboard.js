import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';

// New Advanced Features
import AdminAccreditation from './AdminAccreditation';
import AdminStrategy from './AdminStrategy';
import AdminFacultyPortfolio from './AdminFacultyPortfolio';
import AdminBudget from './AdminBudget';
import AdminProcurement from './AdminProcurement';
import AdminVerification from './AdminVerification';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
import AdminAlumniManagement from './AdminAlumniManagement';
import AdminUserManagement from './AdminUserManagement';
import AccountMenu from '../../components/AccountMenu';

const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex', background: 'var(--clr-bg)', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar open={open} position='fixed' sx={{
                background: 'rgba(18,18,42,0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: 'none',
            }}>
                <Toolbar sx={{ pr: '24px', gap: 1 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '24px',
                            ...(open && { display: 'none' }),
                            color: 'var(--clr-text-secondary)',
                            '&:hover': { color: 'var(--clr-primary-light)', background: 'rgba(108,99,255,0.1)' },
                            borderRadius: '10px',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo / Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                        <Box sx={{
                            width: 32, height: 32,
                            background: 'var(--grad-primary)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                        }}>🏛️</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <Typography
                                component="h1"
                                variant="h6"
                                noWrap
                                sx={{
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    fontSize: '0.88rem',
                                    color: 'var(--clr-text-primary)',
                                    letterSpacing: '-0.01em',
                                    lineHeight: 1.2,
                                }}
                            >
                                Dept. of Civil Engineering
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.68rem',
                                color: 'var(--clr-text-muted)',
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                            }}>
                                IGIT Sarang
                            </Typography>
                        </Box>
                    </Box>
                    <AccountMenu />
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    '& .MuiDrawer-paper': {
                        background: 'var(--clr-surface-1)',
                        borderRight: '1px solid rgba(255,255,255,0.07)',
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: 'var(--clr-surface-3)', borderRadius: '4px' },
                    }
                }}
            >
                {/* Drawer header */}
                <Toolbar sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-end' : 'center',
                    px: 1,
                    minHeight: '64px !important',
                }}>
                    <IconButton onClick={toggleDrawer} sx={{
                        color: 'var(--clr-text-muted)',
                        borderRadius: '10px',
                        '&:hover': { background: 'rgba(108,99,255,0.1)', color: 'var(--clr-primary-light)' },
                    }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
                <List component="nav" sx={{ pt: 1 }}>
                    <SideBar open={open} />
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    background: 'var(--clr-bg)',
                }}
            >
                <Toolbar />
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />

                        {/* Advanced Features Routes */}
                        <Route path="/Admin/accreditation" element={<AdminAccreditation />} />
                        <Route path="/Admin/strategy" element={<AdminStrategy />} />
                        <Route path="/Admin/faculty-portfolio" element={<AdminFacultyPortfolio />} />
                        <Route path="/Admin/budget" element={<AdminBudget />} />
                        <Route path="/Admin/procurement" element={<AdminProcurement />} />
                        <Route path="/Admin/verification" element={<AdminVerification />} />

                        <Route path="/Admin/complains" element={<SeeComplains />} />
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />
                        <Route path="/Admin/subjects" element={<ShowSubjects />} />
                        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
                        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                        <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                        <Route path="/Admin/addclass" element={<AddClass />} />
                        <Route path="/Admin/classes" element={<ShowClasses />} />
                        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                        <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />
                        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                        <Route path="/Admin/students" element={<ShowStudents />} />
                        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />
                        <Route path="/Admin/teachers" element={<ShowTeachers />} />
                        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                        <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
                        <Route path="/Admin/users" element={<AdminUserManagement />} />
                        <Route path="/Admin/alumni" element={<AdminAlumniManagement />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;