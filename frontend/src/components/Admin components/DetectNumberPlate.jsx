import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './DetectNumberPlate.css';
import AdminNavbar from './AdminNavbar';

const DetectNumberPlate = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [numberPlateText, setNumberPlateText] = useState('');
    const [message, setMessage] = useState('');
    const [recognized, setRecognized] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenCamera = () => {
        setIsCameraOpen(true);
    };

    useEffect(() => {
        if (isCameraOpen && videoRef.current) {
            const constraints = {
                video: {
                    facingMode: "environment",
                    width: { ideal: 640 },  // Lower resolution
                    height: { ideal: 480 }  // Lower resolution
                },
                audio: false
            };

            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch(err => {
                    console.error('Error accessing the camera:', err);
                    setIsCameraOpen(false);
                    alert('Error accessing the camera: ' + err.message);
                });
        }
    }, [isCameraOpen]);

    useEffect(() => {
        if (isCameraOpen) {
            const timer = setTimeout(() => {
                handleCapture();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isCameraOpen]);

    const handleCapture = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setImageSrc(imageData);
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);

            fetch(imageData)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
                    setFile(file);
                    handleExtractNumberPlate(file);
                });
        }
    };

    const handleExtractNumberPlate = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:5000/api/extractNumberPlate', formData)
            .then(response => {
                setMessage(response.data.message);
                setNumberPlateText(response.data.numberPlateText);
                setRecognized(response.data.recognized);
            })
            .catch(error => {
                console.error('Error extracting number plate:', error);
                alert('Error extracting number plate. Please try again.');
            });
    };

    const handleAddNumberPlate = () => {
        if (!numberPlateText) {
            alert('No number plate text to add.');
            return;
        }

        axios.post('http://localhost:5000/api/addNumberPlate', { numberPlateText })
            .then(response => {
                setMessage(response.data.message);
                setRecognized(true);
            })
            .catch(error => {
                console.error('Error adding number plate:', error);
                alert('Error adding number plate. Please try again.');
            });
    };

    const handleCancel = () => {
        setImageSrc(null);
        setFile(null);
        setNumberPlateText('');
        setMessage('');
        setRecognized(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
            };
            reader.readAsDataURL(file);
            setFile(file);
            handleExtractNumberPlate(file);
        } else {
            alert('Please select a JPEG or JPG file.');
        }
    };

    return (
        <div>
            <AdminNavbar/>
        <div className="container">
            <input type="file" accept="image/jpeg, image/jpg" onChange={handleFileChange} />
            <button onClick={handleOpenCamera} className="camera-button">Open Camera</button>

            {isCameraOpen && (
                <div className="camera-container">
                    <video ref={videoRef} className="video-feed"></video>
                </div>
            )}

            {imageSrc && (
                <div className="image-container">
                    <img src={imageSrc} alt="Captured number plate" className="uploaded-image" />
                    <button onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            )}
            {message && (
                <div className="message">
                    <h2>{message}</h2>
                    {recognized === false && (
                        <button onClick={handleAddNumberPlate} className="add-button">Add Number Plate to Database</button>
                    )}
                </div>
            )}
            {numberPlateText && (
                <div className="number-plate-text">
                    <h2>Extracted Number Plate Text:</h2>
                    <p>{numberPlateText}</p>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
        </div>
        </div>
    );
};

export default DetectNumberPlate;
