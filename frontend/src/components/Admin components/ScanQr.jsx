import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
// import AdminNavbar from './AdminNavbar';

const ScanQr = () => {
  const [data, setData] = useState('No result');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = async (result) => {
    if (result) {
      setData(result.text); // Extracting the text from the result object
      setError(''); // Clear previous error

      console.log('Scanned QR code data:', result.text); // Log scanned data

      try {
        // Parse the QR code data into individual fields
        const parts = result.text.split(',');
        const visitorName = parts[0].split(': ')[1];
        const purpose = parts[1].split(': ')[1];
        const relation = parts[2].split(': ')[1];
        const date = parts[3].split(': ')[1];
        const time = parts[4].split(': ')[1];
        const residentEmail = parts[5].split(': ')[1];
        const residentName = parts[6].split(': ')[1];

        // Get the current timestamp
        const scannedAt = new Date().toLocaleString();

        // Log parsed values
        console.log({ visitorName, purpose, relation, date, time, residentEmail, residentName, scannedAt });

        const response = await axios.post('http://localhost:5000/api/verifyVisitor', { 
          visitorName, 
          purpose, 
          relation, 
          date, 
          time, 
          residentEmail, 
          residentName,
          scannedAt
        });
        setMessage(response.data.message);
      } catch (err) {
        console.error("Verification Error: ", err);
        const errorMessage = err.response?.data || err.message;
        setError('Error verifying visitor: ' + errorMessage);
        setMessage('');
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error: ", err);
    setError('Error scanning QR code: ' + err.message);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    video: {
      facingMode: "environment", // Use the rear camera on mobile devices
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)', color: 'black' }}>
      {/* <AdminNavbar/> */}
      <h1>QR Code Scanner</h1>
      <QrScanner
        delay={300}
        style={previewStyle}
        constraints={videoConstraints}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{data}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ScanQr;
