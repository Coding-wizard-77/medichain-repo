import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './DoctorDashboard.css'; // This will link to the custom CSS below

export default function DoctorDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-icon">⚕</div>
        <h1 className="dashboard-title">MedChain Doctor Dashboard</h1>
        <p className="dashboard-subtitle">Securely manage access and view patient records</p>
      </header>

      <nav className="dashboard-nav">
        <NavLink
          to="requests"
          className={({ isActive }) =>
            `dashboard-tab ${isActive ? 'active' : ''}`
          }
        >
          Access Requests
        </NavLink>
        <NavLink
          to="records"
          className={({ isActive }) =>
            `dashboard-tab ${isActive ? 'active' : ''}`
          }
        >
          Patient Records
        </NavLink>
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
