import React from 'react';
import './ResidentNavbar.css';
import { useNavigate } from 'react-router-dom';

const ResidentNavbar = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    navigate('/'); // Redirect to login page
  };
  return (
    <div className="navbar"> 
      <ul className="navbar-links">
        <li><a href="/residenthome">Dashboard</a></li>
        <li><a href="/residenthome/visitorlogs">Visitor Logs</a></li>
        <li><a href="/residenthome/personalinfo">Personal Info</a></li>
        <li><button onClick={handleSignout}>Sign Out</button></li>
      </ul>
    </div>
  );
};

export default ResidentNavbar;
