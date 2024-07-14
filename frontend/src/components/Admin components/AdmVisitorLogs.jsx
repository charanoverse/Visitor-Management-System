import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import './AdmVisitorLogs.css';

const VisitorLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visitorLogs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching visitor logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <h1>Visitor Logs</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Visitor Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Purpose</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Relation</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Resident Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Resident Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check-In Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check-Out Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.visitorName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.purpose}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.relation}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.time}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.residentEmail}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.residentName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.checkInTime}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.checkOutTime || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorLogs;
