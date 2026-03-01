import React from 'react';
import styled from 'styled-components';
import { Avatar, Box, Typography, Grid, Paper, Divider, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { updateUser } from '../../redux/userRelated/userHandle';
import ProfileOnboarding from '../../components/ProfileOnboarding';
import FaceScanModal from '../../components/FaceScanModal';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FaceRetouchingNaturalRoundedIcon from '@mui/icons-material/FaceRetouchingNaturalRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const StudentProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [scanModalOpen, setScanModalOpen] = React.useState(false);

  if (!currentUser) return null;

  // Check if onboarding is complete
  const isStudent = currentUser.role === 'Student';
  const needsOnboarding = isStudent && (!currentUser.verification_status || currentUser.verification_status === 'unsubmitted' || (!currentUser.roll_num && !currentUser.rollNum));

  if (needsOnboarding) {
    return <ProfileOnboarding user={currentUser} type="Student" />;
  }

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Verification Form - ${currentUser.name}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1f2937; padding-bottom: 20px; }
            .header img { height: 60px; margin-bottom: 10px; }
            .profile-photo { width: 120px; height: 120px; border-radius: 8px; border: 1px solid #ccc; object-fit: cover; }
            .row { margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px; }
            .sig-box { margin-top: 100px; display: flex; justify-content: space-between; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>IGIT Sarang - Civil Engineering</h2>
            <h3>Student Profile Verification Form</h3>
          </div>
          <div style="display: flex; gap: 30px; margin-bottom: 30px;">
            ${currentUser.avatar_url ? `<img src="${currentUser.avatar_url}" class="profile-photo" alt="Profile Photo" />` : `<div class="profile-photo" style="display:flex;align-items:center;justify-content:center;background:#f3f4f6;color:#9ca3af;">No Photo</div>`}
            <div>
                <p><strong>Name:</strong> ${currentUser.name}</p>
                <p><strong>Email (Verified):</strong> ${currentUser.email}</p>
                <p><strong>Mobile:</strong> ${currentUser.phone || 'N/A'}</p>
            </div>
          </div>
          <div class="row"><strong>Roll Number:</strong> ${currentUser.roll_num || currentUser.rollNum || 'N/A'}</div>
          <div class="row"><strong>Registration No:</strong> ${currentUser.registration_num || 'N/A'}</div>
          <div class="row"><strong>Admission No:</strong> ${currentUser.admission_num || 'N/A'}</div>
          <div class="row"><strong>Home Address:</strong> ${currentUser.residence_address || 'N/A'}</div>
          <div class="row"><strong>Current Address (Hostel/Day Scholar):</strong> ${currentUser.current_address || 'N/A'}</div>
          
          <div class="sig-box">
             <div>_______________________<br/><br/>Student Signature</div>
             <div>_______________________<br/><br/>Verifying Officer / Admin</div>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isStudent && currentUser.verification_status === 'pending') {
    return (
      <Box sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: { xs: 4, md: 10 } }}>
        <Paper sx={{ p: 5, borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-surface-1)', boxShadow: 'var(--shadow-md)' }}>
          <Box sx={{ width: 80, height: 80, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Typography fontSize="2.5rem">⌛</Typography>
          </Box>
          <Typography variant="h4" fontWeight={900} mb={2} color="var(--clr-text-primary)">
            Profile Under Verification
          </Typography>
          <Typography sx={{ color: 'var(--clr-text-secondary)', mb: 4, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Your profile details have been saved successfully and are pending admin approval.
            Please download your verification form and submit the physical copy along with your foundational documents to the department office.
          </Typography>
          <Button
            variant="contained"
            onClick={handleDownloadPDF}
            sx={{
              borderRadius: 3, px: 4, py: 1.5, fontWeight: 800, fontSize: '1rem',
              background: 'var(--grad-primary)',
              boxShadow: 'var(--shadow-primary)'
            }}
          >
            Download Verification PDF
          </Button>
        </Paper>
      </Box>
    );
  }

  const sclassName = currentUser?.sclassName;
  const studentSchool = currentUser?.school;

  const handleFaceCapture = ({ image, descriptor }) => {
    dispatch(updateUser({
      faceData: image,
      faceDescriptor: descriptor,
      faceCaptured: true
    }, currentUser._id, "Student"));
  };

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const personalInfo = [
    { icon: <EmailRoundedIcon />, label: 'Institutional Email', value: currentUser.email || 'student@igit.ac.in' },
    { icon: <PhoneRoundedIcon />, label: 'Contact Number', value: currentUser.phone || '+91 98765 43210' },
    { icon: <LocationOnRoundedIcon />, label: 'Hostel/Address', value: currentUser.residence_address || 'B-Block, IGIT Campus' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h4" sx={{
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        mb: 4,
        color: 'var(--clr-text-primary)',
        letterSpacing: '-0.02em'
      }}>
        Student Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <SidebarCard>
            <AvatarBox>
              <StyledAvatar
                src={currentUser.avatar_url || currentUser.faceData || ""}
                sx={{ width: 120, height: 120 }}
              >
                {!(currentUser.avatar_url || currentUser.faceData) && initials}
              </StyledAvatar>
              <StatusIndicator />
            </AvatarBox>
            <NameText>{currentUser.name}</NameText>
            <RoleText>{currentUser.role === 'CDC Coordinator' ? 'CDC Coordinator' : 'Student'} · Civil Engineering</RoleText>

            {currentUser.faceCaptured ? (
              <ChipBox color="#10b981">
                <CheckCircleRoundedIcon sx={{ fontSize: '1rem' }} /> Face Verified for Attendance
              </ChipBox>
            ) : (
              <ScanButton
                onClick={() => setScanModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaceRetouchingNaturalRoundedIcon /> Scan Face for Attendance
              </ScanButton>
            )}

            <Divider sx={{ width: '100%', my: 3, borderColor: 'var(--clr-border)' }} />

            <QuickTags>
              <Tag color="#818cf8"><SchoolRoundedIcon /> {sclassName?.sclassName || 'B.Tech Civil Engg.'}</Tag>
              <Tag color="#10b981"><BadgeRoundedIcon /> Roll: {currentUser.roll_num || currentUser.rollNum}</Tag>
              <Tag color="#f59e0b"><BadgeRoundedIcon /> Reg: {currentUser.registration_num}</Tag>
            </QuickTags>

            <InstitutionBox>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>
                Institution
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                IGIT Sarang, Odisha
              </Typography>
            </InstitutionBox>
          </SidebarCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <span style={{ fontSize: '1.25rem' }}>📋</span> Personal Details
                </Typography>
                <Grid container spacing={3}>
                  {personalInfo.map((info, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <InfoItem>
                        <IconCircle>{info.icon}</IconCircle>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {info.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--clr-text-primary)' }}>
                            {info.value}
                          </Typography>
                        </Box>
                      </InfoItem>
                    </Grid>
                  ))}
                </Grid>
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <MainCard>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <span style={{ fontSize: '1.25rem' }}>🎓</span> Academic Status
                </Typography>
                <AcademicGrid>
                  <AcademicItem>
                    <Label>Current Semester</Label>
                    <Value>{currentUser.current_semester || '6th Sem'}</Value>
                  </AcademicItem>
                  <AcademicItem>
                    <Label>Branch</Label>
                    <Value>Civil Engineering</Value>
                  </AcademicItem>
                  <AcademicItem>
                    <Label>Section</Label>
                    <Value>{currentUser.section || 'A'}</Value>
                  </AcademicItem>
                  <AcademicItem>
                    <Label>Enrollment Year</Label>
                    <Value>{currentUser.batchNumber || '2022'}</Value>
                  </AcademicItem>
                  <AcademicItem>
                    <Label>Profile Status</Label>
                    <Value style={{ color: '#10b981' }}>Verified ✨</Value>
                  </AcademicItem>
                </AcademicGrid>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <FaceScanModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onCapture={handleFaceCapture}
      />
    </motion.div>
  );
};

export default StudentProfile;

const SidebarCard = styled(Paper)`
  background: var(--clr-surface-1) !important;
  border: 1px solid var(--clr-border) !important;
  border-radius: 28px !important;
  padding: 40px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm) !important;
`;

const AvatarBox = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const StyledAvatar = styled(Avatar)`
  background: var(--grad-primary) !important;
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  font-size: 2.5rem !important;
  border: 4px solid var(--clr-surface-2) !important;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2) !important;
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 8px; right: 8px;
  width: 18px; height: 18px;
  background: #10b981;
  border: 3px solid var(--clr-surface-1);
  border-radius: 50%;
`;

const NameText = styled.h2`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  margin-bottom: 4px;
`;

const RoleText = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--clr-text-muted);
  margin-bottom: 24px;
`;

const QuickTags = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Tag = styled.div`
  background: ${p => p.color + '15'};
  color: ${p => p.color};
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  svg { font-size: 1.1rem; }
`;

const InstitutionBox = styled.div`
  margin-top: 32px;
  text-align: center;
  width: 100%;
  padding: 16px;
  background: var(--clr-surface-2);
  border-radius: 16px;
`;

const MainCard = styled(Paper)`
  background: var(--clr-surface-1) !important;
  border: 1px solid var(--clr-border) !important;
  border-radius: 28px !important;
  padding: 32px !important;
  box-shadow: var(--shadow-sm) !important;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--clr-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-primary);
  svg { font-size: 1.25rem; }
`;

const AcademicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5px;
  background: var(--clr-border);
  border: 1px solid var(--clr-border);
  border-radius: 16px;
  overflow: hidden;
`;

const AcademicItem = styled.div`
  background: var(--clr-surface-1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScanButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: var(--grad-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  margin-bottom: 24px;
`;

const ChipBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${p => p.color + '15'};
  color: ${p => p.color};
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 24px;
  border: 1px solid ${p => p.color + '30'};
`;


const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Value = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: var(--clr-text-primary);
`;