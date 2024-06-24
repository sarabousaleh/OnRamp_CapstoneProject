import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopMedical, faClinicMedical } from "@fortawesome/free-solid-svg-icons";
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './TherapyPage.css';

const TherapyPage = () => {
    const [therapists, setTherapists] = useState([]);
    const [bookedTherapists, setBookedTherapists] = useState([]);
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

    useEffect(() => {
        const fetchBookedTherapists = async () => {
            try {
                const response = await fetch('http://localhost:5000/user-booked-therapists', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch booked therapists');
                }
                const bookedTherapistsData = await response.json();
                setBookedTherapists(bookedTherapistsData);
            } catch (error) {
                console.error('Error fetching booked therapists:', error.message);
            }
        };
        fetchBookedTherapists();
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

    const handleBooking = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',  // Ensure cookies are sent
                body: JSON.stringify({
                    therapist_id: selectedTherapist,
                    appointment_time: appointmentTime,
                    additional_info: additionalInfo
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Appointment booked successfully');
                setSelectedTherapist('');
                setAppointmentTime('');
                setAdditionalInfo('');
                setAvailableTimes([]);
                // Fetch booked therapists again to update the list
                fetchBookedTherapists();
            } else {
                throw new Error('Failed to book appointment');
            }
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

    const fetchBookedTherapists = async () => {
        try {
            const response = await fetch('http://localhost:5000/user-booked-therapists', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Failed to fetch booked therapists');
            }
            const bookedTherapistsData = await response.json();
            setBookedTherapists(bookedTherapistsData);
        } catch (error) {
            console.error('Error fetching booked therapists:', error.message);
        }
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
                                {therapists
                                    .filter(therapist => !bookedTherapists.includes(therapist.therapist_id))
                                    .map(therapist => (
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
            
            
            
            {showModal && modalTherapist && (
                <div className="modal-overlay" onClick={() => toggleModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => toggleModal(null)}>&times;</span>
                        <h2>{modalTherapist.name}</h2>
                        <img src={modalTherapist.image_url} alt={modalTherapist.name} className="modal-image" />
                        <p><strong>Specialization:</strong> {modalTherapist.specialization}</p>
                        <p><strong>Location:</strong> {modalTherapist.location}</p>
                        <p><strong>About:</strong> {modalTherapist.bio}</p>
                        <p><strong>Online Therapy:</strong> {modalTherapist.virtual_available ? 'Available' : 'Not Available'}</p>
                        <p><strong>In-person Therapy:</strong> {modalTherapist.in_person_available ? 'Available' : 'Not Available'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TherapyPage;
