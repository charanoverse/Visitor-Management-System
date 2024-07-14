import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResidentNavbar from './ResidentNavbar';
import './ResidentHome.css'; 

const ResidentHome = () => {
  const navigate = useNavigate();

  const handleScheduleVisit = () => {
    navigate('/scheduleVisit');
  };

  return (
    <div className="resident-home-container">
      <ResidentNavbar />
      <h1>Resident Home</h1>
      <button onClick={handleScheduleVisit}>Schedule a Visit</button>
      <button onClick={() => navigate('/prescheduledvisits')}>Pre Scheduled Visits</button>
    </div>
  );
};

export default ResidentHome;
