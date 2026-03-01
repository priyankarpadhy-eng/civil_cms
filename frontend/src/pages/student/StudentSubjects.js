import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { CircularProgress, Table, TableBody, TableHead } from '@mui/material';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import CustomBarChart from '../../components/CustomBarChart';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
`;

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading } = useSelector((state) => state.user);

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('table');

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) setSubjectMarks(userDetails.examResult || []);
  }, [userDetails]);

  const sclassID = currentUser?.sclassName?._id || currentUser?.sclass_id;

  useEffect(() => {
    if (!subjectMarks.length && sclassID) {
      dispatch(getSubjectList(sclassID, "ClassSubjects"));
    }
  }, [subjectMarks, dispatch, sclassID]);

  const hasMarks = subjectMarks && subjectMarks.length > 0;

  if (loading) {
    return (
      <Wrapper>
        <LoadingBox>
          <CircularProgress sx={{ color: 'var(--clr-primary)' }} size={40} />
          <LoadingText>Loading subjects…</LoadingText>
        </LoadingBox>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>📖 Subjects & Marks</PageTitle>
          <PageSub>
            Class: <Hl>{sclassDetails?.sclassName || currentUser.sclassName?.sclassName}</Hl>
            &nbsp;·&nbsp; Civil Engineering · IGIT Sarang
          </PageSub>
        </HeaderLeft>
      </PageHeader>

      {hasMarks ? (
        <>
          {/* Tab switcher */}
          <TabRow>
            <Tab active={selectedSection === 'table'} onClick={() => setSelectedSection('table')}>
              <TableChartRoundedIcon sx={{ fontSize: 16 }} />
              Marks Table
            </Tab>
            <Tab active={selectedSection === 'chart'} onClick={() => setSelectedSection('chart')}>
              <InsertChartRoundedIcon sx={{ fontSize: 16 }} />
              Bar Chart
            </Tab>
          </TabRow>

          {selectedSection === 'table' && (
            <TableCard>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell>Marks Obtained</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {subjectMarks.map((result, index) => {
                    if (!result.subName || !result.marksObtained) return null;
                    const marks = result.marksObtained;
                    const passed = marks >= 40;
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 600 }}>
                          {result.subName.subName}
                        </StyledTableCell>
                        <StyledTableCell>
                          <MarksDisplay marks={marks}>
                            {marks}
                          </MarksDisplay>
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusBadge pass={passed}>
                            {passed ? 'Pass' : 'Fail'}
                          </StatusBadge>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableCard>
          )}

          {selectedSection === 'chart' && (
            <ChartCard>
              <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
            </ChartCard>
          )}
        </>
      ) : (
        <>
          {/* Class details / subject list */}
          <SectionTitle>
            <MenuBookRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1 }} />
            Enrolled Subjects
          </SectionTitle>
          <SubjectGrid>
            {subjectsList && subjectsList.map((subject, index) => (
              <SubjectCard key={index} style={{ animationDelay: `${index * 60}ms` }}>
                <SubjectIndex>{String(index + 1).padStart(2, '0')}</SubjectIndex>
                <SubjectInfo>
                  <SubjectName>{subject.subName}</SubjectName>
                  <SubjectCode>
                    <CodeRoundedIcon sx={{ fontSize: 12 }} />
                    {subject.subCode}
                  </SubjectCode>
                </SubjectInfo>
              </SubjectCard>
            ))}
          </SubjectGrid>

          {(!subjectsList || subjectsList.length === 0) && (
            <EmptyState>
              <EmptyIcon>📚</EmptyIcon>
              <EmptyText>No subjects found for your class</EmptyText>
              <EmptySubText>Subjects will appear once your admin adds them</EmptySubText>
            </EmptyState>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default StudentSubjects;

/* ── Styled Components ── */

const Wrapper = styled.div`
  padding-bottom: 80px;
`;

const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 280px;
`;

const LoadingText = styled.p`
  font-size: 0.9rem;
  color: var(--clr-text-muted);
  font-weight: 500;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
`;

const PageSub = styled.p`
  font-size: 0.85rem;
  color: var(--clr-text-muted);
`;

const Hl = styled.span`
  font-weight: 700;
  color: var(--clr-primary-light);
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.5s 0.05s var(--ease-out) both;
`;

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-base);
  cursor: pointer;
  border: 1px solid ${p => p.active ? 'rgba(108,99,255,0.4)' : 'var(--clr-border)'};
  background: ${p => p.active ? 'rgba(108,99,255,0.15)' : 'transparent'};
  color: ${p => p.active ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)'};
  transition: all 0.2s var(--ease-out);
  &:hover {
    border-color: rgba(108,99,255,0.3);
    color: var(--clr-primary-light);
    background: rgba(108,99,255,0.1);
  }
`;

const TableCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 16px;
  overflow: hidden;
  animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
`;

const MarksDisplay = styled.span`
  font-weight: 800;
  font-size: 0.95rem;
  color: ${p => p.marks >= 75 ? 'var(--clr-success)' : p.marks >= 40 ? 'var(--clr-warning)' : 'var(--clr-error)'};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 50px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${p => p.pass ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${p => p.pass ? 'var(--clr-success)' : 'var(--clr-error)'};
  border: 1px solid ${p => p.pass ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};
`;

const ChartCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 16px;
  padding: 24px;
  animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  animation: ${fadeUp} 0.5s 0.08s var(--ease-out) both;
`;

const SubjectCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 14px;
  padding: 16px 20px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
  transition: all 0.2s var(--ease-out);
  cursor: default;
  &:hover {
    border-color: rgba(108,99,255,0.28);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }
`;

const SubjectIndex = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--clr-primary-light);
  opacity: 0.5;
  min-width: 32px;
`;

const SubjectInfo = styled.div``;

const SubjectName = styled.p`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--clr-text-primary);
  margin-bottom: 4px;
`;

const SubjectCode = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--clr-text-muted);
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 16px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 4px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text-primary);
`;

const EmptySubText = styled.p`
  font-size: 0.85rem;
  color: var(--clr-text-muted);
`;