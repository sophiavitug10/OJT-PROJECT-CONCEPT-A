import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      
      <header className="hero">
        <p className="hero-eyebrow">Roman Catholic Bishop of Caloocan</p>
        <h1 className="hero-title">Diocesan Appointment &<br />Certificate Request Portal</h1>
        <p className="hero-sub">
          Request sacramental records and book pastoral appointments securely and conveniently — anytime, from anywhere.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => navigate('/request-certificate')}>Request a Certificate</button>
          <button className="btn-outline" onClick={() => navigate('/book-appointment')}>Book an Appointment</button>
        </div>
      </header>
      
      <section className="section">
        <h2 className="section-title">Our Services</h2>
        <p className="section-sub">Everything you need from your parish — now online.</p>
        <div className="card-grid">
          <div className="card" onClick={() => navigate('/request-certificate')}>
            <div className="card-icon">📜</div>
            <div className="card-title">Sacramental Records</div>
            <div className="card-desc">Request certified copies of baptismal, confirmation, marriage, and burial certificates.</div>
          </div>
          <div className="card" onClick={() => navigate('/book-appointment')}>
            <div className="card-icon">📅</div>
            <div className="card-title">Pastoral Appointments</div>
            <div className="card-desc">Schedule time with your parish priest for counseling, preparation, or spiritual guidance.</div>
          </div>
          <div className="card" onClick={() => navigate('/login')}>
            <div className="card-icon">🔒</div>
            <div className="card-title">Staff Dashboard</div>
            <div className="card-desc">Secure login for parish administrative staff to manage requests and schedules.</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}