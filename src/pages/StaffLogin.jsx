import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function StaffLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <div>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">✝</div>
          <h2 className="form-title" style={{ textAlign: "center", fontSize: "20px" }}>Staff Portal Login</h2>
          <p className="form-sub" style={{ textAlign: "center", marginBottom: "2rem" }}>Secure access for diocesan administrative staff only.</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="staff@diocese.ph" required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>Sign In →</button>
          </form>
        </div>
      </div>
    </div>
  );
}