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
    nationality: '',
    dob: '',
    telephone_numbers: '', 
    profileImage: '',
  });
  const [editedUserData, setEditedUserData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        setUserData(response.data);
        setEditedUserData(response.data);
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
    setEditedUserData({ ...userData });
  };

  const handleSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    let profileImagePath = editedUserData.profileImage;

    if (imageFile) {
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      try {
        const uploadResponse = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        profileImagePath = uploadResponse.data.filePath;
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/update_user',
        { ...editedUserData, password: passwordData.newPassword, profileImage: profileImagePath },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsEditing(false);
        setUserData({ ...editedUserData, profileImage: profileImagePath });
      } else {
        console.error('Error saving user data:', response.data);
      }
    } catch (error) {
      console.error('Error saving user data:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/LogInPage');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <>
      <h1 className="h1-design">Your Account</h1>
      <div className="icons-container">
        <Link to="/MyJournal">
          <i className="fa fa-book"></i>
          <span>My Journal</span>
        </Link>

        <Link to="/ToDoList">
          <i className="fa fa-list"></i>
          <span>My To Do List</span>
        </Link>

        <Link to="/MyEvents&Workshops">
          <i className="fas fa-calendar-alt"></i>
          <span>My Events & Workshops</span>
        </Link>

        <Link to="/MyTherapySessions">
          <i className="fa fa-heartbeat"></i>
          <span>Therapy Sessions</span>
        </Link>
        
        <span className="logout-icon" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Log Out
        </span>
      </div>

      <div className="profile-flex-container">
        <div className="image-container">
          <img
            src={userData.profileImage ? `http://localhost:5000/${userData.profileImage}` : "https://i.pinimg.com/564x/6f/57/76/6f57760966a796644b8cfb0fbc449843.jpg"}
            alt="user"
            className="profile-image"
          />
          {isEditing && (
            <input type="file" onChange={handleImageChange} className="input-edit" />
          )}
        </div>
        <div className="info-container">
          {isEditing ? (
            <>
              <div className="form-grid-container">
                {[
                  { label: 'Username', name: 'username', type: 'text' },
                  { label: 'First Name', name: 'firstname', type: 'text' },
                  { label: 'Last Name', name: 'lastname', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Gender', name: 'gender', type: 'text' },
                  { label: 'Nationality', name: 'nationality', type: 'text' },
                  { label: 'Date of Birth', name: 'dob', type: 'date' },
                  { label: 'Telephone Number', name: 'telephone_numbers', type: 'text' },
                ].map(({ label, name, type }) => (
                  <label key={name}>
                    {label}:
                    <input
                      type={type}
                      name={name}
                      value={editedUserData[name]}
                      onChange={handleChange}
                      className="input-edit"
                    />
                  </label>
                ))}
                <label>
                  New Password:
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-edit"
                  />
                </label>
                <label>
                  Confirm New Password:
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="input-edit"
                  />
                </label>
              </div>
              <div className='button-container-acc'>
                <button className="edit-save-button" onClick={handleSave}>Save</button>
              </div>
            </>
          ) : (
            <>
              <p>Username: <strong>{userData.username}</strong></p>
              <p>First Name: <strong>{userData.firstname}</strong></p>
              <p>Last Name: <strong>{userData.lastname}</strong></p>
              <p>Email: <strong>{userData.email}</strong></p>
              <p>Gender: <strong>{userData.gender}</strong></p>
              <p>Nationality: <strong>{userData.nationality}</strong></p>
              <p>Date of Birth: <strong>{new Date(userData.dob).toLocaleDateString()}</strong></p>
              <p>Telephone Number: <strong>{userData.telephone_numbers}</strong></p> {/* Displaying telephone number */}
              <div className='button-container-acc'>
                <button className="edit-save-button" onClick={handleEdit}>Edit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AccountPage;
