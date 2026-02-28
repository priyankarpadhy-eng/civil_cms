import React, { useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import BranchRepDashboard from './pages/branchRep/BranchRepDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';
import AlumniPage from './pages/AlumniPage';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniRegisterPage from './pages/AlumniRegisterPage';
import StudentPortfolio from './pages/public/StudentPortfolio';

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  const subdomain = useMemo(() => {
    const host = window.location.hostname;
    const parts = host.split('.');

    // Known base instances that shouldn't trigger portfolio mode
    const baseHosts = [
      'localhost',
      'civil-cms.vercel.app', // Your vercel app base
      'civildeptigit.com'
    ];

    if (baseHosts.includes(host)) {
      return null;
    }

    if (parts.length >= 3 && parts[0] !== 'www') {
      const isVercelApp = parts.slice(-2).join('.') === 'vercel.app';
      if (isVercelApp && parts.length === 3) {
        // This is a base vercel app link like my-app.vercel.app, not a student portfolio.
        return null;
      }
      return parts[0];
    }

    // Handle special case for local testing: student.localhost
    if (parts.length === 2 && parts[1] === 'localhost') {
      return parts[0];
    }
    return null;
  }, []);

  return (
    <Router>
      {/* Dynamic Portfolio View for Subdomains */}
      {subdomain ? (
        <Routes>
          <Route path="/" element={<StudentPortfolio slug={subdomain} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <>
          {currentRole === null &&
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/portfolio/:slug" element={<StudentPortfolio />} />
              <Route path="/choose" element={<ChooseUser visitor="normal" />} />
              <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />
              <Route path="/alumni" element={<AlumniPage />} />

              <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
              <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
              <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
              <Route path="/Alumnilogin" element={<LoginPage role="Alumni" />} />

              <Route path="/Adminregister" element={<AdminRegisterPage />} />
              <Route path="/Alumniregister" element={<AlumniRegisterPage />} />

              <Route path='*' element={<Navigate to="/" />} />
            </Routes>}

          {currentRole === "Admin" && <AdminDashboard />}
          {currentRole === "Student" && <StudentDashboard />}
          {currentRole === "Teacher" && <TeacherDashboard />}
          {currentRole === "BranchRep" && <BranchRepDashboard />}
          {currentRole === "Alumni" && <AlumniDashboard />}
        </>
      )}
    </Router>
  )
}

export default App
