import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import axios from 'axios';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        if (response.data) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('User not logged in:', error);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route
          path="/account"
          element={
            isLoggedIn ? (
              <Layout>
                <AccountPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/BlogsPage"
          element={
            isLoggedIn ? (
              <Layout>
                <BlogsPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/EventsPage"
          element={
            isLoggedIn ? (
              <Layout>
                <EventsPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/LibraryPage"
          element={
            isLoggedIn ? (
              <Layout>
                <LibraryPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/AssessmentsPage"
          element={
            isLoggedIn ? (
              <Layout>
                <AssessmentsPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/TherapyPage"
          element={
            isLoggedIn ? (
              <Layout>
                <TherapyPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/ToDoPage"
          element={
            isLoggedIn ? (
              <Layout>
                <ToDoPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/JournalPage"
          element={
            isLoggedIn ? (
              <Layout>
                <JournalPage />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route
          path="/MyEvents_Workshops"
          element={
            isLoggedIn ? (
              <Layout>
                <MyEvents_Workshops />
              </Layout>
            ) : (
              <Navigate to="/LogInPage" />
            )
          }
        />
        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/LogInPage" element={<LogInPage setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;