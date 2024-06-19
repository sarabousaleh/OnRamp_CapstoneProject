import React, { useState, useEffect } from "react";
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './TherapyPage.css'; // Import your CSS file for styling

const TherapyPage = () => {
    const [therapists, setTherapists] = useState([]);

    useEffect(() => {
        // Simulating fetching therapists' data from backend (replace with actual fetch)
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

    return (
        <div>
            <ArrowHeader title="Therapy Sessions" />
            <div className="therapist-container">
                {therapists.map(therapist => (
                    <div className="therapist-card" key={therapist.therapist_id}>
                        <img src={therapist.image_url} alt={therapist.name} />
                        <div className="therapist-info">
                            <h2><strong>{therapist.name}</strong></h2>
                            <p>Specialization: <strong>{therapist.specialization}</strong></p>
                            <p>Location: <strong>{therapist.location}</strong></p>
                            <p>Online Therapy: <strong>{therapist.virtual_available ? 'Available' : 'Not Available'}</strong></p>
                            <p>In-person Therapy: <strong>{therapist.in_person_available ? 'Available' : 'Not Available'}</strong></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TherapyPage;
