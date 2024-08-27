import React from 'react';
//import './Login.css'; // Make sure to create this CSS file

const Login = () => {
  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Your email</h2>
        <input type="email" placeholder="Enter your email" />
        
        <h2>Password</h2>
        <div className="password-container">
          <input type="password" placeholder="Enter your password" />
          <button className="show-password-btn">👁</button>
        </div>
        
        <a href="#" className="forgot-password">Forgot password?</a>
        
        <button className="login-btn">Login</button>
        
        <p>Don’t have an account?</p>
        <button className="register-btn">Register</button>
      </div>
    </div>
  );
};

export default Login;
