import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResidentNavbar from './ResidentNavbar';

const ResidentHome = () => {
  const navigate = useNavigate();

  const handleScheduleVisit = () => {
    navigate('/scheduleVisit');
  };

  return (
    <div>
      <ResidentNavbar/>
      <h1>Resident Home</h1>
      <button onClick={handleScheduleVisit}>Schedule a Visit</button>
    </div>
  );
};

export default ResidentHome;
