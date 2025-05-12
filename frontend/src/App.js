import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AppointmentPage from './pages/AppointmentPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import DasboardHome from './pages/DasboardHome';
import AdminDashboard from './pages/AdminDashboard';
import ViewAppointment from './pages/ViewAppointment';
import './pages/styles.css';
import Messaging from './pages/Messaging';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route path="/admindashboard/appointments" element={<ViewAppointment />} />
          {/*<Route path="appointments/:id" element={<ViewAppointment />} />
           <Route path="patients" element={<Patients />} />
          <Route path="prescriptions" element={<Prescriptions />} />*/}
          <Route path="/admindashboard/messages" element={<Messaging />} /> 
        </Route>
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="doctor" element={<DasboardHome />} />
          <Route path="appointments" element={<AppointmentPage />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="medical-records" element={<MedicalRecordsPage />} />
        </Route>      
        </Routes>
    </Router>
  );
}

export default App;
