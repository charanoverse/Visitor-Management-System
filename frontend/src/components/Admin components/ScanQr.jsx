import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const ScanQr = () => {
  const [data, setData] = useState('No result');
  const [error, setError] = useState('');

  const handleScan = (result) => {
    if (result) {
      setData(result.text); // Extracting the text from the result object
      setError(''); // Clear previous error
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
    </div>
  );
};

export default ScanQr;
