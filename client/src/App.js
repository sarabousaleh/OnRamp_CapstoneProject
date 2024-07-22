/* eslint-disable react/prop-types */
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage';
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
import { AuthProvider, useAuth } from './AuthProvider';

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/resources"
            element={
              <Layout>
                <ResourcesPage />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <ServicesPage />
              </Layout>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Layout>
                  <AccountPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <PrivateRoute>
                <Layout>
                  <BlogsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/workshops-events"
            element={
              <PrivateRoute>
                <Layout>
                  <EventsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Layout>
                  <LibraryPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <PrivateRoute>
                <Layout>
                  <AssessmentsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/therapy-sessions"
            element={
              <PrivateRoute>
                <Layout>
                  <TherapyPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <PrivateRoute>
                <Layout>
                  <ToDoPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <PrivateRoute>
                <Layout>
                  <JournalPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-events-and-workshops"
            element={
              <PrivateRoute>
                <Layout>
                  <MyEvents_Workshops />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-therapy-sessions"
            element={
              <PrivateRoute>
                <Layout>
                  <MyTherapySessions />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/login" element={<LogInPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
