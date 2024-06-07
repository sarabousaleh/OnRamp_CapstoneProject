const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React app URL
    credentials: true // Allow credentials for cookies
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token, forbidden
        req.user = user; // Attach user info to request
        next();
    });
};

// Routes
app.post('/signup', async (req, res) => {
    try {
        const { username, password, firstname, lastname, dob, gender, email, nationality, telephoneNumber } = req.body;

        if (!username || !password || !firstname || !lastname || !dob || !gender || !email || !nationality || !telephoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash, firstname, lastname, dob, gender, email, nationality, telephone_numbers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [username, hashedPassword, firstname, lastname, dob, gender, email, nationality, telephoneNumber]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' }); // Set token in cookie
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT username, firstname, lastname, email, gender, nationality FROM users WHERE username = $1', [req.user.username]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Logout route
app.post('/logout', (req, res) => {
    console.log('Logout request received');
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    console.log('Cookie cleared');
    res.json({ message: 'Logout successful' });
});

// Notes routes
app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await pool.query(
            'INSERT INTO notes (username, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.username, title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE username = $1 ORDER BY created_at DESC', [req.user.username]);
        res.json(notes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notes WHERE id = $1 AND username = $2', [id, req.user.username]);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/workshops', async (req, res) => {
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

app.post('/register-workshop/:workshopId', authenticateToken, async (req, res) => {
    try {
        const { workshopId } = req.params;
        const { userId } = req.user;

        // Check if the user is already registered for the workshop
        const existingRegistration = await pool.query(
            'SELECT * FROM workshop_registrations WHERE workshop_id = $1 AND user_id = $2',
            [workshopId, userId]
        );

        if (existingRegistration.rows.length > 0) {
            return res.status(400).json({ message: 'User is already registered for this workshop' });
        }

        // Insert the registration record
        await pool.query(
            'INSERT INTO workshop_registrations (workshop_id, user_id) VALUES ($1, $2)',
            [workshopId, userId]
        );

        res.json({ message: 'User registered successfully for the workshop' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Fetch events route
app.get('/events', async (req, res) => {
    try {
        const events = await pool.query(`
            SELECT *
            FROM events
        `);
        res.json(events.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

