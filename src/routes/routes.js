import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../App/Login/login';
import Signup from '../App/Signup/signup';
import Layout from '../App/Layout/Layout';
import Home from '../App/Home/Home';
import JobDescriptionPage from '../App/JobDescription/JobDescription';
import ProtectedRoute from './protectedRoute';
import Contact from '../App/Contact/contact';
import Company from '../App/Company/Company';
import JobView from '../App/ViewJobDescription/ViewJobDescription';
import CandidateDetails from '../App/CandidateDetails/CandidateDetails';
import Profile from '../App/Profile/Profile';
import SignupCandidate from '../App/Signup/SignupCandidate';
import UserList from '../App/Users/UserList';
import JobListCandidate from '../App/JobDescription/JobDescriptionCandidate';

const AppRouter = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  // Redirect to appropriate route based on role and token
  useEffect(() => {
    if (token && userDetails?.role === 'candidate' && location.pathname === '/') {
      return <Navigate to="/layout/jobdescriptioncandidate" replace />;
    } else if (token && userDetails?.role && location.pathname === '/') {
      return <Navigate to="/layout" replace />;
    }
  }, [token, userDetails, location]);
  

  // Role-based access control
  const isAdmin = userDetails?.role === 'admin';
  const isCandidate = userDetails?.role === 'candidate';
  const isEmployee = userDetails?.role === 'employee';

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={!token ? <Login /> : isCandidate ? <Navigate to="/layout/jobdescriptioncandidate" replace /> : <Navigate to="/layout" replace />}
      />
      <Route
        path="/signup"
        element={!token ? <Signup /> : isCandidate ? <Navigate to="/layout/jobdescriptioncandidate" replace /> : <Navigate to="/layout" replace />}
      />
      <Route path="/signup/candidate" element={<SignupCandidate />} />

      {/* Shared Layout Route */}
      <Route path="/layout" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Admin & Employee */}
        <Route index element={(isAdmin || isEmployee) ? <Home /> : <Navigate to="/layout/jobdescriptioncandidate" replace />} />
        <Route path="jobdescription" element={(isAdmin || isEmployee) ? <JobDescriptionPage /> : <Navigate to="/layout/jobdescriptioncandidate" replace />} />
        <Route path="candidate" element={(isAdmin || isEmployee) ? <CandidateDetails /> : <Navigate to="/layout/jobdescriptioncandidate" replace />} />

        {/* Candidate */}
        <Route path="jobdescriptioncandidate" element={isCandidate ? <JobListCandidate /> : <Navigate to="/" replace />} />

        {/* View Job Details */}
        <Route path="viewjob/:jobId" element={<ProtectedRoute><JobView /></ProtectedRoute>} />

        {/* Admin Only */}
        <Route path="userlist" element={isAdmin ? <UserList /> : <Navigate to="/" replace />} />

        {/* Profile (Accessible to all logged-in users) */}
        <Route path="profile" element={<Profile />} />

        {/* Contact & Company Info */}
        <Route path="contact" element={<Contact />} />
        <Route path="company" element={<Company />} />
      </Route>

      {/* Catch-all route to redirect unauthorized users */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
