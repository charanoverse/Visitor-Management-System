import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './AllResInfo.css';

const Allresinfo = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get('/api/admin/residents');
        setResidents(response.data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, []);

  return (
    <div className="unique-container">
      <AdminNavbar className="unique-navbar"/>
      <h1 className="unique-title">All Residents Information</h1>
      <table className="unique-table">
        <thead className="unique-thead">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Moblie</th>
            <th>Flat Number</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => (
            <tr key={resident._id} className="unique-row">
              <td data-label="Name" className="unique-cell">{resident.name}</td>
              <td data-label="Email" className="unique-cell">{resident.email}</td>
              <td data-label="Mobile" className="unique-cell">{resident.mobileNumber}</td>
              <td data-label="Flat Number" className="unique-cell">{resident.flatNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allresinfo;
