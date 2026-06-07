import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <div className="nav-logo">✝</div>
        <span className="nav-brand-text">Diocese Portal</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/request-certificate" className={`nav-link ${currentPath === '/request-certificate' ? 'nav-link-active' : ''}`} style={{ textDecoration: 'none' }}>
            Request Certificate
          </Link>
        </li>
        <li>
          <Link to="/book-appointment" className={`nav-link ${currentPath === '/book-appointment' ? 'nav-link-active' : ''}`} style={{ textDecoration: 'none' }}>
            Book Appointment
          </Link>
        </li>
        <li>
          <Link to="/login" className={`nav-link ${currentPath.includes('/login') || currentPath.includes('/dashboard') ? 'nav-link-active' : ''}`} style={{ textDecoration: 'none' }}>
            Staff Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}