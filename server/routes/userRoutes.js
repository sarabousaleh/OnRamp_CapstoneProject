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

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.user.user_id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    console.log('Logout request received');
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    console.log('Cookie cleared');
    res.json({ message: 'Logout successful' });
});

router.post('/update_user', authenticateToken, async (req, res) => {
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

router.get('/admin/users', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

router.get('/team-members', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT name, description, pic FROM team_members');
      const teamMembers = result.rows;
      client.release();
      res.json(teamMembers);
    } catch (err) {
      console.error('Error fetching team members:', err);
      res.status(500).json({ error: 'Error fetching team members' });
    }
  });

module.exports = router;
