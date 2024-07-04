import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import user_icon from './Assets/person.png';
import './Loginsignup.css';

const Loginsignup = () => {
  const [action, SetAction] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Resident');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        role,
      });
      alert(response.data.msg);
      navigate('/Home');
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      alert(`Login successful! Redirecting to Home Page `);
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get role
      setErrorMessage(""); // Clear error message on successful login
      if (decoded.user.role === 'Admin') {
        navigate('/adminhome'); // Redirect to admin home page
      } else {
        navigate('/residenthome'); // Redirect to resident home page
      }
    } catch (error) {
      setErrorMessage(error.response.data.msg); // Set error message
      alert(error.response.data.msg); // Display alert with error message
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="user icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="email icon" />
          <input
            type="email"
            placeholder='Email Id'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="password icon" />
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {action === "Sign Up" && (
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="Admin"
                checked={role === "Admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                value="Resident"
                checked={role === "Resident"}
                onChange={(e) => setRole(e.target.value)}
              />
              Resident
            </label>
          </div>
        )}
      </div>
      {action === "Login" && (
        <div className="forgot-password">Forgot Password?<span>Click Here!</span></div>
      )}
      <div className="submit-container">
  <div className={action === "Login" ? "submit gray" : "submit"} onClick={action === "Login" ? handleLogin : handleSignup}>
    {action === "Login" ? "Login" : "Sign Up"}
  </div>
  <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => SetAction(action === "Sign Up" ? "Login" : "Sign Up")}>
    {action === "Sign Up" ? "Already have an account? Login" : " Don't have an account? Sign Up"}
  </div>
</div>
    </div>
  );
};

export default Loginsignup;
