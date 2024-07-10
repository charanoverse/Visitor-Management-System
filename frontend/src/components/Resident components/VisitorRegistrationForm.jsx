import axios from 'axios';
import React, { useState } from 'react';
//import './VisitorRegistrationForm.css';
//import ResidentNavbar from './ResidentNavbar';

const VisitorRegistrationForm = () => {
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      console.error('No resident information available.');
      return;
    }

    const visitDetails = {
      residentEmail: user.email,
      residentName: user.name,
      visitorName,
      purpose,
      relation,
      date,
      time,
    };

    console.log('Submitting:', visitDetails);

    axios.post('http://localhost:5000/api/visitor-registration', visitDetails)
      .then((response) => {
        console.log('Response:', response.data);
        setSuccessMessage('Visitor registered successfully!');
        setQrCode(response.data.qrCode);
        setErrorMessage('');
        setVisitorName('');
        setPurpose('');
        setRelation('');
        setDate('');
        setTime('');
      })
      .catch((error) => {
        console.error('There was an error scheduling the visit!', error);
        setErrorMessage('There was an error scheduling the visit. Please try again.');
      });
  };

  return (
    <div>
      {/* <ResidentNavbar/> */}
      <h1>Visitor Registration Form</h1>
      {successMessage && <p style={{ color: 'black' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name of Visitor:</label>
          <input
            type="text"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Purpose of Visit:</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Relation:</label>
          <input
            type="text"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Visit:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Time of Visit:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default VisitorRegistrationForm;
