import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResidentNavbar from './ResidentNavbar';
import './PreScheduledVisits.css'; 
const PreScheduledVisits = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null); // Track selected visit for displaying QR code

  useEffect(() => {
    const fetchVisits = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('No resident information available.');
        return;
      }

      try {
        const response = await axios.get(`/api/visits`, { params: { residentEmail: user.email } });
        setVisits(response.data.visits);
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    };

    fetchVisits();
  }, []);

  const handleViewQRCode = (visit) => {
    setSelectedVisit(visit);
  };

  const handleCloseModal = () => {
    setSelectedVisit(null);
  };

  return (
    <div>
      <ResidentNavbar />
      <div className="prescheduled-visits-container">
        <h1>Pre Scheduled Visits</h1>
        <table>
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Purpose</th>
              <th>Relation</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit, index) => (
              <tr key={index}>
                <td>{visit.visitorName}</td>
                <td>{visit.purpose}</td>
                <td>{visit.relation}</td>
                <td>{visit.date}</td>
                <td>{visit.time}</td>
                <td>
                  <button onClick={() => handleViewQRCode(visit)}>View QR Code</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal to display QR Code */}
        {selectedVisit && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>&times;</span>
              <h2>QR Code for {selectedVisit.visitorName}</h2>
              <img src={selectedVisit.qrCode} alt="QR Code" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreScheduledVisits;
