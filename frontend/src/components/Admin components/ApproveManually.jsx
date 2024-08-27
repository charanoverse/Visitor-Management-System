import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CaptureVisitorDetails = ({ onSubmit }) => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [purpose, setPurpose] = useState('');

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ photo, purpose });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="30%"
      />
      <button type="button" onClick={capturePhoto}>Capture Photo</button>
      {photo && <img src={photo} alt="Visitor" />}
      <textarea
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Enter purpose of visit"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CaptureVisitorDetails;
