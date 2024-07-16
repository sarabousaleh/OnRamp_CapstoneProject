// src/therapist/TherapistDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const TherapistDashboard = () => {
    return (
        <div>
            <h1>Therapist Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/therapist/sessions">Manage Sessions</Link></li>
                    {/* Add more therapist links here */}
                </ul>
            </nav>
        </div>
    );
};

export default TherapistDashboard;
