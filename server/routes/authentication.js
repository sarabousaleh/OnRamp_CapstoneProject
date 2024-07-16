const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const authenticateAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

const authenticateTherapist = (req, res, next) => {
    if (!req.user || !req.user.is_therapist) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};


router.post('/signup', async (req, res) => {
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


router.post('/login', async (req, res) => {
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

        const token = jwt.sign(
            {
                user_id: user.rows[0].user_id,
                username: user.rows[0].username,
                is_admin: user.rows[0].is_admin,
                is_therapist: user.rows[0].is_therapist
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});


module.exports = router;