import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetail from './pages/JobDetail.jsx';
import DashboardStudent from './pages/DashboardStudent.jsx';
import DashboardRecruiter from './pages/DashboardRecruiter.jsx';
import PostJob from './pages/PostJob.jsx';
import ApplicationsStudent from './pages/ApplicationsStudent.jsx';
import ApplicantsRecruiter from './pages/ApplicantsRecruiter.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><DashboardStudent /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute role="student"><ApplicationsStudent /></ProtectedRoute>} />
          <Route path="/student/resume" element={<ProtectedRoute role="student"><ResumeUpload /></ProtectedRoute>} />
          <Route path="/recruiter/dashboard" element={<ProtectedRoute role="recruiter"><DashboardRecruiter /></ProtectedRoute>} />
          <Route path="/recruiter/post-job" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><ApplicantsRecruiter /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
