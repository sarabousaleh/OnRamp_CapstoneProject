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
    console.log('Incoming ${req.method} request to ${req.url}');
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

app.post('/signup', async (req, res) => {
    const { username, password_hash, firstname, lastname, dob, gender, email, nationality, telephoneNumber } = req.body;

    if (!username || !password_hash || !firstname || !lastname || !dob || !gender || !email || !nationality || !telephoneNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        await pool.query('INSERT INTO users (username, password_hash, firstname, lastname, dob, gender, email, nationality, telephone_numbers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [username, hashedPassword, firstname, lastname, dob, gender, email, nationality, telephoneNumber]);
        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
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

        const token = jwt.sign({ user_id: user.rows[0].user_id, username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

app.get('/user-workshops', authenticateToken, async (req, res) => {
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


app.post('/register-workshop/:workshopId', authenticateToken, async (req, res) => {
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

        res.json(userEvents.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Backend

// Withdraw from workshop
app.delete('/withdraw-workshop/:workshopId', authenticateToken, async (req, res) => {
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

// Withdraw from event
app.delete('/withdraw-event/:eventId', authenticateToken, async (req, res) => {
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
// Update user information
app.post('/update_user', authenticateToken, async (req, res) => {
    try {
        const { username, firstname, lastname, email, gender, nationality } = req.body;
        const userId = req.user.user_id; // Get the authenticated user's ID

        const result = await pool.query(
            'UPDATE users SET username = $1, firstname = $2, lastname = $3, email = $4, gender = $5, nationality = $6 WHERE user_id = $7 RETURNING *',
            [username, firstname, lastname, email, gender, nationality, userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Get all journal entries for the authenticated user
app.get('/journal_entries', authenticateToken, async (req, res) => {
    try {
        const username = req.user.username;
        const result = await pool.query('SELECT * FROM journal_entries WHERE username = $1 ORDER BY date DESC', [username]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new journal entry for the authenticated user
app.post('/journal_entries', authenticateToken, async (req, res) => {
    try {
        const { date, content } = req.body;
        const { username } = req.user;
        const result = await pool.query(
            'INSERT INTO journal_entries (username, date, content) VALUES ($1, $2, $3) RETURNING *',
            [username, date, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Add this to the existing app file

// Delete a journal entry for the authenticated user
app.delete('/journal_entries/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.user.username;
        await pool.query('DELETE FROM journal_entries WHERE id = $1 AND username = $2', [id, username]);
        res.json({ message: 'Journal entry deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Update a journal entry for the authenticated user
app.put('/journal_entries/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const username = req.user.username;
        const result = await pool.query(
            'UPDATE journal_entries SET content = $1 WHERE id = $2 AND username = $3 RETURNING *',
            [content, id, username]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to fetch blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC'); // Adjust query based on your database schema
        res.json(blogs.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to handle liking a blog
app.post('/blogs/like/:blogId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { blogId } = req.params;

        // Example: Update the likes count in the database
        await pool.query('UPDATE blogs SET likes = likes + 1 WHERE blog_id = $1', [blogId]);

        res.json({ message: 'Blog liked successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to handle commenting on a blog
app.post('/blogs/comment/:blogId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { blogId } = req.params;
        const { comment } = req.body;

        // Example: Insert comment into the database
        await pool.query('INSERT INTO comments (blog_id, user_id, comment) VALUES ($1, $2, $3)', [blogId, user_id, comment]);

        res.json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to handle sharing a blog (if required)
app.post('/blogs/share/:blogId', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { blogId } = req.params;

        // Implement logic to handle sharing a blog (e.g., update share count in database)

        res.json({ message: 'Blog shared successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});
// Route to fetch forums
app.get('/forums', async (req, res) => {
    try {
        const forums = await pool.query('SELECT * FROM forums ORDER BY created_at DESC');
        res.json(forums.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to fetch posts for a specific forum
app.get('/forums/:forumId/posts', async (req, res) => {
    try {
        const { forumId } = req.params;
        const posts = await pool.query('SELECT * FROM posts WHERE forum_id = $1 ORDER BY created_at DESC', [forumId]);
        res.json(posts.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to fetch comments for a specific post
app.get('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await pool.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC', [postId]);
        res.json(comments.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to fetch likes for a specific post
app.get('/posts/:postId/likes', async (req, res) => {
    try {
        const { postId } = req.params;
        const likes = await pool.query('SELECT * FROM likes WHERE post_id = $1', [postId]);
        res.json(likes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to handle liking a post
app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, user_id]);
        res.json({ message: 'Post liked successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Route to handle commenting on a post
app.post('/posts/:postId/comment', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.user;
        const { content } = req.body;
        await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)', [postId, user_id, content]);
        res.json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});