import React, { useEffect, useState } from 'react';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './EventsPage.css';
import axios from 'axios';

const EventsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${backendUrl}/workshops`);
        const data = await response.json();
        setWorkshops(data);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      }
    };

    fetchWorkshops();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backendUrl}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const registerForWorkshop = async (workshopId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/register-workshop/${workshopId}`,
        {},
        { withCredentials: true }
      );
      console.log(
        'User registered successfully for the workshop',
        response.data
      );
      alert('Congratulations! You have been registered for the workshop.');
    } catch (error) {
      console.error(
        'Error registering for workshop:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/register-event/${eventId}`,
        {},
        { withCredentials: true }
      );
      console.log('User registered successfully for the event', response.data);
      alert('Congratulations! You have been registered for the event.');
    } catch (error) {
      console.error(
        'Error registering for event:',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <ArrowHeader title="Workshops & Events" />
      <div className="workshops-container">
        <div className="workshopsPage-title">
          <h1>WORKSHOPS</h1>
        </div>
        <div className="workshop-details">
          {workshops.map((workshop, index) => (
            <div key={index} className="workshop">
              <div className="workshop-img">
                <img src={workshop.img_url} alt={workshop.title} />
              </div>
              <div className="workshop-info">
                <h2>{workshop.title}</h2>
                <p>{workshop.description}</p>
                <p>
                  <strong>Activities:</strong> {workshop.activities}
                </p>
                <p>
                  <strong>Target Audience:</strong> {workshop.target_audience}
                </p>
                <p>
                  <strong>Therapist:</strong> {workshop.therapist_name}
                </p>
                <p>
                  <strong>Scheduled Time:</strong> {workshop.scheduled_at}
                </p>
                <p>
                  <strong>Duration:</strong> {workshop.duration_minutes}
                </p>
                <p>
                  <strong>Cost:</strong> {workshop.cost}
                </p>
                <p>
                  <strong>Location:</strong> {workshop.location}
                </p>
                <button
                  className="participate-button"
                  onClick={() => registerForWorkshop(workshop.workshop_id)}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="events-container">
        <div className="eventsPage-title">
          <h1>EVENTS</h1>
        </div>
        <div className="events-details">
          {events.map((event, index) => (
            <div key={index} className="event">
              <div className="event-img">
                <img src={event.img_url} alt={event.title} />
              </div>
              <div className="event-info">
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p>
                  <strong>Date:</strong> {event.scheduled_at}
                </p>
                <p>
                  <strong>Duration:</strong> {event.duration_minutes}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Cost:</strong> {event.cost}
                </p>
                <button
                  className="participate-button"
                  onClick={() => registerForEvent(event.event_id)}
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
