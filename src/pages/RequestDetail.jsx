import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dash-main">
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <button className="btn-outline btn-outline-dark" style={{ padding: "8px 16px", marginBottom: "2rem" }} onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </button>
          
          <h2 className="form-title">Request Details for {id}</h2>
          <p className="form-sub">Submitted recently.</p>
          
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", border: "1px solid #E8E4DC", marginBottom: "2rem" }}>
            <p><strong>Name:</strong> Juan Dela Cruz</p>
            <p><strong>Record Type:</strong> Baptismal</p>
            <p><strong>Purpose:</strong> Marriage Requirement</p>
            <p><strong>Status:</strong> <span className="badge badge-pending">Pending</span></p>
          </div>

          <h3 className="form-title" style={{ fontSize: "18px" }}>Staff Actions</h3>
          <textarea className="textarea" placeholder="Staff Notes..." style={{ marginBottom: "1rem" }}></textarea>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn-primary">Mark as Approved</button>
            <button className="btn-outline btn-outline-dark">Decline</button>
          </div>
        </div>
      </main>
    </div>
  );
}