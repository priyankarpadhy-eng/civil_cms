import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassStudents } from '../../redux/sclassRelated/sclassHandle';
import {
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Chip
} from '@mui/material';

// Icons
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(15px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const classID = params.id || currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;
  const sclassName = sclassStudents[0]?.sclassName?.sclassName || currentUser.teachSclass?.sclassName;

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) console.log(error);

  const filteredStudents = sclassStudents?.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNum?.toString().includes(searchTerm) ||
    student.registrationNum?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Wrapper>
      {/* Header Area */}
      <Header>
        <HeaderLeft>
          <IconWrap>
            <GroupsRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
          </IconWrap>
          <Titles>
            <PageTitle>Batch {sclassName} Students</PageTitle>
            <PageSub>Management portal for CIVIL Engineering students</PageSub>
          </Titles>
        </HeaderLeft>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchField
            size="small"
            placeholder="Search by Name, Roll or Reg..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'var(--clr-text-muted)' }} />
                </InputAdornment>
              ),
            }}
          />
          <CountBadge>
            <span className="num">{filteredStudents?.length || 0}</span>
            <span className="lbl">Students</span>
          </CountBadge>
        </Box>
      </Header>

      {loading ? (
        <LoadingBox>
          <CircularProgress size={40} sx={{ color: 'var(--clr-primary)' }} />
          <p>Fetching Student Records…</p>
        </LoadingBox>
      ) : getresponse || !sclassStudents?.length ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>No Students Found</EmptyTitle>
          <EmptySub>The database for Batch {sclassName} is currently empty.</EmptySub>
        </EmptyState>
      ) : (
        <TablePaper elevation={0}>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: 'var(--clr-surface-2)' }}>
                <TableRow>
                  <StyledHeaderCell>Student Info</StyledHeaderCell>
                  <StyledHeaderCell>Roll Number</StyledHeaderCell>
                  <StyledHeaderCell>Reg. Number</StyledHeaderCell>
                  <StyledHeaderCell>Semester</StyledHeaderCell>
                  <StyledHeaderCell>Section</StyledHeaderCell>
                  <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, i) => (
                  <StyledTableRow key={student._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'var(--clr-surface-3)',
                            color: 'var(--clr-primary)',
                            fontWeight: 800,
                            fontSize: '0.85rem'
                          }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={800} color="var(--clr-text-primary)">
                            {student.name}
                          </Typography>
                          {student.isBranchRep && (
                            <Chip label="Branch Rep" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'var(--clr-primary)', color: '#fff', fontWeight: 800 }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="var(--clr-primary)">
                        {student.rollNum}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="var(--clr-text-secondary)">
                        {student.registrationNum || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        Sem {student.currentSemester || "1"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Section ${student.section || 'A'}`}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 700, borderColor: 'var(--clr-primary)', color: 'var(--clr-primary)' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="View Profile">
                          <ActionIconButton onClick={() => navigate(`/Teacher/class/student/${student._id}`)} color="primary">
                            <VisibilityRoundedIcon size="small" />
                          </ActionIconButton>
                        </Tooltip>
                        <Tooltip title="Mark Attendance">
                          <ActionIconButton
                            onClick={() => navigate(`/Teacher/class/student/attendance/${student._id}/${subjectID}`)}
                            sx={{ color: '#22c55e', bgcolor: 'rgba(34,197,94,0.1)' }}
                          >
                            <CheckBoxRoundedIcon size="small" />
                          </ActionIconButton>
                        </Tooltip>
                        <Tooltip title="Internal Marks">
                          <ActionIconButton
                            onClick={() => navigate(`/Teacher/class/student/marks/${student._id}/${subjectID}`)}
                            sx={{ color: '#3b82f6', bgcolor: 'rgba(59,130,246,0.1)' }}
                          >
                            <EditNoteRoundedIcon size="small" />
                          </ActionIconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TablePaper>
      )}
    </Wrapper>
  );
};

export default TeacherClassDetails;

/* ── Styled Components ── */

const Wrapper = styled.div`
  padding-bottom: 48px;
  animation: ${fadeUp} 0.5s ease-out;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px; flex-wrap: wrap; gap: 24px;
`;

const HeaderLeft = styled.div`
  display: flex; align-items: center; gap: 20px;
`;

const IconWrap = styled.div`
  width: 60px; height: 60px; border-radius: 20px;
  background: var(--grad-primary);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-primary);
`;

const Titles = styled.div``;

const PageTitle = styled.h1`
  font-family: var(--font-display); font-size: 1.8rem; font-weight: 900;
  color: var(--clr-text-primary); margin-bottom: 4px; letter-spacing: -0.02em;
`;

const PageSub = styled.p`
  font-size: 0.9rem; color: var(--clr-text-muted); font-weight: 500;
`;

const SearchField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: var(--clr-surface-1);
    border-radius: 12px;
    width: 320px;
    transition: all 0.2s;
    &:hover { border-color: var(--clr-primary); }
    &.Mui-focused { width: 380px; }
  }
`;

const CountBadge = styled.div`
  display: flex; gap: 8px; align-items: center;
  background: var(--clr-surface-2); border: 1px solid var(--clr-border);
  padding: 8px 16px; border-radius: 12px;
  .num { font-family: var(--font-display); font-size: 1.2rem; font-weight: 900; color: var(--clr-primary); }
  .lbl { font-size: 0.75rem; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; }
`;

const TablePaper = styled(Paper)`
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 24px !important;
    overflow: hidden;
    box-shadow: var(--shadow-sm) !important;
`;

const StyledHeaderCell = styled(TableCell)`
    font-weight: 800 !important;
    color: var(--clr-text-secondary) !important;
    text-transform: uppercase;
    font-size: 0.75rem !important;
    letter-spacing: 0.05em !important;
    padding: 20px !important;
    border-bottom: 1px solid var(--clr-border) !important;
`;

const StyledTableRow = styled(TableRow)`
    transition: all 0.2s;
    &:hover {
        background: var(--clr-surface-2) !important;
    }
    & .MuiTableCell-root {
        padding: 16px 20px !important;
        border-bottom: 1px solid var(--clr-border) !important;
    }
`;

const ActionIconButton = styled(IconButton)`
    width: 36px; height: 36px;
    border-radius: 10px !important;
    background: var(--clr-surface-3) !important;
    transition: all 0.2s !important;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
`;

const LoadingBox = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 16px; min-height: 300px;
  p { font-size: 1rem; color: var(--clr-text-muted); font-weight: 600; }
`;

const EmptyState = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; min-height: 400px; text-align: center;
  background: var(--clr-surface-1); border: 1px dashed var(--clr-border); border-radius: 32px;
`;

const EmptyIcon = styled.div`font-size: 4rem;`;
const EmptyTitle = styled.h2`font-family: var(--font-display); font-size: 1.4rem; font-weight: 800;`;
const EmptySub = styled.p`color: var(--clr-text-muted); max-width: 300px;`;