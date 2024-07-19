const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./authentication'); // Ensure this is the correct path and function

// Workshops routes
router.get('/workshops', async (req, res) => {
    try {
        const workshops = await pool.query(`
            SELECT w.*, t.name AS therapist_name 
            FROM workshops w 
            JOIN therapists t ON w.therapist_id = t.therapist_id
            WHERE w.deleted_at IS NULL
        `);
        res.json(workshops.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.get('/user-workshops', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const userWorkshops = await pool.query(
            `SELECT w.*, uw.enrolled_at 
             FROM workshops w 
             JOIN user_workshops uw ON w.workshop_id = uw.workshop_id 
             WHERE uw.user_id = $1`,
            [user_id]
        );

        res.json(userWorkshops.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.post('/register-workshop/:workshopId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { workshopId } = req.params;

        const result = await pool.query(
            'INSERT INTO user_workshops (user_id, workshop_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *',
            [user_id, workshopId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.delete('/withdraw-workshop/:workshopId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { workshopId } = req.params;

        await pool.query(
            'DELETE FROM user_workshops WHERE user_id = $1 AND workshop_id = $2',
            [user_id, workshopId]
        );

        res.json({ message: 'Successfully withdrawn from the workshop' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Events routes
router.get('/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json(events.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.get('/user-events', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const userEvents = await pool.query(
            `SELECT e.*, ue.enrolled_at 
             FROM events e 
             JOIN user_events ue ON e.event_id = ue.event_id 
             WHERE ue.user_id = $1`,
            [user_id]
        );

        res.json(userEvents.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.post('/register-event/:eventId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { eventId } = req.params;

        const result = await pool.query(
            'INSERT INTO user_events (user_id, event_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *',
            [user_id, eventId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.delete('/withdraw-event/:eventId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { eventId } = req.params;

        await pool.query(
            'DELETE FROM user_events WHERE user_id = $1 AND event_id = $2',
            [user_id, eventId]
        );

        res.json({ message: 'Successfully withdrawn from the event' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
