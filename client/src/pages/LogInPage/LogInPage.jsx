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
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
        navigate('/LogInPage');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};


  return (
    <div className="login-container">
      <h1 className="h1-design">Log In</h1>
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
        <Link className="signin-link" to="/SignInPage">Don't have an account? Sign Up!</Link>
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LogInPage;