import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import Popup from '../../components/Popup';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const TeacherComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const { status, currentUser, error } = useSelector(state => state.user);

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Complaint submitted successfully!");
      setShowPopup(true);
      setComplaint("");
      setDate("");
    } else if (error) {
      setLoader(false);
      setMessage("Network Error — please try again.");
      setShowPopup(true);
    }
  }, [status, error]);

  if (!currentUser) return null;

  const user = currentUser._id;
  const school = currentUser.school?._id || currentUser.school_id;
  const address = "Complain";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff({ user, date, complaint, school }, address));
  };

  return (
    <Wrapper>
      <FormSection>
        {/* Header */}
        <FormHeader>
          <IconCircle>
            <CampaignRoundedIcon sx={{ fontSize: 28, color: '#fff' }} />
          </IconCircle>
          <HeaderText>
            <FormTitle>Submit an Issue/Complaint</FormTitle>
            <FormSub>Civil Engineering Department · IGIT Sarang</FormSub>
          </HeaderText>
        </FormHeader>

        <Divider />

        {/* Info Banner */}
        <InfoBanner>
          <span>ℹ️</span>
          <span>
            Faculty complaints go directly to the department head/admin. Please ensure incidents are reported accurately.
          </span>
        </InfoBanner>

        {/* Form */}
        <form onSubmit={submitHandler}>
          <FieldGroup>
            <FieldLabel>
              <CalendarTodayRoundedIcon sx={{ fontSize: 15 }} />
              Incident/Report Date
            </FieldLabel>
            <StyledInput
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              <EditNoteRoundedIcon sx={{ fontSize: 15 }} />
              Detailed Description
            </FieldLabel>
            <StyledTextarea
              placeholder="Provide full details of the issue, including affected students or facilities…"
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              required
              rows={6}
            />
            <CharCount>{complaint.length} characters</CharCount>
          </FieldGroup>

          <SubmitBtn type="submit" disabled={loader || !date || !complaint.trim()}>
            {loader
              ? <CircularProgress size={20} sx={{ color: '#fff' }} />
              : <><SendRoundedIcon sx={{ fontSize: 18 }} /> Submit Report</>
            }
          </SubmitBtn>
        </form>

        <FootNote>
          Your report is logged securely and will be addressed by administration.
        </FootNote>
      </FormSection>

      {/* Side Info */}
      <SidePanel>
        <SidePanelTitle>📋 Reporting Guidelines</SidePanelTitle>
        {[
          { icon: '🎯', title: 'Clear Facts', text: 'Stick to objective facts and documented dates.' },
          { icon: '👥', title: 'Student Issues', text: 'Include student Roll Numbers if applicable.' },
          { icon: '🏫', title: 'Facilities', text: 'Specify the exact room/lab for facility issues.' },
          { icon: '⏰', title: 'Urgency', text: 'For critical emergencies, contact admin immediately.' },
        ].map((item, i) => (
          <GuideCard key={i}>
            <GuideIcon>{item.icon}</GuideIcon>
            <GuideText>
              <GuideTitle>{item.title}</GuideTitle>
              <GuideDesc>{item.text}</GuideDesc>
            </GuideText>
          </GuideCard>
        ))}
      </SidePanel>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Wrapper>
  );
};

export default TeacherComplain;

/* ── Styled Components ── */

const Wrapper = styled.div`
  display: grid; grid-template-columns: 1fr 340px; gap: 24px;
  max-width: 1000px; padding-bottom: 48px;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const FormSection = styled.div`
  background: var(--clr-surface-2); border: 1px solid var(--clr-border);
  border-radius: 20px; padding: 32px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
  @media (max-width: 600px) { padding: 24px 20px; }
`;

const FormHeader = styled.div`
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
`;

const IconCircle = styled.div`
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, #A855F7, #6C63FF);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(168,85,247,0.35);
`;

const HeaderText = styled.div``;

const FormTitle = styled.h1`
  font-family: var(--font-display); font-size: 1.5rem; font-weight: 800;
  color: var(--clr-text-primary); letter-spacing: -0.02em; margin-bottom: 3px;
`;

const FormSub = styled.p`
  font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;
`;

const Divider = styled.div`
  height: 1px; background: var(--clr-border); margin-bottom: 24px;
`;

const InfoBanner = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.18);
  border-radius: 12px; padding: 14px 16px; font-size: 0.85rem;
  color: rgba(240,239,255,0.75); line-height: 1.5; margin-bottom: 24px;
`;

const FieldGroup = styled.div` margin-bottom: 20px; `;

const FieldLabel = styled.label`
  display: flex; align-items: center; gap: 6px; font-size: 0.85rem;
  font-weight: 600; color: var(--clr-text-secondary); margin-bottom: 8px;
`;

const StyledInput = styled.input`
  width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05);
  border: 1px solid var(--clr-border); border-radius: 12px;
  color: var(--clr-text-primary); font-size: 0.95rem; font-family: var(--font-base);
  outline: none; transition: all 0.2s; color-scheme: dark;
  &:hover { border-color: var(--clr-border-hover); }
  &:focus {
    border-color: #C084FC; background: rgba(168,85,247,0.06);
    box-shadow: 0 0 0 3px rgba(168,85,247,0.2);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05);
  border: 1px solid var(--clr-border); border-radius: 12px;
  color: var(--clr-text-primary); font-size: 0.95rem; font-family: var(--font-base);
  outline: none; resize: vertical; transition: all 0.2s; line-height: 1.6;
  &::placeholder { color: var(--clr-text-muted); }
  &:hover { border-color: var(--clr-border-hover); }
  &:focus {
    border-color: #C084FC; background: rgba(168,85,247,0.06);
    box-shadow: 0 0 0 3px rgba(168,85,247,0.2);
  }
`;

const CharCount = styled.p`
  font-size: 0.72rem; color: var(--clr-text-muted); text-align: right; margin-top: 6px;
`;

const SubmitBtn = styled.button`
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #A855F7, #6C63FF); color: #fff;
  font-size: 1rem; font-weight: 700; font-family: var(--font-base);
  border: none; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(168,85,247,0.3); transition: all 0.25s; margin-bottom: 16px;
  &:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 8px 30px rgba(168,85,247,0.4);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const FootNote = styled.p`
  font-size: 0.78rem; color: var(--clr-text-muted); text-align: center;
`;

const SidePanel = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  animation: ${fadeUp} 0.5s 0.1s var(--ease-out) both;
`;

const SidePanelTitle = styled.h2`
  font-family: var(--font-display); font-size: 1.05rem; font-weight: 700;
  color: var(--clr-text-primary); margin-bottom: 6px;
`;

const GuideCard = styled.div`
  display: flex; gap: 14px;
  background: var(--clr-surface-2); border: 1px solid var(--clr-border);
  border-radius: 14px; padding: 16px; transition: all 0.2s;
  &:hover { border-color: rgba(168,85,247,0.25); transform: translateX(3px); }
`;

const GuideIcon = styled.div`font-size: 1.4rem; flex-shrink: 0;`;

const GuideText = styled.div``;

const GuideTitle = styled.p`
  font-size: 0.88rem; font-weight: 700; color: var(--clr-text-primary); margin-bottom: 3px;
`;

const GuideDesc = styled.p`
  font-size: 0.8rem; color: var(--clr-text-muted); line-height: 1.45;
`;