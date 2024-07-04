import AdminNavbar from './AdminNavbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './AllResInfo.css';

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
    <div>
      <AdminNavbar/>
      <h1>All Residents Information</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => (
            <tr key={resident._id}>
              <td>{resident.name}</td>
              <td>{resident.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allresinfo;
