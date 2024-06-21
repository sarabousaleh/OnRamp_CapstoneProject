// server.js
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

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

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

// User routes
app.post('/signup', async (req, res) => {
    const { username, password_hash, firstname, lastname, dob, gender, email, nationality, telephoneNumber, profile_image_url } = req.body;

    if (!username || !password_hash || !firstname || !lastname || !dob || !gender || !email || !nationality || !telephoneNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        await pool.query(
            'INSERT INTO users (username, password_hash, firstname, lastname, dob, gender, email, nationality, telephone_numbers, profile_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [username, hashedPassword, firstname, lastname, dob, gender, email, nationality, telephoneNumber, profile_image_url]
        );
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
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.user.user_id]);
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

app.post('/update_user', authenticateToken, async (req, res) => {
    try {
        const { username, firstname, lastname, email, gender, nationality, profile_image_url, dob, telephone_number, password } = req.body;
        const userId = req.user.user_id;

        const updateUserQuery = `
            UPDATE users
            SET username = $1, firstname = $2, lastname = $3, email = $4, gender = $5, nationality = $6, profile_image_url = $7, dob = $8, telephone_numbers = $9
            WHERE user_id = $10
            RETURNING *;
        `;
        const updateUserParams = [username, firstname, lastname, email, gender, nationality, profile_image_url, dob, telephone_number, userId];

        const userResult = await pool.query(updateUserQuery, updateUserParams);

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatePasswordQuery = 'UPDATE users SET password_hash = $1 WHERE user_id = $2';
            await pool.query(updatePasswordQuery, [hashedPassword, userId]);
        }

        res.json(userResult.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});


// Workshops routes
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

// Events routes
app.get('/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json(events.rows);
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

// Journal routes
app.post('/journal_entries', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const newJournalEntry = await pool.query(
            'INSERT INTO journal_entries (username, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [req.user.username, content]
        );
        res.json(newJournalEntry.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});


app.get('/journal_entries', authenticateToken, async (req, res) => {
    try {
        const journalEntries = await pool.query('SELECT * FROM journal_entries WHERE username = $1 ORDER BY created_at DESC', [req.user.username]);
        res.json(journalEntries.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/journal_entries/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM journal_entries WHERE id = $1 AND username = $2', [id, req.user.username]);
        res.json({ message: 'Journal entry deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});


// app.get('/forums', async (req, res) => {
//     try {
//         const forums = await pool.query('SELECT * FROM forums');
//         res.json(forums.rows);
//     } catch (err) {
//         console.error('Error fetching forums:', err.message);
//         res.status(500).json({ error: 'Server error while fetching forums' });
//     }
// });

// app.get('/forums/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const forum = await pool.query('SELECT * FROM forums WHERE forum_id = $1', [id]);

//         if (forum.rows.length === 0) {
//             return res.status(404).json({ error: 'Forum not found' });
//         }

//         res.json(forum.rows[0]);
//     } catch (err) {
//         console.error('Error fetching forum:', err.message);
//         res.status(500).json({ error: 'Server error while fetching forum' });
//     }
// });

// app.get('/forums/:id/posts', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const posts = await pool.query('SELECT * FROM posts WHERE forum_id = $1', [id]);
//         res.json(posts.rows);
//     } catch (err) {
//         console.error('Error fetching posts:', err.message);
//         res.status(500).json({ error: 'Server error while fetching posts' });
//     }
// });
// Change the existing posts route to fetch all posts
// Modify the existing posts route to fetch all posts
app.get('/posts', async (req, res) => {
    try {
        const query = `
            SELECT posts.*, therapists.name AS therapist_name
            FROM posts
            JOIN therapists ON posts.therapist_id = therapists.therapist_id
        `;
        const posts = await pool.query(query);
        res.json(posts.rows);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Server error while fetching posts' });
    }
});



// Add a new endpoint for searching posts by title
app.get('/search-posts', async (req, res) => {
    const { title } = req.query;
    try {
        const searchQuery = `
            SELECT * 
            FROM posts 
            WHERE LOWER(title) LIKE $1
        `;
        const searchTerm = `%${title.toLowerCase()}%`;
        const posts = await pool.query(searchQuery, [searchTerm]);
        res.json(posts.rows);
    } catch (err) {
        console.error('Error searching posts:', err.message);
        res.status(500).json({ error: 'Server error while searching posts' });
    }
});

// Blog routes
app.get('/posts', async (req, res) => {
    try {
        const posts = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/posts/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await pool.query(
            `SELECT c.*, u.username FROM comments c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.post_id = $1
             ORDER BY c.created_at DESC`,
            [id]
        );
        res.json(comments.rows);
    } catch (err) {
        console.error('Error fetching comments:', err.message);
        res.status(500).json({ error: 'Server error while fetching comments' });
    }
});

// Add this route to handle DELETE requests for comments
app.delete('/posts/:postId/comments/:commentId', authenticateToken, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        // Ensure the comment belongs to the authenticated user (if required)

        // Perform deletion in the database
        await pool.query('DELETE FROM comments WHERE comment_id = $1 AND post_id = $2', [commentId, postId]);
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.post('/posts/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (status) {
            await pool.query(
                'INSERT INTO likes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
                [id, req.user.user_id]
            );
            await pool.query(
                'DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2',
                [id, req.user.user_id]
            );
        } else {
            await pool.query(
                'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
                [id, req.user.user_id]
            );
        }
        res.json({ message: 'Like updated successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});



app.post('/posts/:id/dislike', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (status) {
            await pool.query(
                'INSERT INTO dislikes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
                [id, req.user.user_id]
            );
            await pool.query(
                'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
                [id, req.user.user_id]
            );
        } else {
            await pool.query(
                'DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2',
                [id, req.user.user_id]
            );
        }
        res.json({ message: 'Dislike updated successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});



app.get('/posts/:id/dislikes', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const dislikes = await pool.query('SELECT * FROM dislikes WHERE post_id = $1', [id]);
        res.json(dislikes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

app.get('/posts/:id/disliked', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const dislike = await pool.query('SELECT * FROM dislikes WHERE post_id = $1 AND user_id = $2', [id, req.user.user_id]);
        res.json({ disliked: dislike.rows.length > 0 });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});



app.post('/posts/:id/comment', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, username } = req.user;
        const { content } = req.body;

        // Insert comment into the database
        const newComment = await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [id, user_id, content]
        );

        res.json(newComment.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Endpoint to fetch all therapists with their availability
app.get('/therapists', async (req, res) => {
    try {
        const therapists = await pool.query('SELECT * FROM therapists');
        const availability = await pool.query('SELECT * FROM therapist_availability');

        const therapistData = therapists.rows.map(therapist => {
            const therapistAvailability = availability.rows.filter(avail => avail.therapist_id === therapist.therapist_id);
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
// Endpoint to fetch availability for a specific therapist
app.get('/therapist-availability/:therapist_id', async (req, res) => {
    const { therapist_id } = req.params;
    try {
        const availability = await pool.query('SELECT * FROM therapist_availability WHERE therapist_id = $1', [therapist_id]);
        res.json(availability.rows);
    } catch (err) {
        console.error('Error fetching therapist availability:', err.message);
        res.status(500).json({ error: 'Server error while fetching therapist availability' });
    }
});

app.post('/book-appointment', async (req, res) => {
    const { therapist_id, appointment_time, additional_info } = req.body;

    try {
        // Validate input if necessary

        // Insert the appointment into therapist_sessions table
        const query = `
            INSERT INTO therapist_sessions (therapist_id, appointment_time, additional_info)
            VALUES ($1, $2, $3)
            RETURNING session_id`;
        
        const values = [therapist_id, appointment_time, additional_info];
        const result = await pool.query(query, values);
        
        const session_id = result.rows[0].session_id;
        
        res.status(201).json({ message: 'Appointment booked successfully', session_id });
    } catch (error) {
        console.error('Error booking appointment:', error.message);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});