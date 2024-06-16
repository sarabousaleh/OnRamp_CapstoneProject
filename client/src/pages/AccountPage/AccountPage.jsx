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
  const [editedUserData, setEditedUserData] = useState({ ...userData }); // State to store edited user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        setUserData(response.data);
        setEditedUserData(response.data); // Initialize edited user data with fetched user data
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUserData({ ...userData }); // Reset edited user data to current user data
  };

  const handleSave = async () => {
    try {
        // Make a request to update user data
        const response = await axios.post('http://localhost:5000/update_user', editedUserData, { withCredentials: true });
        if (response.status === 200) {
            setIsEditing(false); // Disable edit mode after saving
            setUserData({ ...editedUserData }); // Update original user data with edited user data
        } else {
            console.error('Error saving user data:', response.data);
        }
    } catch (error) {
        console.error('Error saving user data:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., token expired)
            alert('Session expired. Please log in again.');
            navigate('/LogInPage');
        }
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <>
      <h1 className="h1-design">Your Account</h1>
      <div className="icons-container">
        <Link to="/JournalPage">
          <i className="fa fa-book"></i>
          <span>My Journal</span>
        </Link>

        <Link to="/ToDoPage">
          <i className="fa fa-list"></i>
          <span>My To Do List</span>
        </Link>

        <Link to="/MyEvents_Workshops">
          <i className="fas fa-calendar-alt"></i>
          <span>My Events & Workshops</span>
        </Link>

        <span className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Log Out{' '}
        </span>
      </div>

      <div className="profile-flex-container">
        <div className="image-container">
          <img
            src="https://i.pinimg.com/564x/6f/57/76/6f57760966a796644b8cfb0fbc449843.jpg"
            alt="user"
            className="profile-image"
          />
        </div>
        <div className="info-container">
          {isEditing ? (
            <>
              <input
                type="text"
                name="username"
                value={editedUserData.username}
                onChange={handleChange}
              />
              <input
                type="text"
                name="firstname"
                value={editedUserData.firstname}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastname"
                value={editedUserData.lastname}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                value={editedUserData.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="gender"
                value={editedUserData.gender}
                onChange={handleChange}
              />
              <input
                type="text"
                name="nationality"
                value={editedUserData.nationality}
                onChange={handleChange}
              />
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <p>Username: {userData.username}</p>
              <p>First Name: {userData.firstname}</p>
              <p>Last Name: {userData.lastname}</p>
              <p>Email: {userData.email}</p>
              <p>Gender: {userData.gender}</p>
              <p>Nationality: {userData.nationality}</p>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AccountPage;