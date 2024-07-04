import React, { useEffect, useState } from 'react';
import ResidentNavbar from './ResidentNavbar.jsx';

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
      <ResidentNavbar/>
      <h1>Profile Information</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  )
}

export default PersonalInfo
