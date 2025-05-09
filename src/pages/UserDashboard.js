import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming you store JWT or token in localStorage
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">🏥 MyHospital</div>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <ul>
            <li>🏠 Home</li>
            <li>👤 Profile</li>
            <li>📅 Appointments</li>
            <li>🗂️ Medical Records</li>
            <li>💬 Messages</li>
            <li>⚙️ Settings</li>
          </ul>
        </aside>

        <section className="dashboard-content">
          <h2>Welcome to Your Dashboard</h2><center>
          <p>Here you can manage your appointments, view your health records, and communicate with your doctors.</p></center>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
