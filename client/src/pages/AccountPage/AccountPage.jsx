import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AccountPage.css';

function AccountPage() {
  const [userData, setUserData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    nationality: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        console.log('Logout successful');
        navigate('/LogInPage');
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <h1 className='h1-design'>Your Account</h1>
      <div className="icons-container">
        <Link to="/JournalPage">
          <i className="fa fa-book"></i>
          <span>My Journal</span>
        </Link>
      
        <Link to="/ToDoPage">
          <i className="fa fa-list"></i>
          <span>My To Do List</span>
        </Link>
        
        <span className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Log Out </span>
      </div>
      <div className="profile-flex-container">
        <div className="image-container">
          <img src="https://i.pinimg.com/564x/6f/57/76/6f57760966a796644b8cfb0fbc449843.jpg" alt="user" className="profile-image" />
        </div>
        <div className="info-container">
          <p>Username: {userData.username}</p>
          <p>First Name: {userData.firstname}</p>
          <p>Last Name: {userData.lastname}</p>
          <p>Email: {userData.email}</p>
          <p>Gender: {userData.gender}</p>
          <p>Nationality: {userData.nationality}</p>
        </div>
      </div>
      <div className='button-container'>
      </div>
    </>
  );
}

export default AccountPage;
