import React from 'react';
import './AdminNavbar.css';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    navigate('/'); // Redirect to login page
  };

 return (
  <nav className="navbar">
  <div className="logo">VMS</div>
  <ul className="navbar-links">
    <li><a href="/adminhome">Dashboard</a></li>
    <li><a href="/adminhome/visitorlogs">Visitor Logs</a></li>
    <li><a href="/adminhome/allresinfo">Resident Information</a></li>
    <li><a href="/adminhome/admininfo">Admin Info</a></li>
  </ul>
        <button onClick={handleSignout}>Sign Out</button>
    </nav>
  );
};

export default AdminNavbar;
