const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const {
  authenticateToken,
  signupHandler,
  loginHandler,
  getUserHandler,
  logoutHandler,
  createNoteHandler,
  getNotesHandler,
  deleteNoteHandler,
  updateUserHandler
} = require('./handlers');

const workshopsEventsRouter = require('./workshopsEvents');
const journalPostsRouter = require('./journalPosts');   
const therapistsRouter = require('./therapists');         
const assessmentsRouter = require('./assessments');    

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Routes
app.post('/signup', signupHandler);
app.post('/login', loginHandler);
app.get('/user', authenticateToken, getUserHandler);
app.post('/logout', logoutHandler);
app.post('/notes', authenticateToken, createNoteHandler);
app.get('/notes', authenticateToken, getNotesHandler);
app.delete('/notes/:id', authenticateToken, deleteNoteHandler);
app.post('/update_user', authenticateToken, updateUserHandler);

app.use('/', workshopsEventsRouter);
app.use('/', journalPostsRouter);
app.use('/', therapistsRouter); 
app.use('/', assessmentsRouter); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
