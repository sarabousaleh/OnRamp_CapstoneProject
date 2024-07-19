// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ element: Component, role }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/LogInPage" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/LogInPage" />;
  }

  return <Component />;
};

export default PrivateRoute;
