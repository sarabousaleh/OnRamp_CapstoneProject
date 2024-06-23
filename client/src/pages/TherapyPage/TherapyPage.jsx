import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopMedical, faClinicMedical } from "@fortawesome/free-solid-svg-icons";
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './TherapyPage.css';

const TherapyPage = () => {
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [appointmentTime, setAppointmentTime] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [message, setMessage] = useState('');
    const [expandedTherapist, setExpandedTherapist] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTherapist, setModalTherapist] = useState(null);

    const navigate = useNavigate();

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

    const handleTherapistChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedTherapist(selectedId);

        try {
            const response = await fetch(`http://localhost:5000/therapist-availability/${selectedId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch therapist availability');
            }
            const availabilityData = await response.json();
            setAvailableTimes(availabilityData);
        } catch (error) {
            console.error('Error fetching therapist availability:', error.message);
            setAvailableTimes([]);
        }
    };

    const handleBooking = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    therapist_id: selectedTherapist,
                    appointment_time: appointmentTime,
                    additional_info: additionalInfo,
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

    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const toggleModal = (therapist) => {
        setModalTherapist(therapist);
        setShowModal(!showModal);
    };

    return (
        <div>
            <ArrowHeader title="Therapy Sessions" />
            
            <div className="booking-container">
                <div className="booking-form-container">
                    <h2>Book an Appointment</h2>
                    <p>
                        Before you book an appointment, please make sure to{' '}
                        <Link to="/assessments">make the assessment</Link>. Its result will be sent to the therapist to help you more effectively!
                    </p>
                    <form onSubmit={handleBooking}>
                        <div className="form-group">
                            <label htmlFor="therapist">Select Therapist:</label>
                            <select
                                className="select-design"
                                id="therapist"
                                value={selectedTherapist}
                                onChange={handleTherapistChange}
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
                            <label htmlFor="appointment-time">Select Available Time:</label>
                            <select
                                className="select-design"
                                id="appointment-time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                required
                            >
                                <option value="">--Select--</option>
                                {availableTimes.map((time, index) => (
                                    <option key={index} value={`${time.availability_date} ${time.start_time}-${time.end_time}`}>
                                        {`${time.day_of_week} ${formatDate(time.availability_date)} ${time.start_time} - ${time.end_time} (${time.is_online ? 'Online' : 'In-person'})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="additional-info">Additional Information:</label>
                            <textarea
                                id="additional-info"
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                placeholder="Enter any additional information here"
                            />
                        </div>
                        <button type="submit">Book Appointment</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            <div className="therapist-container">
                {therapists.map(therapist => (
                    <div 
                        className="therapist-card" 
                        key={therapist.therapist_id} 
                        onClick={() => toggleModal(therapist)}
                    >
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
            
            <div className="therapy-details">
                <hr />
                <h2>Types of Therapy You Might Need:</h2>
                <p>Therapy encompasses a variety of approaches tailored to address different psychological and emotional needs individuals may face throughout their lives. Some common types include:</p>
                <ul>
                    <li><strong>Cognitive-Behavioral Therapy (CBT):</strong> Helps individuals identify and change negative thought patterns and behaviors.</li>
                    <li><strong>Psychodynamic Therapy:</strong> Explores unconscious thoughts and emotions to understand current behaviors and relationships.</li>
                    <li><strong>Family Therapy:</strong> Addresses conflicts and improves communication within families.</li>
                    <li><strong>Art Therapy:</strong> Uses creative expression to explore emotions and promote healing.</li>
                    <li><strong>Group Therapy:</strong> Provides support and feedback from peers dealing with similar issues.</li>
                </ul>
                <hr />
                <h2>When and Why Therapy Is Beneficial?</h2>
                <p>Therapy is beneficial in various situations:</p>
                <ul>
                    <li><strong>Managing Stress:</strong> Helps individuals cope with stressors in their personal or professional lives.</li>
                    <li><strong>Grief and Trauma:</strong> Assists in processing loss or traumatic experiences, facilitating healing.</li>
                    <li><strong>Life Transitions:</strong> Supports individuals adjusting to major life changes such as career shifts, marriage, or retirement.</li>
                    <li><strong>Mental Health Disorders:</strong> Provides strategies to manage symptoms of depression, anxiety, OCD, and other disorders.</li>
                    <li><strong>Improving Relationships:</strong> Enhances communication skills and fosters healthier interpersonal connections.</li>
                </ul>
                <hr />
                <h2>Benefits of Therapy:</h2>
                <p>Therapy offers numerous benefits:</p>
                <ul>
                    <li>Promotes self-awareness and personal growth.</li>
                    <li>Empowers individuals to overcome obstacles and achieve goals.</li>
                    <li>Enhances resilience and coping skills.</li>
                    <li>Provides a safe space for emotional expression and validation.</li>
                    <li>Improves overall mental well-being and quality of life.</li>
                </ul>
                <hr />
            </div>
            
            {showModal && modalTherapist && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <img src={modalTherapist.image_url} alt={modalTherapist.name} />


                        <h2>{modalTherapist.name}</h2>
                        <p><strong>Specialization:</strong> {modalTherapist.specialization}</p>
                        <p><strong>Location:</strong> {modalTherapist.location}</p>
                        <p><strong>Online Therapy:</strong> {modalTherapist.virtual_available ? 'Available' : 'Not Available'}</p>
                        <p><strong>In-person Therapy:</strong> {modalTherapist.in_person_available ? 'Available' : 'Not Available'}</p>
                        <p><strong>About:</strong> {modalTherapist.about}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TherapyPage;