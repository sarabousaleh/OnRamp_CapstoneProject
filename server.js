// Import necessary modules
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
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await pool.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.user_id, title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.user_id]);
        res.json(notes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.user_id]);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password, firstname, lastname, dob, gender, email, nationality, telephoneNumber } = req.body;

        if (!username || !password || !firstname || !lastname || !dob || !gender || !email || !nationality || !telephoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

        const token = jwt.sign({ user_id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT username, firstname, lastname, email, gender, nationality FROM users WHERE user_id = $1', [req.user.user_id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.post('/logout', (req, res) => {
    console.log('Logout request received');
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    console.log('Cookie cleared');
    res.json({ message: 'Logout successful' });
});

app.post('/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await pool.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.user_id, title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.user_id]);
        res.json(notes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.user_id]);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

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
        const { user_id } = req.user;

        const existingRegistration = await pool.query(
            'SELECT * FROM user_workshops WHERE workshop_id = $1 AND user_id = $2',
            [workshopId, user_id]
        );

        if (existingRegistration.rows.length > 0) {
            return res.status(400).json({ message: 'User is already registered for this workshop' });
        }

        await pool.query(
            'INSERT INTO user_workshops (workshop_id, user_id, enrolled_at) VALUES ($1, $2, NOW())',
            [workshopId, user_id]
        );

        res.json({ message: 'User registered successfully for the workshop' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json(events.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.post('/register-event/:eventId', authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        const { user_id } = req.user;

        const existingRegistration = await pool.query(
            'SELECT * FROM user_events WHERE event_id = $1 AND user_id = $2',
            [eventId, user_id]
        );

        if (existingRegistration.rows.length > 0) {
            return res.status(400).json({ message: 'User is already registered for this event' });
        }

        await pool.query(
            'INSERT INTO user_events (event_id, user_id, enrolled_at) VALUES ($1, $2, NOW())',
            [eventId, user_id]
        );

        res.json({ message: 'User registered successfully for the event' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/user-events', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const userEvents = await pool.query(
            `SELECT e.*, ue.enrolled_at 
             FROM events e 
             JOIN user_events ue ON e.event_id = ue.event_id 
             WHERE ue.user_id = $1`,
            [user_id]
        );

        res

.json(userEvents.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/withdraw-workshop/:workshopId', authenticateToken, async (req, res) => {
    try {
        const { workshopId } = req.params;
        const { user_id } = req.user;

        const existingRegistration = await pool.query(
            'SELECT * FROM user_workshops WHERE workshop_id = $1 AND user_id = $2',
            [workshopId, user_id]
        );

        if (existingRegistration.rows.length === 0) {
            return res.status(404).json({ message: 'User is not enrolled in this workshop' });
        }

        await pool.query(
            'DELETE FROM user_workshops WHERE workshop_id = $1 AND user_id = $2',
            [workshopId, user_id]
        );

        res.json({ message: 'User withdrawn successfully from the workshop' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/withdraw-event/:eventId', authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        const { user_id } = req.user;

        const existingRegistration = await pool.query(
            'SELECT * FROM user_events WHERE event_id = $1 AND user_id = $2',
            [eventId, user_id]
        );

        if (existingRegistration.rows.length === 0) {
            return res.status(404).json({ message: 'User is not enrolled in this event' });
        }

        await pool.query(
            'DELETE FROM user_events WHERE event_id = $1 AND user_id = $2',
            [eventId, user_id]
        );

        res.json({ message: 'User withdrawn successfully from the event' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});