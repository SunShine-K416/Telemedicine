import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-logo">🏥 MyHospital</div>
        <div className="navbar-links">
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      <div className="home-content">
        <h1>Welcome to MyHospital</h1>
        <p>Delivering world-class healthcare at your fingertips. Access virtual consultations, schedule appointments, and manage your health records — all from the comfort of your home.</p>
        <div className="home-buttons">
          <button onClick={() => navigate('/register')}>Get Started</button>
          <button onClick={() => navigate('/login')}>Already a Member?</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
