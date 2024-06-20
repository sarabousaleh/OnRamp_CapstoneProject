import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopMedical, faClinicMedical } from "@fortawesome/free-solid-svg-icons";
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './TherapyPage.css';

const TherapyPage = () => {
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/therapists');
                if (!response.ok) {
                    throw new Error('Failed to fetch therapists');
                }
                const therapistsData = await response.json();
                setTherapists(therapistsData);
            } catch (error) {
                console.error('Error fetching therapists:', error.message);
            }
        };
        fetchData();
    }, []);

    const handleBooking = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    therapist_id: selectedTherapist,
                    appointment_time: appointmentTime,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to book appointment');
            }
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error booking appointment:', error.message);
            setMessage('Failed to book appointment');
        }
    };

    return (
        <div>
            <ArrowHeader title="Therapy Sessions" />
            <div className="booking-container">
                <div className="booking-form-container">
                    <h2>Book an Appointment</h2>
                    <form onSubmit={handleBooking}>
                        <div className="form-group">
                            <label htmlFor="therapist">Select Therapist:</label>
                            <select
                                id="therapist"
                                value={selectedTherapist}
                                onChange={(e) => setSelectedTherapist(e.target.value)}
                                required
                            >
                                <option value="">--Select--</option>
                                {therapists.map(therapist => (
                                    <option key={therapist.therapist_id} value={therapist.therapist_id}>
                                        {therapist.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="appointment-time">Select Time:</label>
                            <input
                                type="datetime-local"
                                id="appointment-time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Book Appointment</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            <div className="therapist-container">
                {therapists.map(therapist => (
                    <div className="therapist-card" key={therapist.therapist_id}>
                        <img src={therapist.image_url} alt={therapist.name} />
                        <div className="therapist-info">
                            <h2><strong>{therapist.name}</strong></h2>
                            <p>Specialization: <strong>{therapist.specialization}</strong></p>
                            <p>Location: <strong>{therapist.location}</strong></p>
                            <p>
                                Online Therapy: <strong>{therapist.virtual_available ? 'Available' : 'Not Available'}</strong>
                                {therapist.virtual_available && (
                                    <FontAwesomeIcon icon={faLaptopMedical} className="icon" />
                                )}
                            </p>
                            <p>
                                In-person Therapy: <strong>{therapist.in_person_available ? 'Available' : 'Not Available'}</strong>
                                {therapist.in_person_available && (
                                    <FontAwesomeIcon icon={faClinicMedical} className="icon" />
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TherapyPage;
