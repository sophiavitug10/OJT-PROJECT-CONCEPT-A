import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dash-main">
        <h1 className="form-title" style={{ fontSize: "22px", margin: "0 0 4px" }}>All Requests</h1>
        <p className="form-sub">Manage incoming certificate and appointment requests</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">5</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">12</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">Name</th>
              <th className="th">Type</th>
              <th className="th">Status</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td" style={{ fontWeight: "600" }}>REQ-001</td>
              <td className="td">Juan Dela Cruz</td>
              <td className="td">Baptismal</td>
              <td className="td"><span className="badge badge-pending">Pending</span></td>
              <td className="td">
                <button className="btn-outline btn-outline-dark" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => navigate('/dashboard/request/REQ-001')}>View</button>
              </td>
            </tr>
             <tr>
              <td className="td" style={{ fontWeight: "600" }}>REQ-002</td>
              <td className="td">Maria Santos</td>
              <td className="td">Counseling</td>
              <td className="td"><span className="badge badge-confirmed">Confirmed</span></td>
              <td className="td">
                <button className="btn-outline btn-outline-dark" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => navigate('/dashboard/request/REQ-002')}>View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}