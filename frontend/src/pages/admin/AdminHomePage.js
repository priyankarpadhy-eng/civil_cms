import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import SeeNotice from '../../components/SeeNotice';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const statCards = (students, classes, teachers) => [
  {
    label: 'Total Students',
    value: students,
    icon: PeopleAltRoundedIcon,
    gradient: 'linear-gradient(135deg, #6C63FF, #A855F7)',
    glow: 'rgba(108,99,255,0.25)',
    prefix: '',
    suffix: '',
    trend: '+12%',
  },
  {
    label: 'Total Classes',
    value: classes,
    icon: SchoolRoundedIcon,
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    glow: 'rgba(59,130,246,0.25)',
    prefix: '',
    suffix: '',
    trend: '+3',
  },
  {
    label: 'Total Teachers',
    value: teachers,
    icon: GroupsRoundedIcon,
    gradient: 'linear-gradient(135deg, #22C55E, #10B981)',
    glow: 'rgba(34,197,94,0.25)',
    prefix: '',
    suffix: '',
    trend: '+2',
  },
  {
    label: 'Fee Collection',
    value: 23000,
    icon: AccountBalanceWalletRoundedIcon,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    glow: 'rgba(245,158,11,0.25)',
    prefix: '$',
    suffix: '',
    trend: '+8%',
  },
];

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector(state => state.student);
  const { sclassesList } = useSelector(state => state.sclass);
  const { teachersList } = useSelector(state => state.teacher);
  const { currentUser } = useSelector(state => state.user);
  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const cards = statCards(
    studentsList?.length || 0,
    sclassesList?.length || 0,
    teachersList?.length || 0,
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Wrapper>
      {/* Header */}
      <PageHeader>
        <div>
          <InstitutionLabel>🏛️ Dept. of Civil Engineering · Indira Gandhi Institute of Technology, Sarang</InstitutionLabel>
          <Greeting>{greeting}, {currentUser?.name?.split(' ')[0] || 'Admin'} 👋</Greeting>
          <PageSubtitle>Here's what's happening in the Civil Engineering Department today.</PageSubtitle>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <StatsGrid>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <StatCard key={card.label} style={{ animationDelay: `${i * 80}ms` }}>
              <CardTop>
                <CardInfo>
                  <CardLabel>{card.label}</CardLabel>
                  <CardValue>
                    <CountUp start={0} end={card.value} duration={2.5}
                      prefix={card.prefix} suffix={card.suffix} />
                  </CardValue>
                  <TrendBadge>
                    <TrendingUpRoundedIcon sx={{ fontSize: 13 }} />
                    {card.trend} this month
                  </TrendBadge>
                </CardInfo>
                <IconBox gradient={card.gradient} glow={card.glow}>
                  <Icon sx={{ fontSize: 24, color: '#fff' }} />
                </IconBox>
              </CardTop>
              <CardBar gradient={card.gradient} />
            </StatCard>
          );
        })}
      </StatsGrid>

      {/* Notices Section */}
      <SectionTitle>📢 Recent Notices</SectionTitle>
      <NoticeCard>
        <SeeNotice />
      </NoticeCard>
    </Wrapper>
  );
};

export default AdminHomePage;

/* ── Styled Components ── */

const Wrapper = styled.div`
  padding-bottom: 40px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
`;

const InstitutionLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--clr-primary-light);
  letter-spacing: 0.03em;
  margin-bottom: 6px;
  opacity: 0.85;
`;

const Greeting = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 800;
  color: var(--clr-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--clr-text-muted);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 24px;
  animation: ${fadeUp} 0.5s var(--ease-out) both;
  transition: all 0.25s var(--ease-out);
  position: relative;
  &:hover {
    transform: translateY(-4px);
    border-color: var(--clr-border-hover);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--clr-text-primary);
  line-height: 1;
  margin-bottom: 8px;
`;

const TrendBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--clr-success);
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 50px;
  padding: 2px 8px;
`;

const IconBox = styled.div`
  width: 48px; height: 48px;
  border-radius: 14px;
  background: ${p => p.gradient};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px ${p => p.glow};
`;

const CardBar = styled.div`
  height: 3px;
  border-radius: 2px;
  background: ${p => p.gradient};
  opacity: 0.6;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.01em;
  animation: ${fadeUp} 0.5s 0.2s var(--ease-out) both;
`;

const NoticeCard = styled.div`
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  animation: ${fadeUp} 0.5s 0.25s var(--ease-out) both;
`;