import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './MyTherapySessions.css';

function MyTherapySessions() {
    const [therapySessions, setTherapySessions] = useState([]);

    useEffect(() => {
        const fetchTherapySessions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/therapist-sessions/2', { withCredentials: true });
                setTherapySessions(response.data);
            } catch (error) {
                console.error('Error fetching therapy sessions:', error);
            }
        };

        fetchTherapySessions();
    }, []);

    const formatAppointmentTime = (appointmentTime) => {
        const dateTimeParts = appointmentTime.split(' ');
        if (dateTimeParts.length >= 2) {
            const datePart = dateTimeParts[0];
            const timePart = dateTimeParts[1].split('-')[0]; // Extracting only the time part

            return `${new Date(datePart).toLocaleDateString()} ${timePart}`;
        } else {
            return appointmentTime; // Handle edge case where appointment time format is unexpected
        }
    };

    return (
        <>
            <ArrowHeader title="My Therapy Sessions" />
            <div className="therapy-sessions-container">
                {therapySessions.length > 0 ? (
                    therapySessions.map(session => (
                        <div key={session.session_id} className="therapy-session">
                            <p><strong>Time:</strong> {formatAppointmentTime(session.appointment_time)}</p>
                            <p><strong>Therapist:</strong> {session.therapist_name}</p>
                            <p><strong>Additional Info:</strong> {session.additional_info}</p>
                            <p><strong>Created At:</strong> {new Date(session.created_at).toLocaleString()}</p>
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