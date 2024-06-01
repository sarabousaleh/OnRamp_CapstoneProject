const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
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

        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

});
