const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler'); // Example error handling middleware
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const jwt = require('jsonwebtoken');

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });


// Import route files
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/userRoutes');
const noteJournalRoutes = require('./routes/notes-journal');
const workEventsshopRoutes = require('./routes/workshops-events');
const blogsRoutes = require('./routes/blogs');
const therapistRoutes = require('./routes/therapists');
const assessmentsRoutes = require('./routes/assessments');

// Use route files
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/notes', noteJournalRoutes);
app.use('/workshops', workEventsshopRoutes);
app.use('/posts', blogsRoutes);
app.use('/therapists', therapistRoutes);
app.use('/assessments', assessmentsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
