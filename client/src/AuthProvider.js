import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../src/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        console.log('Checking login status...');
        const response = await axios.get(`${backendUrl}/user`);
        console.log('Response from /user:', response.data);
        if (response.data) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('User not logged in:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, [backendUrl]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
