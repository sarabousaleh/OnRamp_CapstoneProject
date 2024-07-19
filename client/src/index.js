import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthProvider'; // Adjust the import path as needed
import './index.css';

// Get the root element from the HTML
const container = document.getElementById('root');

// Create a root using the container
const root = createRoot(container);

// Render the app using the root
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
