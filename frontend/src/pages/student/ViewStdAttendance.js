import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CircularProgress, Collapse, Table, TableBody, TableHead } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
`;

const ViewStdAttendance = () => {
  const dispatch = useDispatch();
  const [openStates, setOpenStates] = useState({});
  const [selectedSection, setSelectedSection] = useState('table');
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const { userDetails, currentUser, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) setSubjectAttendance(userDetails.attendance || []);
  }, [userDetails]);

  const handleOpen = (subId) => {
    setOpenStates(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallOk = overallAttendancePercentage >= 75;

  const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => ({
    subject: subName,
    attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
    totalClasses: sessions,
    attendedClasses: present,
  }));

  const hasAttendance = subjectAttendance && subjectAttendance.length > 0;

  if (loading) {
    return (
      <Wrapper>
        <LoadingBox>
          <CircularProgress sx={{ color: 'var(--clr-primary)' }} size={40} />
          <LoadingText>Loading attendance data…</LoadingText>
        </LoadingBox>
      </Wrapper>
    );
  }

  if (!hasAttendance) {
    return (
      <Wrapper>
        <PageHeader>
          <PageTitle>📅 Attendance</PageTitle>
          <PageSub>Civil Engineering · IGIT Sarang</PageSub>
        </PageHeader>
        <EmptyCard>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No Attendance Records</EmptyTitle>
          <EmptyDesc>Your attendance will appear here once your teachers start marking it.</EmptyDesc>
        </EmptyCard>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Page Header */}
      <PageHeader>
        <HeaderLeft>
          <PageTitle>📅 Attendance</PageTitle>
          <PageSub>Civil Engineering · IGIT Sarang · {currentUser?.sclassName?.sclassName}</PageSub>
        </HeaderLeft>
        {/* Overall badge */}
        <OverallBadge ok={overallOk}>
          <OverallIcon ok={overallOk}>
            <CheckBoxRoundedIcon sx={{ fontSize: 20 }} />
          </OverallIcon>
          <OverallInfo>
            <OverallLabel>Overall Attendance</OverallLabel>
            <OverallValue ok={overallOk}>{overallAttendancePercentage.toFixed(1)}%</OverallValue>
          </OverallInfo>
          {overallOk
            ? <TrendingUpRoundedIcon sx={{ fontSize: 18, color: 'var(--clr-success)', ml: 1 }} />
            : <TrendingDownRoundedIcon sx={{ fontSize: 18, color: 'var(--clr-error)', ml: 1 }} />
          }
        </OverallBadge>
      </PageHeader>

      {/* Progress bar for each subject (summary) */}
      <ProgressGrid>
        {subjectData.map((s, i) => {
          const pct = s.attendancePercentage;
          const ok = pct >= 75;
          return (
            <ProgressCard key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <ProgressTop>
                <ProgressSubject>{s.subject}</ProgressSubject>
                <ProgressPct ok={ok}>{pct}%</ProgressPct>
              </ProgressTop>
              <ProgressBar>
                <ProgressFill pct={pct} ok={ok} />
              </ProgressBar>
              <ProgressMeta>
                {s.attendedClasses} / {s.totalClasses} classes
              </ProgressMeta>
            </ProgressCard>
          );
        })}
      </ProgressGrid>

      {/* Tab switcher */}
      <TabRow>
        <Tab active={selectedSection === 'table'} onClick={() => setSelectedSection('table')}>
          <TableChartRoundedIcon sx={{ fontSize: 16 }} /> Detailed Table
        </Tab>
        <Tab active={selectedSection === 'chart'} onClick={() => setSelectedSection('chart')}>
          <InsertChartRoundedIcon sx={{ fontSize: 16 }} /> Chart View
        </Tab>
      </TabRow>

      {/* Table Section */}
      {selectedSection === 'table' && (
        <TableCard>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Total</StyledTableCell>
                <StyledTableCell>Percentage</StyledTableCell>
                <StyledTableCell align="center">Details</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
              const pct = calculateSubjectAttendancePercentage(present, sessions);
              const ok = pct >= 75;
              return (
                <TableBody key={index}>
                  <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: 600 }}>{subName}</StyledTableCell>
                    <StyledTableCell>{present}</StyledTableCell>
                    <StyledTableCell>{sessions}</StyledTableCell>
                    <StyledTableCell>
                      <PctChip ok={ok}>{pct}%</PctChip>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ExpandBtn onClick={() => handleOpen(subId)}>
                        {openStates[subId]
                          ? <><KeyboardArrowUp sx={{ fontSize: 16 }} /> Hide</>
                          : <><KeyboardArrowDown sx={{ fontSize: 16 }} /> View</>
                        }
                      </ExpandBtn>
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell colSpan={5} sx={{ p: 0, border: 'none' }}>
                      <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                        <DetailBox>
                          <DetailTitle>Session-wise Attendance</DetailTitle>
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {allData.map((data, i) => {
                                const date = new Date(data.date);
                                const dateStr = date.toString() !== "Invalid Date"
                                  ? date.toISOString().substring(0, 10) : "—";
                                const isPresent = data.status === 'Present';
                                return (
                                  <StyledTableRow key={i}>
                                    <StyledTableCell>{dateStr}</StyledTableCell>
                                    <StyledTableCell align="right">
                                      <StatusDot present={isPresent}>
                                        {isPresent ? '✓ Present' : '✕ Absent'}
                                      </StatusDot>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </DetailBox>
                      </Collapse>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableCard>
      )}

      {/* Chart Section */}
      {selectedSection === 'chart' && (
        <ChartCard>
          <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
        </ChartCard>
      )}
    </Wrapper>
  );
};

export default ViewStdAttendance;

/* ── Styled Components ── */

const Wrapper = styled.div`
  padding-bottom: 60px;
