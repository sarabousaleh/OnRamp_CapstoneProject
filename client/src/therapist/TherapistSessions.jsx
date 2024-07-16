// src/therapist/TherapistSessions.js
import React, { useEffect, useState } from 'react';

const TherapistSessions = () => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetch('/therapist/sessions', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setSessions(data))
        .catch(error => console.error('Error fetching sessions:', error));
    }, []);

    return (
        <div>
            <h1>Manage Sessions</h1>
            <ul>
                {sessions.map(session => (
                    <li key={session.session_id}>{session.appointment_time} - {session.additional_info}</li>
                ))}
            </ul>
        </div>
    );
};

export default TherapistSessions;
