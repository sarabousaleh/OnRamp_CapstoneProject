import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './MyTherapySessions.css';

function MyTherapySessions() {
    const [therapySessions, setTherapySessions] = useState([]);
    const [error, setError] = useState('');

    const fetchTherapySessions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user-sessions', { withCredentials: true });
            setTherapySessions(response.data);
        } catch (error) {
            console.error('Error fetching therapy sessions:', error);
            setError('Error fetching therapy sessions.');
        }
    };

    useEffect(() => {
        fetchTherapySessions();
    }, []);

    const formatAppointmentTime = (appointmentTime) => {
        const [datePart, timePart] = appointmentTime.split(' ');
        if (datePart && timePart) {
            const [startTime] = timePart.split('-'); // Extracting only the start time part
            return `${new Date(datePart).toLocaleDateString()} ${startTime}`;
        } else {
            return appointmentTime; // Handle edge case where appointment time format is unexpected
        }
    };

    const handleUnbookSession = async (sessionId) => {
        try {
            await axios.delete(`http://localhost:5000/user-sessions/${sessionId}`, { withCredentials: true });
            setTherapySessions(prevSessions => prevSessions.filter(session => session.session_id !== sessionId));
        } catch (error) {
            console.error('Error unbooking session:', error);
            setError('Error unbooking session.');
        }
    };

    return (
        <>
            <ArrowHeader title="My Therapy Sessions" />
            <div className="therapy-sessions-container">
                {error && <p className="error-message">{error}</p>}
                {therapySessions.length > 0 ? (
                    therapySessions.map(session => (
                        <div key={session.session_id} className="therapy-session">
                            <p><strong>Time:</strong> {formatAppointmentTime(session.appointment_time)}</p>
                            <p><strong>Therapist:</strong> {session.therapist_name}</p>
                            <p><strong>Additional Info:</strong> {session.additional_info}</p>
                            <p><strong>Created At:</strong> {new Date(session.created_at).toLocaleString()}</p>
                            <button type="submit" onClick={() => handleUnbookSession(session.session_id)}>Unbook</button>
                        </div>
                    ))
                ) : (
                    <p>No therapy sessions found.</p>
                )}
            </div>
        </>
    );
}

export default MyTherapySessions;
