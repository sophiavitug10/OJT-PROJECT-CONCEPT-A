import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // <--- THIS IS CRITICAL

import Home from './pages/Home';
import CertificateRequest from './pages/CertificateRequest';
import AppointmentBooking from './pages/AppointmentBooking';
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import RequestDetail from './pages/RequestDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request-certificate" element={<CertificateRequest />} />
        <Route path="/book-appointment" element={<AppointmentBooking />} />
        <Route path="/login" element={<StaffLogin />} />
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route path="/dashboard/request/:id" element={<RequestDetail />} />
      </Routes>
    </Router>
  );
}