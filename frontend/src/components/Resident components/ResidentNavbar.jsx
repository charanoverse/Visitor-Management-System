import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResidentNavbar.css';

const ResidentNavbar = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('user'); 
    navigate('/');
  };
  return (
    <nav className="navbar">
      <div className="reslogo">VMS</div>
      <ul className="navbar-links">
        <li><a href="/residenthome">Dashboard</a></li>
        <li><a href="/residenthome/visitorlogs">Visitor Logs</a></li>
        <li><a href="/residenthome/personalinfo">Personal Info</a></li>
      </ul>
      <button onClick={handleSignout}>Sign Out</button>
    </nav>
  );
};
export default ResidentNavbar;
