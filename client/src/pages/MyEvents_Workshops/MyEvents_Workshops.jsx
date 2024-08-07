import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import './MyEvents_Workshops.css';

function MyEvents_Workshops() {
  const [userWorkshops, setUserWorkshops] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserWorkshops = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user-workshops`, {
          withCredentials: true
        });
        setUserWorkshops(response.data);
      } catch (error) {
        console.error('Error fetching user workshops:', error);
      }
    };

    const fetchUserEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user-events`, {
          withCredentials: true
        });
        setUserEvents(response.data);
      } catch (error) {
        console.error('Error fetching user events:', error);
      }
    };

    fetchUserWorkshops();
    fetchUserEvents();
  }, []);

  const handleWithdrawWorkshop = async (workshopId) => {
    try {
      await axios.delete(`${backendUrl}/withdraw-workshop/${workshopId}`, {
        withCredentials: true
      });
      setUserWorkshops(
        userWorkshops.filter((workshop) => workshop.workshop_id !== workshopId)
      );
    } catch (error) {
      console.error('Error withdrawing from workshop:', error);
    }
  };

  const handleWithdrawEvent = async (eventId) => {
    try {
      await axios.delete(`${backendUrl}/withdraw-event/${eventId}`, {
        withCredentials: true
      });
      setUserEvents(userEvents.filter((event) => event.event_id !== eventId));
    } catch (error) {
      console.error('Error withdrawing from event:', error);
    }
  };

  return (
    <>
      <ArrowHeader title="My Workshops & Events" />
      <div className=".workshops-events-container">
        <div>
          <h2 className="h2-workshop-events">My Workshops</h2>
          {userWorkshops.length > 0 ? (
            userWorkshops.map((workshop, index) => (
              <div key={index} className="workshop">
                <h3>{workshop.title}</h3>
                <p>{workshop.description}</p>
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
                  onClick={() => handleWithdrawWorkshop(workshop.workshop_id)}
                >
                  Withdraw
                </button>
              </div>
            ))
          ) : (
            <p>No workshops enrolled.</p>
          )}
        </div>
        <div>
          <h2 className="h2-workshop-events">My Events</h2>
          {userEvents.length > 0 ? (
            userEvents.map((event, index) => (
              <div key={index} className="workshop">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Duration:</strong> {event.duration_minutes}
                </p>
                <p>
                  <strong>Cost:</strong> {event.cost}
                </p>
                <button onClick={() => handleWithdrawEvent(event.event_id)}>
                  Withdraw
                </button>
              </div>
            ))
          ) : (
            <p>No events enrolled.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyEvents_Workshops;
