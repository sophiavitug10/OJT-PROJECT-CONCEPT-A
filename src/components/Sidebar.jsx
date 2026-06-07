import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <aside className="sidebar">
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "8px" }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "13px", color: "#C9A84C", fontWeight: "600" }}>Diocese Portal</div>
        <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#4A6A4A", marginTop: "2px" }}>Staff Dashboard</div>
      </div>
      
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div className={`sidebar-item ${currentPath === '/dashboard' ? 'sidebar-item-active' : ''}`}>
          <span>📋</span> All Requests
        </div>
      </Link>

      <div className="sidebar-item" style={{ marginTop: "auto" }} onClick={() => navigate('/')}>
        <span>🚪</span> Sign Out
      </div>
    </aside>
  );
}