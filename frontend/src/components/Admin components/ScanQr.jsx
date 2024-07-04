import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // Import QrReader from react-qr-reader

const ScanQr = () => {
  const [result, setResult] = useState('');
  const [openCamera, setOpenCamera] = useState(false); // State to toggle camera

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleCamera = () => {
    setOpenCamera(!openCamera);
  };

  return (
    <div>
      <button onClick={toggleCamera} style={{ marginBottom: '10px' }}>
        {openCamera ? 'Close Camera' : 'Open Camera'}
      </button>
      {openCamera && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )}
      <p>{result}</p>
    </div>
  );
};

export default ScanQr;
