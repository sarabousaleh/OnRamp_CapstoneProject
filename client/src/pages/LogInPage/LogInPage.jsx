import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LogInPage.css';

function LogInPage({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/account" } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
      if (response.data.message === 'Login successful') {
        setIsLoggedIn(true);
        navigate(from);
      } else {
        alert('Login failed: ' + response.data.message); // Display alert message
        console.log('Login failed :', response.data.message); // Log to console for debugging
      }
    } catch (error) {
      alert('Login failed: ' + (error.response ? error.response.data.message : error.message)); // Display alert message
    }
  };

  return (
    <div className="background-container">
      <div className="login-container">
        <h1 className="h1-design">Log In</h1>
        <div className="login-content">
          <div className="login-right">
            <img src="https://i.pinimg.com/564x/93/c9/7f/93c97ffbe12fb8b73b1ff89214585631.jpg" alt="Login Visual" className="login-image" />
            <Link className="signin-link" to="/SignInPage">Don't have an account? Sign Up!</Link>
          </div>
          <div className="login-left">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="login-button" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
