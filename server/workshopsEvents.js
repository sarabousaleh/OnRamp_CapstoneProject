const express = require('express');
const router = express.Router();
const pool = require('./db');
const { authenticateToken } = require('./handlers');

// Workshops routes

/**
 * Fetch all workshops.
 * @name get/workshops
 * @function
 * @memberof module:routers/workshops
 * @inner
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Array} List of workshops.
 */
router.get("/workshops", async (req, res) => {
  try {
    const workshops = await pool.query(`
      SELECT w.workshop_id, w.user_id, w.title, w.description, w.scheduled_at, w.duration_minutes, w.cost, w.created_at, w.img_url, w.therapist_id, w.activities, w.target_audience, w.location, t.name AS therapist_name 
      FROM workshops w 
      JOIN therapists t ON w.therapist_id = t.therapist_id
      WHERE w.deleted_at IS NULL
    `);
    res.json(workshops.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Fetch all workshops for the authenticated user.
 * @name get/user-workshops
 * @function
 * @memberof module:routers/workshops
 * @inner
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Array} List of workshops for the authenticated user.
 */
router.get("/user-workshops", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const userWorkshops = await pool.query(
      `SELECT w.workshop_id, w.user_id, w.title, w.description, w.scheduled_at, w.duration_minutes, w.cost, w.created_at, w.img_url, w.therapist_id, w.activities, w.target_audience, w.location, uw.enrolled_at 
       FROM workshops w 
       JOIN user_workshops uw ON w.workshop_id = uw.workshop_id 
       WHERE uw.user_id = $1`,
      [user_id]
    );
    res.json(userWorkshops.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Register the authenticated user for a workshop.
 * @name post/register-workshop/:workshopId
 * @function
 * @memberof module:routers/workshops
 * @inner
 * @param {string} workshopId - ID of the workshop to register for.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Object} The registration details of the user for the workshop.
 */
router.post("/register-workshop/:workshopId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { workshopId } = req.params;

    const result = await pool.query(
      "INSERT INTO user_workshops (user_id, workshop_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, workshopId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Withdraw the authenticated user from a workshop.
 * @name delete/withdraw-workshop/:workshopId
 * @function
 * @memberof module:routers/workshops
 * @inner
 * @param {string} workshopId - ID of the workshop to withdraw from.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Object} Success message.
 */
router.delete("/withdraw-workshop/:workshopId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { workshopId } = req.params;

    await pool.query(
      "DELETE FROM user_workshops WHERE user_id = $1 AND workshop_id = $2",
      [user_id, workshopId]
    );

    res.json({ message: "Successfully withdrawn from the workshop" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Events routes

/**
 * Fetch all events.
 * @name get/events
 * @function
 * @memberof module:routers/events
 * @inner
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Array} List of events.
 */
router.get("/events", async (req, res) => {
  try {
    const events = await pool.query(
      "SELECT event_id, user_id, title, description, scheduled_at, duration_minutes, cost, created_at, status, img_url, location FROM events"
    );
    res.json(events.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Fetch all events for the authenticated user.
 * @name get/user-events
 * @function
 * @memberof module:routers/events
 * @inner
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Array} List of events for the authenticated user.
 */
router.get("/user-events", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const userEvents = await pool.query(
      `SELECT e.event_id, e.user_id, e.title, e.description, e.scheduled_at, e.duration_minutes, e.cost, e.created_at, e.status, e.img_url, e.location, ue.enrolled_at 
       FROM events e 
       JOIN user_events ue ON e.event_id = ue.event_id 
       WHERE ue.user_id = $1`,
      [user_id]
    );

    res.json(userEvents.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Register the authenticated user for an event.
 * @name post/register-event/:eventId
 * @function
 * @memberof module:routers/events
 * @inner
 * @param {string} eventId - ID of the event to register for.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Object} The registration details of the user for the event.
 */
router.post("/register-event/:eventId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const eventId = parseInt(req.params.eventId, 10);

    if (!user_id || isNaN(eventId)) {
      return res.status(400).send("Invalid user ID or event ID");
    }

    const result = await pool.query(
      "INSERT INTO user_events (user_id, event_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, eventId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * Withdraw the authenticated user from an event.
 * @name delete/withdraw-event/:eventId
 * @function
 * @memberof module:routers/events
 * @inner
 * @param {string} eventId - ID of the event to withdraw from.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.user_id - ID of the authenticated user.
 * @returns {Object} Success message.
 */
router.delete("/withdraw-event/:eventId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { eventId } = req.params;

    await pool.query(
      "DELETE FROM user_events WHERE user_id = $1 AND event_id = $2",
      [user_id, eventId]
    );

    res.json({ message: "Successfully withdrawn from the event" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;