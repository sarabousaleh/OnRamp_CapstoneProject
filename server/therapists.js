const express = require('express');
const router = express.Router();
const pool = require('./db');
const { authenticateToken } = require('./handlers');

// Fetch all therapists with their availability
router.get('/therapists', async (req, res) => {
  try {
    const therapists = await pool.query(
      `SELECT therapist_id, name, specialization, location, virtual_available, in_person_available, created_at, image_url, about FROM therapists`
    );
    const availability = await pool.query(
      `SELECT availability_id, therapist_id, day_of_week, start_time, end_time, is_online, is_in_office, availability_date FROM therapist_availability`
    );
    const bookedSessions = await pool.query(
      `SELECT therapist_id, appointment_time FROM therapist_sessions`
    );

    const bookedTimes = bookedSessions.rows.map(session => ({
      therapist_id: session.therapist_id,
      appointment_time: session.appointment_time
    }));

    const therapistData = therapists.rows.map(therapist => {
      const therapistAvailability = availability.rows.filter(avail => {
        const availableTime = `${avail.availability_date} ${avail.start_time}-${avail.end_time}`;
        return !bookedTimes.some(
          session =>
            session.therapist_id === therapist.therapist_id &&
            session.appointment_time === availableTime
        );
      });

      return {
        ...therapist,
        availability: therapistAvailability
      };
    });

    res.json(therapistData);
  } catch (err) {
    console.error('Error fetching therapists:', err.message);
    res.status(500).json({ error: 'Server error while fetching therapists' });
  }
});

// Fetch availability of a specific therapist
router.get('/therapist-availability/:therapistId', async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    const result = await pool.query(
      `SELECT availability_date, start_time, end_time, day_of_week, is_online, is_in_office 
       FROM therapist_availability 
       WHERE therapist_id = $1`,
      [therapistId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No availability found for the selected therapist' });
    }

    const availability = result.rows.map(row => {
      const availabilityDate = new Date(row.availability_date);
      const startTime = row.start_time;
      const endTime = row.end_time;

      // Validate date and time values
      if (isNaN(availabilityDate.getTime())) {
        throw new Error('Invalid availability date');
      }
      if (!startTime || !endTime) {
        throw new Error('Invalid start or end time');
      }

      return {
        availability_date: row.availability_date,
        start_time: row.start_time,
        end_time: row.end_time,
        day_of_week: row.day_of_week,
        is_online: row.is_online,
        is_in_office: row.is_in_office
      };
    });

    res.json(availability);
  } catch (error) {
    console.error('Error fetching therapist availability:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Booking an appointment
router.post('/book-appointment', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { therapist_id, appointment_time, additional_info } = req.body;

    // Check if the time slot is already booked
    const existingAppointment = await pool.query(
      `SELECT session_id FROM therapist_sessions 
       WHERE therapist_id = $1 AND appointment_time = $2`,
      [therapist_id, appointment_time]
    );

    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    // If not, insert the new appointment
    const query = `
      INSERT INTO therapist_sessions (user_id, therapist_id, appointment_time, additional_info)
      VALUES ($1, $2, $3, $4)
      RETURNING session_id`;

    const values = [user_id, therapist_id, appointment_time, additional_info];
    const result = await pool.query(query, values);
    const session_id = result.rows[0].session_id;

    res.status(201).json({ message: 'Appointment booked successfully', session_id });
  } catch (error) {
    console.error('Error booking appointment:', error.message);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Fetching user sessions
router.get('/user-sessions', authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  try {
    const userSessions = await pool.query(
      `SELECT ts.session_id, ts.therapist_id, ts.appointment_time, ts.additional_info, ts.created_at, t.name as therapist_name, t.image_url 
       FROM therapist_sessions ts
       JOIN therapists t ON ts.therapist_id = t.therapist_id
       WHERE ts.user_id = $1`,
      [user_id]
    );

    res.json(userSessions.rows);
  } catch (err) {
    console.error('Error fetching user sessions:', err.message);
    res.status(500).json({ error: 'Server error while fetching user sessions' });
  }
});

// Unbooking (deleting) a user session
router.delete('/user-sessions/:sessionId', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const { user_id } = req.user;

  try {
    const result = await pool.query(
      'DELETE FROM therapist_sessions WHERE session_id = $1 AND user_id = $2 RETURNING *',
      [sessionId, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Session not found or not authorized' });
    }

    res.json({ message: 'Session unbooked successfully' });
  } catch (err) {
    console.error('Error unbooking session:', err.message);
    res.status(500).json({ error: 'Server error while unbooking session' });
  }
});

// Fetch booked therapists for the logged-in user
router.get('/user-booked-therapists', authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  try {
    const bookedTherapists = await pool.query(
      `SELECT therapist_id 
       FROM therapist_sessions 
       WHERE user_id = $1`,
      [user_id]
    );

    res.json(bookedTherapists.rows.map(row => row.therapist_id));
  } catch (err) {
    console.error('Error fetching booked therapists:', err.message);
    res.status(500).json({ error: 'Server error while fetching booked therapists' });
  }
});

module.exports = router;