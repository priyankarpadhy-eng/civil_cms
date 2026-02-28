import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Tab,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Stack,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TabContext,
  TabList,
  TabPanel
} from '@mui/lab';
import {
  MenuBookRounded,
  PeopleAltRounded,
  AccountCircleRounded,
  HistoryEduRounded,
  AssessmentRounded,
  ArrowBackRounded,
  NavigateNextRounded,
  SchoolRounded,
  CodeRounded,
  EventNoteRounded,
  PersonAddRounded,
  LaunchRounded,
  HowToRegRounded
} from '@mui/icons-material';
import styled from "styled-components";
import { motion } from "framer-motion";
import TableTemplate from '../../../components/TableTemplate';

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params;
  const [tabValue, setTabValue] = useState('1');

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Student Name', minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentActions = ({ row }) => (
    <Stack direction="row" spacing={1}>
      <Tooltip title="View Record">
        <ActionBtn size="small" onClick={() => navigate("/Admin/students/student/" + row.id)}>
          <AccountCircleRounded fontSize="small" />
        </ActionBtn>
      </Tooltip>
      <Tooltip title="Performance">
        <ActionBtn size="small" onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          <AssessmentRounded fontSize="small" />
        </ActionBtn>
      </Tooltip>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: 'var(--clr-bg)', minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <HeaderBg>
        <Container maxWidth="xl">
          <Stack spacing={3} sx={{ color: 'white' }}>
            <Breadcrumbs
              separator={<NavigateNextRounded fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
              sx={{ '& .MuiBreadcrumbs-li a': { color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600, '&:hover': { color: 'white' } } }}
            >
              <Link onClick={() => navigate("/Admin/subjects")} sx={{ cursor: 'pointer' }}>Subjects</Link>
              <Typography sx={{ fontWeight: 800, color: 'white' }}>{subjectDetails?.subName || 'Course Detail'}</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <MenuBookRounded sx={{ fontSize: '2.5rem' }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={900}>
                    {subjectDetails?.subName}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Chip
                      icon={<CodeRounded sx={{ color: 'white !important' }} />}
                      label={subjectDetails?.subCode || 'N/A'}
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800 }}
                    />
                    <Chip
                      icon={<SchoolRounded sx={{ color: 'white !important' }} />}
                      label={subjectDetails?.sclassName?.sclassName || 'Batch'}
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800 }}
                    />
                  </Stack>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<ArrowBackRounded />}
                onClick={() => navigate(-1)}
                sx={{ bgcolor: 'white', color: 'var(--clr-primary)', fontWeight: 900, borderRadius: '12px', px: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
              >
                Back to List
              </Button>
            </Box>
          </Stack>
        </Container>
      </HeaderBg>

      <Container maxWidth="xl" sx={{ mt: -4 }}>
        <TabContext value={tabValue}>
          <Paper elevation={0} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-lg)' }}>
            <Box sx={{ px: 3, pt: 2, borderBottom: '1px solid var(--clr-border)', bgcolor: 'white' }}>
              <TabList onChange={handleTabChange} sx={{ '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0' } }}>
                <StyledTab icon={<AssessmentRounded />} iconPosition="start" label="Academic Overview" value="1" />
                <StyledTab icon={<PeopleAltRounded />} iconPosition="start" label={`Students Ensemble (${sclassStudents.length})`} value="2" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ p: 4, bgcolor: 'var(--clr-surface-1)' }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Stack spacing={4}>
                    <MetricGrid>
                      <MetricCard bg="rgba(99, 102, 241, 0.05)" color="#6366f1">
                        <EventNoteRounded />
                        <Box>
                          <Typography variant="h4" fontWeight={900}>{subjectDetails?.sessions}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={700}>Total Sessions</Typography>
                        </Box>
                      </MetricCard>
                      <MetricCard bg="rgba(16, 185, 129, 0.05)" color="#10b981">
                        <PeopleAltRounded />
                        <Box>
                          <Typography variant="h4" fontWeight={900}>{sclassStudents.length}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={700}>Enrolled Students</Typography>
                        </Box>
                      </MetricCard>
                    </MetricGrid>

                    <SectionTitle>
                      <HistoryEduRounded color="primary" />
                      Faculty Assignment
                    </SectionTitle>

                    <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--clr-border)', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {subjectDetails?.teacher ? (
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar sx={{ width: 64, height: 64, bgcolor: 'var(--clr-primary)' }}>{subjectDetails.teacher.name[0]}</Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={800}>{subjectDetails.teacher.name}</Typography>
                            <Typography variant="body2" color="text.secondary">Primary Course Instructor</Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Box sx={{ textAlign: 'center', width: '100%', py: 2 }}>
                          <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>No teacher assigned to this course</Typography>
                          <Button
                            variant="outlined"
                            startIcon={<PersonAddRounded />}
                            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
                            sx={{ borderRadius: '12px', fontWeight: 800 }}
                          >
                            Assign Instructor
                          </Button>
                        </Box>
                      )}
                      {subjectDetails?.teacher && (
                        <IconButton color="primary" onClick={() => navigate("/Admin/teachers/teacher/" + subjectDetails.teacher._id)}>
                          <LaunchRounded />
                        </IconButton>
                      )}
                    </Paper>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <SectionTitle><HowToRegRounded color="primary" /> Course Metadata</SectionTitle>
                  <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid var(--clr-border)', bgcolor: 'white' }}>
                    <Stack spacing={2}>
                      <DetailBox>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>DEPARTMENT</Typography>
                        <Typography variant="body1" fontWeight={700}>Civil Engineering</Typography>
                      </DetailBox>
                      <DetailBox>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>ACADEMIC YEAR</Typography>
                        <Typography variant="body1" fontWeight={700}>2025-26</Typography>
                      </DetailBox>
                      <DetailBox>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>CREDIT SYSTEM</Typography>
                        <Typography variant="body1" fontWeight={700}>4.0 Credits</Typography>
                      </DetailBox>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="2" sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight={800}>Class Roster</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                  sx={{ borderRadius: '10px', fontWeight: 800 }}
                >
                  Add Student
                </Button>
              </Box>
              <Box sx={{ p: 2 }}>
                <TableTemplate
                  buttonHaver={StudentActions}
                  columns={studentColumns}
                  rows={studentRows}
                />
              </Box>
            </TabPanel>
          </Paper>
        </TabContext>
      </Container>
    </Box>
  );
};

export default ViewSubject;

const HeaderBg = styled(Box)`
    background: var(--grad-primary);
    padding: 80px 0 120px 0;
`;

const StyledTab = styled(Tab)`
    min-height: 60px !important;
    font-weight: 800 !important;
    text-transform: none !important;
    font-size: 0.95rem !important;
    gap: 8px;
    &.Mui-selected { color: var(--clr-primary) !important; }
`;

const MetricGrid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
`;

const MetricCard = styled(Box)`
    padding: 24px;
    background: ${props => props.bg};
    color: ${props => props.color};
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    svg { font-size: 2.5rem; }
`;

const SectionTitle = styled(Typography)`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 900;
    font-size: 1.1rem;
    color: var(--clr-text-primary);
    margin-bottom: 24px;
`;

const DetailBox = styled(Box)`
    padding-bottom: 12px;
    border-bottom: 1px solid var(--clr-border);
    &:last-child { border-bottom: none; }
`;

const ActionBtn = styled(IconButton)`
    background: var(--clr-surface-2) !important;
    transition: all 0.2s;
    &:hover { background: var(--clr-primary) !important; color: white !important; }
`;