// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './styles.css';

// function UserDashboard() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Assuming you store JWT or token in localStorage
//     navigate('/login');
//   };

//   return (
//     <div className="dashboard-container">
//       <nav className="dashboard-navbar">
//         <div className="dashboard-logo">🏥 MyHospital</div>
//         <button onClick={handleLogout}>Logout</button>
//       </nav>

//       <div className="dashboard-main">
//         <aside className="dashboard-sidebar">
//           <ul>
//             <li>🏠 Home</li>
//             <li>👤 Profile</li>
//             <li>📅 Appointments</li>
//             <li>🗂️ Medical Records</li>
//             <li>💬 Messages</li>
//             <li>⚙️ Settings</li>
//           </ul>
//         </aside>

//         <section className="dashboard-content">
//           <h2>Welcome to Your Dashboard</h2><center>
//           <p>Here you can manage your appointments, view your health records, and communicate with your doctors.</p></center>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const mockUser = {
    name: 'John Doe',
    upcomingAppointment: {
      date: '2025-05-12',
      time: '10:00 AM',
      doctor: 'Dr. Emily Smith',
      department: 'General Medicine',
    },
    messages: 2,
    records: 4,
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">🏥 MyHospital</div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <ul>
            <li className="active">🏠 Home</li>
            <li>👤 Profile</li>
            <li>📅 Appointments</li>
            <li>🗂️ Medical Records</li>
            <li>💬 Messages</li>
            <li>⚙️ Settings</li>
          </ul>
        </aside>

        <section className="dashboard-content">
          <h2>Welcome, {mockUser.name} 👋</h2>
          <div className="dashboard-cards">
            <div className="card">
              <h3>📅 Next Appointment</h3>
              <p><strong>{mockUser.upcomingAppointment.date}</strong> at {mockUser.upcomingAppointment.time}</p>
              <p>With <em>{mockUser.upcomingAppointment.doctor}</em></p>
              <p><small>({mockUser.upcomingAppointment.department})</small></p>
            </div>

            <div className="card">
              <h3>🗂️ Medical Records</h3>
              <p>You have <strong>{mockUser.records}</strong> records saved.</p>
            </div>

            <div className="card">
              <h3>💬 Messages</h3>
              <p><strong>{mockUser.messages}</strong> new messages from your doctor.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
