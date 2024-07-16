import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import './RecognizeFace.css';

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      setInitializing(false);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      }).catch(err => console.error(err));
  };

  const handleVideoOnPlay = async () => {
    const video = videoRef.current;
    let canvas = document.getElementById('faceCanvas');

    if (!canvas) {
      canvas = faceapi.createCanvasFromMedia(video);
      canvas.id = 'faceCanvas';
      document.querySelector('.Face-video-container').append(canvas);
    }

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const id = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 1000);
    setIntervalId(id);
  };

  const handleStartRecognition = () => {
    startVideo();
    videoRef.current.addEventListener('loadeddata', handleVideoOnPlay);
    setRecognizing(true);
  };

  const handleStopRecognition = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    const canvas = document.getElementById('faceCanvas');
    if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      document.querySelector('.Face-video-container').removeChild(canvas);
    }
    setRecognizing(false);
  };

  const handleCaptureData = async () => {
    const video = videoRef.current;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = video.width;
    canvasElement.height = video.height;
    const ctx = canvasElement.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const dataURL = canvasElement.toDataURL('image/png');

    try {
      const response = await axios.post('http://localhost:5000/api/detect', { image: dataURL });
      console.log(response.data);
    } catch (error) {
      console.error('Error storing image:', error);
    }
  };

  const handleVerifyData = async () => {
    const video = videoRef.current;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = video.width;
    canvasElement.height = video.height;
    const ctx = canvasElement.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const dataURL = canvasElement.toDataURL('image/png');

    try {
      const response = await axios.post('http://localhost:5000/api/verify', { image: dataURL });
      alert(response.data.message);
    } catch (error) {
      console.error('Error verifying image:', error);
      alert('Verification error. Please try again.');
    }
  };

  return (
    <div className="Face-container">
      <h1>Face Recognition</h1>
      {initializing ? (
        <p>Loading models...</p>
      ) : (
        <div className="Face-button-container">
          {!recognizing ? (
            <button onClick={handleStartRecognition}>Start Face Recognition</button>
          ) : (
            <>
              <button onClick={handleStopRecognition}>Stop Face Recognition</button>
              <button onClick={handleCaptureData}>Capture Data</button>
              <button onClick={handleVerifyData}>Verify Face</button> {/* Add verify face button */}
            </>
          )}
          <div className="Face-video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              width="300"
              height="300"
              style={{ display: recognizing ? 'block' : 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
