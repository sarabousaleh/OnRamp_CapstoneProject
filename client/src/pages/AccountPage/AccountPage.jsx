import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user', { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData(); // Call fetchUserData when the component mounts
  }, []); 

  return (
    <>
      <div className="icons-container">
        <Link to="/JournalPage">
          <i className="fa fa-book"></i>
          <span>My Journal</span>
        </Link>
        <h1 className="h1-design">My Account</h1>
        <Link to="/ToDoPage">
          <i className="fa fa-list"></i>
          <span>My To Do List</span>
        </Link>
      </div>

      <div className="profile-flex-container">
        <div className="image-container">
          <img src="https://i.pinimg.com/564x/6f/57/76/6f57760966a796644b8cfb0fbc449843.jpg" alt="user" className="profile-image"/>  
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
    </>
  );
}

export default AccountPage;
