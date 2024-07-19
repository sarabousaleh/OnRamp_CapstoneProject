import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../axiosConfig';
import { useAuth } from '../../AuthProvider'; // Adjust the path as needed
import './LogInPage.css';

function LogInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/account" } };
  const { setIsLoggedIn } = useAuth();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    try {
      const response = await axios.post(`${backendUrl}/login`, { username, password }, { withCredentials: true });
      console.log('Response:', response);

      if (response.data.message === 'Login successful') {
        setIsLoggedIn(true);

        // Redirect based on user role
        if (response.data.is_admin) {
          navigate('/admin/dashboard');
        } else if (response.data.is_therapist) {
          navigate('/therapist/dashboard');
        } else {
          navigate(from);
        }
      } else {
        alert('Login failed: ' + response.data.message); // Display alert message
        console.log('Login failed :', response.data.message); // Log to console for debugging
      }
    } catch (error) {
      alert('Login failed: ' + (error.response ? error.response.data.message : error.message)); // Display alert message
      console.error('Error during login:', error);
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
