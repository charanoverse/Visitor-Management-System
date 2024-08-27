import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ResidentNavbar from './ResidentNavbar.jsx';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    flatNumber: '',
    mobileNumber: '',
    vehicles: [''],
    familyMembers: [{ name: '' }],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email) {
      axios.get(`http://localhost:5000/api/user/${userData.email}`)
        .then(response => {
          setUser(response.data);
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            role: response.data.role || '',
            flatNumber: response.data.flatNumber || '',
            mobileNumber: response.data.mobileNumber || '',
            vehicles: response.data.vehicles || [''],
            familyMembers: response.data.familyMembers || [{ name: '' }],
          });
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVehicleChange = (index, value) => {
    const newVehicles = [...formData.vehicles];
    newVehicles[index] = value;
    setFormData({ ...formData, vehicles: newVehicles });
  };

  const handleFamilyMemberChange = (index, value) => {
    const newFamilyMembers = [...formData.familyMembers];
    newFamilyMembers[index].name = value;
    setFormData({ ...formData, familyMembers: newFamilyMembers });
  };

  const addVehicle = () => {
    setFormData({ ...formData, vehicles: [...formData.vehicles, ''] });
  };

  const addFamilyMember = () => {
    setFormData({ ...formData, familyMembers: [...formData.familyMembers, { name: '' }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/user/${formData.email}`, formData)
      .then(response => {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setEditing(false);
        setMessage(response.data.message); // Set the success message
      })
      .catch(error => {
        console.error('There was an error updating the user data!', error);
      });
  };

  if (!user) {
    return <p>No user information available.</p>;
  }

  return (
    <div>
      <ResidentNavbar />
    <div className="personalinfocontainer">
      <h1>Profile Information</h1>
      {message && <p className="message">{message}</p>} {/* Display the success message */}
      {!editing ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Flat Number:</strong> {user.flatNumber}</p>
          <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
          <p><strong>Vehicles:</strong> {user.vehicles?.join(', ')}</p>
          <p><strong>Family Members:</strong> {user.familyMembers?.map((member, index) => (
            <span key={index}>{member.name}{index < user.familyMembers.length - 1 ? ', ' : ''}</span>
          ))}</p>
          <button className="editbutton" onClick={() => setEditing(true)}>Update Profile</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label>Role:</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} />
          </div>
          <div>
            <label>Flat Number:</label>
            <input type="text" name="flatNumber" value={formData.flatNumber} onChange={handleChange} />
          </div>
          <div>
            <label>Mobile Number:</label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
          </div>
          <div className="vehicleinput">
            <label>Vehicles:</label>
            {formData.vehicles.map((vehicle, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => handleVehicleChange(index, e.target.value)}
                />
              </div>
            ))}
            <button className="addbutton" type="button" onClick={addVehicle}>Add Vehicle</button>
          </div>
          <div className="familymemberinput">
            <label>Family Members:</label>
            {formData.familyMembers.map((member, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleFamilyMemberChange(index, e.target.value)}
                />
              </div>
            ))}
            <button className="addbutton" type="button" onClick={addFamilyMember}>Add Family Member</button>
          </div>
          <button className="personalinfobutton" type="submit">Save</button>
        </form>
      )}
    </div>
    </div>
  );
}

export default PersonalInfo;
