import AdminNavbar from './AdminNavbar'
import React, { useEffect, useState } from 'react';
import './AdminInfo.css';

const PersonalInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Retrieve user data from local storage
    setUser(userData);
  }, []);

  if (!user) {
    return <p>No user information available.</p>;
  }

  return (
    <div>
      <AdminNavbar />
    <div className="personalinfocontainer">
      <h1 className="personalinfoheader">Profile Information</h1>
      <div className="personalinfodetails">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
    </div>
  )
}

export default PersonalInfo;
