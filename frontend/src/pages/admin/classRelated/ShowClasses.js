import { useEffect, useState } from 'react';
import { IconButton, Box, Typography, Grid, Paper, Tooltip, InputBase, Avatar, Chip, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import {
  DeleteOutlineRounded,
  VisibilityRounded,
  AddRounded,
  SearchRounded,
  SchoolRounded,
  PeopleAltRounded,
  ClassRounded,
  CalendarTodayRounded,
  PostAddRounded,
  PersonAddRounded,
  MoreVertRounded,
  WarningAmberRounded
} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton, RedButton } from '../../../components/buttonStyles';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddCardIcon from '@mui/icons-material/AddCard';
import { supabase } from '../../../supabaseClient';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);
  const adminID = currentUser._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmStep, setConfirmStep] = useState(0); // 0=closed, 1=warning, 2=final
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteName, setPendingDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const deleteHandler = (deleteID, batchName) => {
    setPendingDeleteId(deleteID);
    setPendingDeleteName(batchName || "this batch");
    setConfirmStep(1);
  };

  const cancelDelete = () => {
    if (!deleting) {
      setConfirmStep(0);
      setPendingDeleteId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      // Unlink all students from this class first
      await supabase
        .from('profiles')
        .update({ sclass_id: null })
        .eq('sclass_id', pendingDeleteId);

      // Delete all subjects belonging to this class
      await supabase
        .from('subjects')
        .delete()
        .eq('sclass_id', pendingDeleteId);

      // Delete the class itself
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', pendingDeleteId);

      if (error) throw error;

      setMessage(`Batch "${pendingDeleteName}" deleted successfully.`);
      setShowPopup(true);
      dispatch(getAllSclasses(adminID, "Sclass")); // Refresh the list
    } catch (err) {
      setMessage("Error deleting batch: " + err.message);
      setShowPopup(true);
    } finally {
      setDeleting(false);
      setConfirmStep(0);
      setPendingDeleteId(null);
    }
  };


  const filteredClasses = (sclassesList || []).map(item => ({
    ...item,
    _id: item.id, // Ensure frontend _id maps to Supabase id
    sclassName: item.sclass_name,
    batchNumber: item.batch_number,
    passoutYear: item.passout_year,
    studentCount: item.students?.[0]?.count || 0,
    subjectCount: item.subjects?.[0]?.count || 0
  })).filter(item =>
    item.sclassName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Batch',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteOutlineRounded color="error" />, name: 'Delete All Batches',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <HeaderSection>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em', mb: 1 }}>
            Academic Batches
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--clr-text-muted)', fontWeight: 600 }}>
            Manage class structures, student assignments, and curricula.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <SearchBox>
            <SearchRounded sx={{ color: 'var(--clr-text-muted)' }} />
            <InputBase
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 1, flex: 1, color: 'var(--clr-text-primary)' }}
            />
          </SearchBox>
          <GreenButton
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => navigate("/Admin/addclass")}
          >
            Create Batch
          </GreenButton>
        </Stack>
      </HeaderSection>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {getresponse ? (
            <EmptyState>
              <Box sx={{ textAlign: 'center' }}>
                <ClassRounded sx={{ fontSize: '5rem', opacity: 0.2, mb: 2 }} />
                <Typography variant="h6" fontWeight={800}>No Batches Found</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Start by adding your first academic batch.</Typography>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
                  Add New Batch
                </GreenButton>
              </Box>
            </EmptyState>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                {filteredClasses.map((sclass) => (
                  <Grid item xs={12} sm={6} lg={4} key={sclass._id}>
                    <motion.div variants={cardVariants}>
                      <BatchCard>
                        <CardTop>
                          <Avatar sx={{
                            width: 56,
                            height: 56,
                            background: 'var(--grad-primary)',
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                          }}>
                            <SchoolRounded />
                          </Avatar>
                          <Box sx={{ flex: 1, ml: 2 }}>
                            <Typography variant="h6" fontWeight={800} noWrap>
                              {sclass.sclassName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                size="small"
                                label={`Batch ${sclass.batchNumber}`}
                                sx={{ fontWeight: 800, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--clr-primary)' }}
                              />
                              <Chip
                                size="small"
                                label={sclass.passoutYear}
                                sx={{ fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                              />
                            </Box>
                          </Box>
                        </CardTop>

                        <StatsRow>
                          <StatItem>
                            <PeopleAltRounded fontSize="small" />
                            <Typography variant="body2" fontWeight={800}>
                              {sclass.studentCount || 0} Students
                            </Typography>
                          </StatItem>
                          <StatItem>
                            <ClassRounded fontSize="small" />
                            <Typography variant="body2" fontWeight={800}>
                              {sclass.subjectCount || 0} Subjects
                            </Typography>
                          </StatItem>
                        </StatsRow>

                        <SectionBadges>
                          {sclass.sections?.map((sec, i) => (
                            <SectionChip key={i}>Sec {sec}</SectionChip>
                          ))}
                        </SectionBadges>

                        <CardActions>
                          <BlueButton
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<VisibilityRounded />}
                            onClick={() => navigate("/Admin/classes/class/" + sclass._id)}
                          >
                            View Details
                          </BlueButton>
                          <Tooltip title="Add Subject">
                            <IconButton
                              onClick={() => navigate("/Admin/addsubject/" + sclass._id)}
                              sx={{ background: 'var(--clr-surface-2)' }}
                            >
                              <PostAddRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Student">
                            <IconButton
                              onClick={() => navigate("/Admin/class/addstudents/" + sclass._id)}
                              sx={{ background: 'var(--clr-surface-2)' }}
                            >
                              <PersonAddRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Batch">
                            <IconButton
                              onClick={() => deleteHandler(sclass._id, sclass.sclassName)}
                              sx={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
                            >
                              <DeleteOutlineRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </BatchCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      {/* ── STEP 1: Warning Dialog ── */}
      <Dialog
        open={confirmStep === 1}
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'var(--clr-surface-1)',
            border: '1px solid rgba(239,68,68,0.25)',
            p: 0,
            minWidth: 420,
            overflow: 'hidden',
          }
        }}
      >
        {/* Red warning banner */}
        <Box sx={{
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <WarningAmberRounded sx={{ color: '#fbbf24', fontSize: '2.5rem' }} />
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              Danger Zone
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: 600 }}>
              This action is permanent and irreversible
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {/* Warning card */}
          <Box sx={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 3,
            p: 2.5,
            mb: 2.5,
          }}>
            <Typography sx={{ fontWeight: 900, color: '#ef4444', mb: 1.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ⚠️ What will be deleted
            </Typography>
            {[
              { icon: '🗂️', text: `Batch "${pendingDeleteName}" will be permanently removed` },
              { icon: '📚', text: 'All subjects assigned to this batch will be deleted' },
              { icon: '👤', text: 'All students will be unlinked (accounts remain, batch removed)' },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: i < 2 ? 1.5 : 0 }}>
                <Typography sx={{ fontSize: '1.1rem', mt: 0.1 }}>{item.icon}</Typography>
                <Typography sx={{ color: 'var(--clr-text-secondary)', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography sx={{ color: 'var(--clr-text-muted)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
            Are you sure you want to proceed to the final step?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 0, gap: 1.5 }}>
          <Button
            onClick={cancelDelete}
            fullWidth
            sx={{
              fontWeight: 700, borderRadius: 2,
              border: '1px solid var(--clr-border)',
              color: 'var(--clr-text-secondary)',
            }}
          >
            No, Keep Batch
          </Button>
          <Button
            onClick={() => setConfirmStep(2)}
            fullWidth
            variant="outlined"
            color="error"
            sx={{ fontWeight: 800, borderRadius: 2 }}
            startIcon={<WarningAmberRounded />}
          >
            I Understand, Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── STEP 2: Final Confirmation ── */}
      <Dialog
        open={confirmStep === 2}
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'var(--clr-surface-1)',
            border: '1px solid rgba(239,68,68,0.35)',
            p: 0,
            minWidth: 400,
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{
          background: 'rgba(239,68,68,0.08)',
          borderBottom: '1px solid rgba(239,68,68,0.15)',
          p: 3,
          textAlign: 'center',
        }}>
          <Typography sx={{ fontSize: '3rem', mb: 1 }}>🗑️</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--clr-text-primary)', letterSpacing: '-0.02em' }}>
            Final Confirmation
          </Typography>
          <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', mt: 0.5 }}>
            You cannot undo this action
          </Typography>
        </Box>

        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'var(--clr-text-secondary)', fontWeight: 600, mb: 1 }}>
            You are about to permanently delete batch:
          </Typography>
          <Typography sx={{
            fontWeight: 900, fontSize: '1.3rem',
            color: 'var(--clr-text-primary)',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 2, py: 1.5, px: 3,
            mb: 3,
            display: 'inline-block',
          }}>
            {pendingDeleteName}
          </Typography>

          <Button
            onClick={confirmDelete}
            disabled={deleting}
            fullWidth
            variant="contained"
            color="error"
            size="large"
            sx={{
              fontWeight: 900, borderRadius: 2.5, py: 1.8,
              fontSize: '1rem', letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              boxShadow: '0 4px 20px rgba(220,38,38,0.35)',
              '&:hover': { boxShadow: '0 8px 30px rgba(220,38,38,0.45)' },
            }}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlineRounded />}
          >
            {deleting ? 'Deleting Batch...' : `Delete "${pendingDeleteName}" Forever`}
          </Button>

          <Button
            onClick={cancelDelete}
            disabled={deleting}
            fullWidth
            sx={{ mt: 1.5, fontWeight: 700, color: 'var(--clr-text-muted)', borderRadius: 2 }}
          >
            Cancel — Go Back
          </Button>
        </DialogContent>
      </Dialog>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowClasses;

/* --- Styled Components --- */

const HeaderSection = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    gap: 20px;
    
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    background: var(--clr-surface-1);
    border: 1px solid var(--clr-border);
    border-radius: 12px;
    padding: 8px 16px;
    min-width: 320px;
    transition: all 0.2s;
    
    &:focus-within {
        border-color: var(--clr-primary);
        box-shadow: 0 0 0 3px var(--clr-primary-glow);
    }
    
    @media (max-width: 600px) {
        min-width: 100%;
    }
`;

const BatchCard = styled(Paper)`
    background: var(--clr-surface-1) !important;
    border: 1px solid var(--clr-border) !important;
    border-radius: 24px !important;
    padding: 24px !important;
    box-shadow: var(--shadow-sm) !important;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md) !important;
        border-color: var(--clr-primary) !important;
    }
    
    &::after {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 150px; height: 150px;
        background: radial-gradient(circle, var(--clr-primary-glow) 0%, transparent 70%);
        opacity: 0.1;
        pointer-events: none;
    }
`;

const CardTop = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
`;

const StatsRow = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    padding: 12px;
    background: var(--clr-surface-2);
    border-radius: 16px;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--clr-text-secondary);
    
    svg {
        color: var(--clr-primary);
        opacity: 0.8;
    }
`;

const SectionBadges = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 24px;
`;

const SectionChip = styled.div`
    background: var(--clr-bg);
    border: 1px solid var(--clr-border);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--clr-text-muted);
    text-transform: uppercase;
`;

const CardActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const EmptyState = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background: var(--clr-surface-1);
    border: 2px dashed var(--clr-border);
    border-radius: 32px;
`;
