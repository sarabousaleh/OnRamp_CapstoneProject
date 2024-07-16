import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from '../src/axiosConfig';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ResourcesPage from './pages/RescourcesPage/ResourcesPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import AccountPage from './pages/AccountPage/AccountPage';
import BlogsPage from './pages/BlogsPage/BlogsPage';
import EventsPage from './pages/EventsPage/EventsPage';
import LibraryPage from './pages/LibraryPage/LibraryPage';
import AssessmentsPage from './pages/AssessmentsPage/AssessmentsPage';
import TherapyPage from './pages/TherapyPage/TherapyPage';
import ToDoPage from './pages/ToDoPage/ToDoPage';
import JournalPage from './pages/JournalPage/JournalPage';
import SignInPage from './pages/SignInPage/SignInPage';
import LogInPage from './pages/LogInPage/LogInPage';
import MyEvents_Workshops from './pages/MyEvents_Workshops/MyEvents_Workshops';
import MyTherapySessions from './pages/MyTherapySessions/MyTherapySessions';
import TherapistDashboard from './therapist/TherapistDashboard';
import AdminDashboard from './admin/AdminDashboard';

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        console.log('Checking login status...');
        const response = await axios.get(`${backendUrl}/user`);
        console.log('Response from /user:', response.data);
        if (response.data) {
          setIsLoggedIn(true);
          setUserRole(response.data.role); 
        }
      } catch (error) {
        console.error('User not logged in:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, [backendUrl]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/account" element={isLoggedIn ? <Layout><AccountPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/blogs" element={isLoggedIn ? <Layout><BlogsPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/workshops&events" element={isLoggedIn ? <Layout><EventsPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/library" element={isLoggedIn ? <Layout><LibraryPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/assessments" element={isLoggedIn ? <Layout><AssessmentsPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/therapy-sessions" element={isLoggedIn ? <Layout><TherapyPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/ToDoList" element={isLoggedIn ? <Layout><ToDoPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/MyJournal" element={isLoggedIn ? <Layout><JournalPage /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/MyEvents&Workshops" element={isLoggedIn ? <Layout><MyEvents_Workshops /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/MyTherapySessions" element={isLoggedIn ? <Layout><MyTherapySessions /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/LogInPage" element={<LogInPage setIsLoggedIn={setIsLoggedIn} />} />

        {/* Therapist and Admin Routes */}
        <Route path="/therapist/dashboard" element={isLoggedIn && userRole === 'therapist' ? <Layout><TherapistDashboard /></Layout> : <Navigate to="/LogInPage" />} />
        <Route path="/admin/dashboard" element={isLoggedIn && userRole === 'admin' ? <Layout><AdminDashboard /></Layout> : <Navigate to="/LogInPage" />} />
      </Routes>
    </Router>
  );
}

export default App;
