import React, { useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import BranchRepDashboard from './pages/branchRep/BranchRepDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChooseUser from './pages/ChooseUser';
import AlumniPage from './pages/AlumniPage';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import StudentPortfolio from './pages/public/StudentPortfolio';

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  const subdomain = useMemo(() => {
    const host = window.location.hostname;
    const parts = host.split('.');

    // Known base instances
    const baseHosts = ['localhost', 'civil-cms.vercel.app', 'civildeptigit.com'];
    if (baseHosts.includes(host)) return null;

    if (parts.length >= 3 && parts[0] !== 'www') {
      const isVercelApp = parts.slice(-2).join('.') === 'vercel.app';
      if (isVercelApp && parts.length === 3) return null;
      return parts[0];
    }
    if (parts.length === 2 && parts[1] === 'localhost') return parts[0];
    return null;
  }, []);

  return (
    <Router>
      {subdomain ? (
        <Routes>
          <Route path="/" element={<StudentPortfolio slug={subdomain} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <>
          {currentRole === null && (
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/portfolio/:slug" element={<StudentPortfolio />} />
              <Route path="/choose" element={<ChooseUser visitor="normal" />} />
              <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />
              <Route path="/alumni" element={<AlumniPage />} />

              {/* Legacy routes redirected to unified login */}
              <Route path="/Adminlogin" element={<Navigate to="/login" />} />
              <Route path="/Studentlogin" element={<Navigate to="/login" />} />
              <Route path="/Teacherlogin" element={<Navigate to="/login" />} />
              <Route path="/Alumnilogin" element={<Navigate to="/login" />} />

              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          )}

          {currentRole === "Admin" && <AdminDashboard />}

          {/* Shared dashboards for student roles */}
          {(currentRole === "Student" || currentRole === "BranchRep" || currentRole === "CdcCoordinator") && (
            <StudentDashboard />
          )}

          {/* Shared dashboards for faculty roles */}
          {(currentRole === "Faculty" || currentRole === "Teacher" || currentRole === "CdcFaculty") && (
            <TeacherDashboard />
          )}

          {currentRole === "Alumni" && <AlumniDashboard />}
        </>
      )}
    </Router>
  )
}

export default App
