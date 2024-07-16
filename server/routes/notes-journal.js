const express = require('express');
const router = express.Router();
const pool = require('../db');

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
router.post('/notes', authenticateToken, async (req, res) => {
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

router.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE username = $1 ORDER BY created_at DESC', [req.user.username]);
        res.json(notes.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notes WHERE id = $1 AND username = $2', [id, req.user.username]);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Journal routes
router.post('/journal_entries', authenticateToken, async (req, res) => {
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

router.get('/journal_entries', authenticateToken, async (req, res) => {
    try {
        const journalEntries = await pool.query('SELECT * FROM journal_entries WHERE username = $1 ORDER BY created_at DESC', [req.user.username]);
        res.json(journalEntries.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.delete('/journal_entries/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM journal_entries WHERE id = $1 AND username = $2', [id, req.user.username]);
        res.json({ message: 'Journal entry deleted successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