`;

const LoadingBox = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; min-height: 280px;
`;

const LoadingText = styled.p`
  font-size: 0.9rem; color: var(--clr-text-muted); font-weight: 500;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const PageSub = styled.p`
  font-size: 0.83rem; color: var(--clr-text-muted);
`;

const OverallBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${p => p.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  border: 1px solid ${p => p.ok ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'};
  border-radius: 14px;
  padding: 14px 18px;
`;

const OverallIcon = styled.div`
  width: 36px; height: 36px;
  border-radius: 10px;
  background: ${p => p.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};
  display: flex; align-items: center; justify-content: center;
  color: ${p => p.ok ? 'var(--clr-success)' : 'var(--clr-error)'};
`;

const OverallInfo = styled.div``;

const OverallLabel = styled.p`
  font-size: 0.72rem; font-weight: 600;
  color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.06em;
`;

const OverallValue = styled.p`
  font-family: var(--font-display);
  font-size: 1.4rem; font-weight: 800;
  color: ${p => p.ok ? 'var(--clr-success)' : 'var(--clr-error)'};
  line-height: 1;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.5s 0.05s var(--ease-out) both;
`;

const ProgressCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 14px;
  padding: 16px;
  animation: ${fadeUp} 0.4s var(--ease-out) both;
  transition: all 0.2s var(--ease-out);
  &:hover { border-color: rgba(108,99,255,0.25); transform: translateY(-2px); }
`;

const ProgressTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ProgressSubject = styled.p`
  font-size: 0.83rem; font-weight: 700; color: var(--clr-text-primary);
  flex: 1; line-height: 1.3;
`;

const ProgressPct = styled.span`
  font-family: var(--font-display);
  font-size: 0.95rem; font-weight: 800;
  color: ${p => p.ok ? 'var(--clr-success)' : 'var(--clr-error)'};
  margin-left: 8px;
`;

const ProgressBar = styled.div`
  height: 6px; border-radius: 4px;
  background: rgba(255,255,255,0.08);
  margin-bottom: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => Math.min(p.pct, 100)}%;
  border-radius: 4px;
  background: ${p => p.ok ? 'linear-gradient(90deg,#22C55E,#10B981)' : 'linear-gradient(90deg,#EF4444,#DC2626)'};
  transition: width 1s var(--ease-out);
`;

const ProgressMeta = styled.p`
  font-size: 0.72rem; color: var(--clr-text-muted); font-weight: 500;
`;

const TabRow = styled.div`
  display: flex; gap: 8px;
  margin-bottom: 16px;
  animation: ${fadeUp} 0.4s 0.1s var(--ease-out) both;
`;

const Tab = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; font-family: var(--font-base);
  cursor: pointer;
  border: 1px solid ${p => p.active ? 'rgba(108,99,255,0.4)' : 'var(--clr-border)'};
  background: ${p => p.active ? 'rgba(108,99,255,0.15)' : 'transparent'};
  color: ${p => p.active ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)'};
  transition: all 0.2s;
  &:hover { border-color: rgba(108,99,255,0.3); color: var(--clr-primary-light); background: rgba(108,99,255,0.1); }
`;

const TableCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 16px;
  overflow: hidden;
  animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;
`;

const PctChip = styled.span`
  display: inline-block; padding: 3px 10px; border-radius: 50px;
  font-size: 0.78rem; font-weight: 700;
  background: ${p => p.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  color: ${p => p.ok ? 'var(--clr-success)' : 'var(--clr-error)'};
  border: 1px solid ${p => p.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};
`;

const ExpandBtn = styled.button`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 12px; border-radius: 8px;
  font-size: 0.78rem; font-weight: 600; font-family: var(--font-base);
  cursor: pointer;
  background: rgba(108,99,255,0.1);
  border: 1px solid rgba(108,99,255,0.2);
  color: var(--clr-primary-light);
  transition: all 0.2s;
  &:hover { background: rgba(108,99,255,0.18); }
`;

const DetailBox = styled.div`
  padding: 16px 20px;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid var(--clr-border);
`;

const DetailTitle = styled.p`
  font-size: 0.8rem; font-weight: 700;
  color: var(--clr-text-secondary);
  margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;
`;

const StatusDot = styled.span`
  display: inline-block; padding: 2px 8px; border-radius: 50px;
  font-size: 0.72rem; font-weight: 700;
  color: ${p => p.present ? 'var(--clr-success)' : 'var(--clr-error)'};
  background: ${p => p.present ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
  border: 1px solid ${p => p.present ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};
`;

const ChartCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 16px; padding: 24px;
  animation: ${fadeUp} 0.5s 0.15s var(--ease-out) both;
`;

const EmptyCard = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  padding: 80px 20px;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 20px; text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem; margin-bottom: 4px;
`;

const EmptyTitle = styled.p`
  font-family: var(--font-display);
  font-size: 1.1rem; font-weight: 800;
  color: var(--clr-text-primary);
`;

const EmptyDesc = styled.p`
  font-size: 0.85rem; color: var(--clr-text-muted); max-width: 320px; line-height: 1.6;
`;