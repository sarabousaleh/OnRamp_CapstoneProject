import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LogInPage.css';
import { login } from '../../api';

function LoginForm({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/account" } }; // Default to account page

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.message === 'Login successful') {
        setIsLoggedIn(true);
        navigate(from); // Navigate to the intended page
      } else {
        console.error('Login failed:', response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
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

export default LoginForm;
