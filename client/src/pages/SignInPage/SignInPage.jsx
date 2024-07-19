import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignInPage.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password_hash: '',
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    email: '',
    nationality: '',
    telephoneNumber: ''
  });
  const [error] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', formData);

    try {
      const response = await axios.post(`${backendUrl}/signup`, formData);
      if (response.status === 200) {
        setSuccessMessage('User registered successfully!');
        alert('User registered successfully!');
        navigate('/login');
      } else {
        alert('Signup failed: ' + response.data.message);
      }
    } catch (error) {
      alert(
        'Signup failed: ' +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signin-container">
      <h1 className="h1-design">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password_hash" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input type="text" name="firstname" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input type="text" name="lastname" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" name="dob" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select name="gender" onChange={handleChange}>
            <option value=""></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="nationality">Nationality:</label>
          <input type="text" name="nationality" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="telephoneNumber">Telephone Number:</label>
          <input type="tel" name="telephoneNumber" onChange={handleChange} />
        </div>
        <button className="signin-button" type="submit">
          Sign Up
        </button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <Link className="login-link" to="/login">
          Already have an account? Log In!
        </Link>
      </form>
    </div>
  );
};

export default SignupForm;
