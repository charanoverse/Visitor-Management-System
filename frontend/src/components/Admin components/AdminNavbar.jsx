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
    <div className="navbar"> 
      <ul className="navbar-links">
        <li><a href="/adminhome">Dashboard</a></li>
        <li><a href="/adminhome/visitorlogs">Visitor Logs</a></li>
        <li><a href="/adminhome/allresinfo">Resident Information</a></li>
        <li><a href="/adminhome/admininfo">Admin Info</a></li>
        <li><button onClick={handleSignout}>Sign Out</button></li>
      </ul>
    </div>
  );
};

export default AdminNavbar;
