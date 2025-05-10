import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // ✅ Added this line

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      if (res.data && res.data.user) {
        alert(`Welcome, ${res.data.user.name}`);
        navigate('/dashboard'); // ✅ Correctly call navigate after login
      } else {
        alert('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="container">
      <h2 className="form-title">Hospital Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">Login</button>
        <p className="form-text">
          Don&apos;t have an account? <Link to="/register" className="form-link">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
