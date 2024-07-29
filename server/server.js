const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  });
};

/**
 * @api {post} /signup Sign up a new user
 * @apiName SignUp
 * @apiGroup Users
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiParam {String} firstname User's first name.
 * @apiParam {String} lastname User's last name.
 * @apiParam {String} dob User's date of birth.
 * @apiParam {String} gender User's gender.
 * @apiParam {String} email User's email address.
 * @apiParam {String} nationality User's nationality.
 * @apiParam {String} telephoneNumber User's telephone number.
 * @apiParam {String} [profile_image_url] URL of the user's profile image.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User created successfully"
 *     }
 *
 * @apiError BadRequest The request is missing required fields.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "All fields are required"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.post("/signup", async (req, res) => {
  const {
    username,
    password,
    firstname,
    lastname,
    dob,
    gender,
    email,
    nationality,
    telephoneNumber,
    profile_image_url,
  } = req.body;

  if (
    !username ||
    !password ||
    !firstname ||
    !lastname ||
    !dob ||
    !gender ||
    !email ||
    !nationality ||
    !telephoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await pool.query(
      "SELECT user_id, username, firstname, lastname, dob, password_hash, gender, email, nationality, telephone_numbers, profile_image_url FROM users WHERE username = $1",
      [username],
    );
    if (user.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash, firstname, lastname, dob, gender, email, nationality, telephone_numbers, profile_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        username,
        hashedPassword,
        firstname,
        lastname,
        dob,
        gender,
        email,
        nationality,
        telephoneNumber,
        profile_image_url,
      ],
    );
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @api {post} /login Log in a user
 * @apiName LogIn
 * @apiGroup Users
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token for authentication.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Login successful"
 *     }
 *
 * @apiError Unauthorized Invalid username or password.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid username or password"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      "SELECT user_id, username, firstname, lastname, dob, password_hash, gender, email, nationality, telephone_numbers, profile_image_url FROM users WHERE username = $1",
      [username],
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash,
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.rows[0].user_id,
        username: user.rows[0].username,
        is_admin: user.rows[0].is_admin,
        is_therapist: user.rows[0].is_therapist,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 15 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {get} /user Get user profile
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object} user User profile information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "user_id": "1",
 *         "username": "john_doe",
 *         "firstname": "John",
 *         "lastname": "Doe",
 *         "dob": "1990-01-01",
 *         "gender": "Male",
 *         "email": "john.doe@example.com",
 *         "nationality": "American",
 *         "telephone_numbers": "123-456-7890",
 *         "profile_image_url": "http://example.com/image.jpg"
 *       }
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_id, username, firstname, lastname, dob, password_hash, gender, email, nationality, telephone_numbers, profile_image_url FROM users WHERE user_id = $1",
      [req.user.user_id],
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {post} /logout Log out a user
 * @apiName LogOut
 * @apiGroup Users
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Logout successful"
 *     }
 */

app.post("/logout", (req, res) => {
  console.log("Logout request received");
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  console.log("Cookie cleared");
  res.json({ message: "Logout successful" });
});

/**
 * @api {post} /notes Create a new note
 * @apiName CreateNote
 * @apiGroup Notes
 *
 * @apiParam {String} title Title of the note.
 * @apiParam {String} content Content of the note.
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object} note Created note object.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "note": {
 *         "id": "1",
 *         "username": "john_doe",
 *         "title": "Sample Note",
 *         "content": "This is a sample note."
 *       }
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

// Notes routes
app.post("/notes", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (username, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.username, title, content],
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {get} /notes Get all notes for a user
 * @apiName GetNotes
 * @apiGroup Notes
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object[]} notes List of notes for the user.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "1",
 *         "username": "john_doe",
 *         "title": "Sample Note",
 *         "content": "This is a sample note."
 *       }
 *     ]
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.get("/notes", authenticateToken, async (req, res) => {
  try {
    const notes = await pool.query(
      "SELECT id, username, title, content,created_at FROM notes WHERE username = $1 ORDER BY created_at DESC",
      [req.user.username],
    );
    res.json(notes.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {delete} /notes/:id Delete a note
 * @apiName DeleteNote
 * @apiGroup Notes
 *
 * @apiParam {String} id ID of the note to be deleted.
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Note deleted successfully"
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.delete("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = $1 AND username = $2", [
      id,
      req.user.username,
    ]);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {post} /update_user Update user profile
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {String} username New username.
 * @apiParam {String} firstname New first name.
 * @apiParam {String} lastname New last name.
 * @apiParam {String} email New email address.
 * @apiParam {String} gender New gender.
 * @apiParam {String} nationality New nationality.
 * @apiParam {String} [profile_image_url] New profile image URL.
 * @apiParam {String} dob New date of birth.
 * @apiParam {String} telephone_number New telephone number.
 * @apiParam {String} [password] New password.
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object} user Updated user profile information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "user_id": "1",
 *         "username": "john_doe",
 *         "firstname": "John",
 *         "lastname": "Doe",
 *         "dob": "1990-01-01",
 *         "gender": "Male",
 *         "email": "john.doe@example.com",
 *         "nationality": "American",
 *         "telephone_numbers": "123-456-7890",
 *         "profile_image_url": "http://example.com/image.jpg"
 *       }
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.post("/update_user", authenticateToken, async (req, res) => {
  try {
    const {
      username,
      firstname,
      lastname,
      email,
      gender,
      nationality,
      profile_image_url,
      dob,
      telephone_number,
      password,
    } = req.body;
    const userId = req.user.user_id;

    const updateUserQuery = `
            UPDATE users
            SET username = $1, firstname = $2, lastname = $3, email = $4, gender = $5, nationality = $6, profile_image_url = $7, dob = $8, telephone_numbers = $9
            WHERE user_id = $10
            RETURNING *;
        `;
    const updateUserParams = [
      username,
      firstname,
      lastname,
      email,
      gender,
      nationality,
      profile_image_url,
      dob,
      telephone_number,
      userId,
    ];

    const userResult = await pool.query(updateUserQuery, updateUserParams);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatePasswordQuery =
        "UPDATE users SET password_hash = $1 WHERE user_id = $2";
      await pool.query(updatePasswordQuery, [hashedPassword, userId]);
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {get} /workshops Get all workshops
 * @apiName GetWorkshops
 * @apiGroup Workshops
 *
 * @apiSuccess {Object[]} workshops List of all workshops.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "workshop_id": "1",
 *         "user_id": "1",
 *         "title": "Workshop Title",
 *         "description": "Workshop Description",
 *         "scheduled_at": "2024-08-01T10:00:00Z",
 *         "duration_minutes": 60,
 *         "cost": 50,
 *         "created_at": "2024-07-22T00:00:00Z",
 *         "img_url": "http://example.com/image.jpg",
 *         "therapist_id": "1",
 *         "activities": "Activity Details",
 *         "target_audience": "Target Audience",
 *         "location": "Workshop Location",
 *         "therapist_name": "Therapist Name"
 *       }
 *     ]
 *
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

// Workshops routes
app.get("/workshops", async (req, res) => {
  try {
    const workshops = await pool.query(`
            SELECT w.workshop_id, w.user_id, w.title, w.description, w.scheduled_at, w.duration_minutes, w.cost, w.created_at, w.img_url, w.therapist_id, w.activities, w.target_audience, w.location, t.name AS therapist_name 
            FROM workshops w 
            JOIN therapists t ON w.therapist_id = t.therapist_id
            WHERE w.deleted_at IS NULL
        `);
    res.json(workshops.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {get} /user-workshops Get user workshops
 * @apiName GetUserWorkshops
 * @apiGroup Workshops
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object[]} workshops List of workshops the user is enrolled in.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "workshop_id": "1",
 *         "user_id": "1",
 *         "title": "Workshop Title",
 *         "description": "Workshop Description",
 *         "scheduled_at": "2024-08-01T10:00:00Z",
 *         "duration_minutes": 60,
 *         "cost": 50,
 *         "created_at": "2024-07-22T00:00:00Z",
 *         "img_url": "http://example.com/image.jpg",
 *         "therapist_id": "1",
 *         "activities": "Activity Details",
 *         "target_audience": "Target Audience",
 *         "location": "Workshop Location",
 *         "enrolled_at": "2024-07-22T00:00:00Z"
 *       }
 *     ]
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.get("/user-workshops", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const userWorkshops = await pool.query(
      `SELECT w.workshop_id, w.user_id, w.title, w.description, w.scheduled_at, w.duration_minutes, w.cost, w.created_at, w.img_url, w.therapist_id, w.activities, w.target_audience, w.location, uw.enrolled_at 
             FROM workshops w 
             JOIN user_workshops uw ON w.workshop_id = uw.workshop_id 
             WHERE uw.user_id = $1`,
      [user_id],
    );

    res.json(userWorkshops.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

/**
 * @api {post} /register-workshop/:workshopId Register for a workshop
 * @apiName RegisterWorkshop
 * @apiGroup Workshops
 *
 * @apiParam {String} workshopId ID of the workshop to register for.
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {Object} registration Registration details.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "registration": {
 *         "user_id": "1",
 *         "workshop_id": "1",
 *         "enrolled_at": "2024-07-22T00:00:00Z"
 *       }
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.post(
  "/register-workshop/:workshopId",
  authenticateToken,
  async (req, res) => {
    try {
      const { user_id } = req.user;
      const { workshopId } = req.params;

      const result = await pool.query(
        "INSERT INTO user_workshops (user_id, workshop_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *",
        [user_id, workshopId],
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server error");
    }
  },
);

/**
 * @api {delete} /withdraw-workshop/:workshopId Withdraw from a workshop
 * @apiName WithdrawWorkshop
 * @apiGroup Workshops
 *
 * @apiParam {String} workshopId ID of the workshop to withdraw from.
 *
 * @apiHeader {String} Cookie JWT token for authentication.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Successfully withdrawn from the workshop"
 *     }
 *
 * @apiError Unauthorized User is not authenticated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Server error"
 *     }
 */

app.delete(
  "/withdraw-workshop/:workshopId",
  authenticateToken,
  async (req, res) => {
    try {
      const { user_id } = req.user;
      const { workshopId } = req.params;

      await pool.query(
        "DELETE FROM user_workshops WHERE user_id = $1 AND workshop_id = $2",
        [user_id, workshopId],
      );

      res.json({ message: "Successfully withdrawn from the workshop" });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server error");
    }
  },
);

// Events routes
app.get("/events", async (req, res) => {
  try {
    const events = await pool.query(
      "SELECT event_id, user_id, title, description, scheduled_at, duration_minutes, cost, created_at, status, img_url, location FROM events",
    );
    res.json(events.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/user-events", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const userEvents = await pool.query(
      `SELECT e.event_id, e.user_id, e.title, e.description, e.scheduled_at, e.duration_minutes, e.cost, e.created_at, e.status, e.img_url, e.location, ue.enrolled_at 
             FROM events e 


             JOIN user_events ue ON e.event_id = ue.event_id 
             WHERE ue.user_id = $1`,
      [user_id],
    );

    res.json(userEvents.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/register-event/:eventId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const eventId = parseInt(req.params.eventId, 10);

    if (!user_id || isNaN(eventId)) {
      return res.status(400).send("Invalid user ID or event ID");
    }

    const result = await pool.query(
      "INSERT INTO user_events (user_id, event_id, enrolled_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, eventId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.delete("/withdraw-event/:eventId", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { eventId } = req.params;

    await pool.query(
      "DELETE FROM user_events WHERE user_id = $1 AND event_id = $2",
      [user_id, eventId],
    );

    res.json({ message: "Successfully withdrawn from the event" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Journal routes
app.post("/journal_entries", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newJournalEntry = await pool.query(
      "INSERT INTO journal_entries (username, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [req.user.username, content],
    );
    res.json(newJournalEntry.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/journal_entries", authenticateToken, async (req, res) => {
  try {
    const journalEntries = await pool.query(
      "SELECT id, username, content, created_at FROM journal_entries WHERE username = $1 ORDER BY created_at DESC",
      [req.user.username],
    );
    res.json(journalEntries.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.delete("/journal_entries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM journal_entries WHERE id = $1 AND username = $2",
      [id, req.user.username],
    );
    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts", async (req, res) => {
  try {
    const query = `
            SELECT p.post_id, p.title, p.content, p.created_at, p.updated_at, p.image_url, p.therapist_id, therapists.name AS therapist_name
            FROM posts p
            JOIN therapists ON p.therapist_id = therapists.therapist_id
        `;
    const posts = await pool.query(query);
    res.json(posts.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
});

// Add a new endpoint for searching posts by title
app.get("/search-posts", async (req, res) => {
  const { title } = req.query;
  try {
    const searchQuery = `
            SELECT post_id, title, content, created_at, updated_at, image_url, therapist_id 
            FROM posts 
            WHERE LOWER(title) LIKE $1
        `;
    const searchTerm = `%${title.toLowerCase()}%`;
    const posts = await pool.query(searchQuery, [searchTerm]);
    res.json(posts.rows);
  } catch (err) {
    console.error("Error searching posts:", err.message);
    res.status(500).json({ error: "Server error while searching posts" });
  }
});

// Blog routes
app.get("/posts", async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT post_id, title, content, created_at, updated_at, image_url, therapist_id FROM posts ORDER BY created_at DESC",
    );
    res.json(posts.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/posts/:id/comment", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, username } = req.user;
    const { content } = req.body;

    // Insert comment into the database
    const newComment = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, user_id, content],
    );

    res.json(newComment.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await pool.query(
      `SELECT c.comment_id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at, u.username FROM comments c
             JOIN users u ON c.user_id = u.user_id
             WHERE c.post_id = $1
             ORDER BY c.created_at DESC`,
      [id],
    );
    res.json(comments.rows);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
});

// Add this route to handle DELETE requests for comments
app.delete(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      // Ensure the comment belongs to the authenticated user (if required)

      // Perform deletion in the database
      await pool.query(
        "DELETE FROM comments WHERE comment_id = $1 AND post_id = $2",
        [commentId, postId],
      );

      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server error");
    }
  },
);

app.post("/posts/:id/like", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (status) {
      await pool.query(
        "INSERT INTO likes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING",
        [id, req.user.user_id],
      );
      await pool.query(
        "DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id],
      );
    } else {
      await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id],
      );
    }
    res.json({ message: "Like updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts/:id/likes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await pool.query(
      "SELECT like_id, post_id, user_id, created_at, status FROM likes WHERE post_id = $1",
      [id],
    );
    res.json(likes.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts/:id/liked", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query(
      "SELECT like_id, post_id, user_id, created_at, status FROM likes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id],
    );
    res.json({ liked: like.rows.length > 0 });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/posts/:id/dislike", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (status) {
      await pool.query(
        "INSERT INTO dislikes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING",
        [id, req.user.user_id],
      );
      await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id],
      );
    } else {
      await pool.query(
        "DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id],
      );
    }
    res.json({ message: "Dislike updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts/:id/dislikes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const dislikes = await pool.query(
      "SELECT dislike_id, post_id, user_id, created_at FROM dislikes WHERE post_id = $1",
      [id],
    );
    res.json(dislikes.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/posts/:id/disliked", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const dislike = await pool.query(
      "SELECT dislike_id, post_id, user_id, created_at FROM dislikes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id],
    );
    res.json({ disliked: dislike.rows.length > 0 });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch all therapists with their availability
app.get("/therapists", async (req, res) => {
  try {
    const therapists = await pool.query(
      "SELECT therapist_id, name, specialization, location, virtual_available, in_person_available, created_at, image_url, about FROM therapists",
    );
    const availability = await pool.query(
      "SELECT availability_id, therapist_id, day_of_week, start_time, end_time, is_online, is_in_office, availability_date FROM therapist_availability",
    );
    const bookedSessions = await pool.query(
      "SELECT therapist_id, appointment_time FROM therapist_sessions",
    );

    const bookedTimes = bookedSessions.rows.map((session) => ({
      therapist_id: session.therapist_id,
      appointment_time: session.appointment_time,
    }));

    const therapistData = therapists.rows.map((therapist) => {
      const therapistAvailability = availability.rows.filter((avail) => {
        const availableTime = `${avail.availability_date} ${avail.start_time}-${avail.end_time}`;
        return !bookedTimes.some(
          (session) =>
            session.therapist_id === therapist.therapist_id &&
            session.appointment_time === availableTime,
        );
      });

      return {
        ...therapist,
        availability: therapistAvailability,
      };
    });

    res.json(therapistData);
  } catch (err) {
    console.error("Error fetching therapists:", err.message);
    res.status(500).json({ error: "Server error while fetching therapists" });
  }
});

app.get("/therapist-availability/:therapistId", async (req, res) => {
  const therapistId = req.params.therapistId;

  try {
    const result = await pool.query(
      `SELECT availability_date, start_time, end_time, day_of_week, is_online, is_in_office 
             FROM therapist_availability 
             WHERE therapist_id = $1`,
      [therapistId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No availability found for the selected therapist" });
    }

    const availability = result.rows.map((row) => {
      const availabilityDate = new Date(row.availability_date);
      const startTime = row.start_time;
      const endTime = row.end_time;

      // Validate date and time values
      if (isNaN(availabilityDate.getTime())) {
        throw new Error("Invalid availability date");
      }
      if (!startTime || !endTime) {
        throw new Error("Invalid start or end time");
      }

      return {
        availability_date: row.availability_date,
        start_time: row.start_time,
        end_time: row.end_time,
        day_of_week: row.day_of_week,
        is_online: row.is_online,
        is_in_office: row.is_in_office,
      };
    });

    res.json(availability);
  } catch (error) {
    console.error("Error fetching therapist availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Booking an appointment
app.post("/book-appointment", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { therapist_id, appointment_time, additional_info } = req.body;

    // Check if the time slot is already booked
    const existingAppointment = await pool.query(
      `SELECT session_id FROM therapist_sessions 
             WHERE therapist_id = $1 AND appointment_time = $2`,
      [therapist_id, appointment_time],
    );

    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // If not, insert the new appointment
    const query = `
            INSERT INTO therapist_sessions (user_id, therapist_id, appointment_time, additional_info)
            VALUES ($1, $2, $3, $4)
            RETURNING session_id`;

    const values = [user_id, therapist_id, appointment_time, additional_info];
    const result = await pool.query(query, values);
    const session_id = result.rows[0].session_id;

    res
      .status(201)
      .json({ message: "Appointment booked successfully", session_id });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Fetching user sessions
app.get("/user-sessions", authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  try {
    const userSessions = await pool.query(
      `SELECT ts.session_id, ts.therapist_id, ts.appointment_time, ts.additional_info, ts.created_at, t.name as therapist_name, t.image_url 
             FROM therapist_sessions ts
             JOIN therapists t ON ts.therapist_id = t.therapist_id
             WHERE ts.user_id = $1`,
      [user_id],
    );

    res.json(userSessions.rows);
  } catch (err) {
    console.error("Error fetching user sessions:", err.message);
    res
      .status(500)
      .json({ error: "Server error while fetching user sessions" });
  }
});

// Unbooking (deleting) a user session
app.delete("/user-sessions/:sessionId", authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const { user_id } = req.user;

  try {
    const result = await pool.query(
      "DELETE FROM therapist_sessions WHERE session_id = $1 AND user_id = $2 RETURNING *",
      [sessionId, user_id],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Session not found or not authorized" });
    }

    res.json({ message: "Session unbooked successfully" });
  } catch (err) {
    console.error("Error unbooking session:", err.message);
    res.status(500).json({ error: "Server error while unbooking session" });
  }
});

// Fetch booked therapists for the logged-in user
app.get("/user-booked-therapists", authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  try {
    const bookedTherapists = await pool.query(
      `SELECT therapist_id 
             FROM therapist_sessions 
             WHERE user_id = $1`,
      [user_id],
    );

    res.json(bookedTherapists.rows.map((row) => row.therapist_id));
  } catch (err) {
    console.error("Error fetching booked therapists:", err.message);
    res
      .status(500)
      .json({ error: "Server error while fetching booked therapists" });
  }
});

app.get("/assessments", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT assessment_id, name, description FROM Assessments",
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching assessments:", err.message);
    res.status(500).json({ error: "Server error while fetching assessments" });
  }
});

app.get("/assessments/:assessmentId", authenticateToken, async (req, res) => {
  const { assessmentId } = req.params;

  try {
    const questions = await pool.query(
      "SELECT question_id, assessment_id, question_text FROM questions WHERE assessment_id = $1",
      [assessmentId],
    );

    const questionIds = questions.rows.map((q) => q.question_id);
    if (questionIds.length === 0) {
      return res.json({ questions: [] });
    }

    const options = await pool.query(
      "SELECT option_id, question_id, option_text, score FROM options WHERE question_id = ANY($1::int[])",
      [questionIds],
    );

    const questionsWithOptions = questions.rows.map((question) => ({
      ...question,
      options: options.rows.filter(
        (option) => option.question_id === question.question_id,
      ),
    }));

    res.json({ questions: questionsWithOptions });
  } catch (err) {
    console.error("Error fetching questions and options:", err.message);
    res
      .status(500)
      .json({ error: "Server error while fetching questions and options" });
  }
});

app.post("/submit-assessment", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const { answers, assessment_id } = req.body; // answers should be an array of { question_id, option_id }

  if (!Array.isArray(answers) || !assessment_id) {
    return res.status(400).json({ error: "Invalid input format" });
  }

  try {
    // Insert the answers into the user_answers table
    const insertAnswersQuery = `
            INSERT INTO user_answers (user_id, question_id, option_id, assessment_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const insertAnswersPromises = answers.map((answer) => {
      const { question_id, option_id } = answer;
      return pool.query(insertAnswersQuery, [
        user_id,
        question_id,
        option_id,
        assessment_id,
      ]);
    });

    const answersResults = await Promise.all(insertAnswersPromises);

    // Calculate the total score
    const optionIds = answers.map((answer) => answer.option_id);
    const scoreQuery = `
            SELECT SUM(score) as total_score
            FROM options
            WHERE option_id = ANY($1::int[]);
        `;
    const scoreResult = await pool.query(scoreQuery, [optionIds]);
    const totalScore = scoreResult.rows[0].total_score;

    // Determine the user's mental health condition based on the total score
    let condition = "";
    if (totalScore < 5) {
      condition = "Low risk";
    } else if (totalScore < 10) {
      condition = "Moderate risk";
    } else if (totalScore < 15) {
      condition = "High risk";
    } else {
      condition = "Severe risk";
    }

    // Insert the assessment results into assessment_results table
    const insertResultQuery = `
            INSERT INTO assessment_results (user_id, assessment_id, total_score, mental_health_condition)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const result = await pool.query(insertResultQuery, [
      user_id,
      assessment_id,
      totalScore,
      condition,
    ]);

    res.json({
      message: "Answers submitted successfully",
      condition,
      answersResults,
      result: result.rows[0],
    });
  } catch (err) {
    console.error("Error submitting answers:", err.message);
    res.status(500).json({ error: "Server error while submitting answers" });
  }
});

// Endpoint to fetch team members
app.get("/team-members", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT name, description, pic FROM team_members",
    );
    const teamMembers = result.rows;
    client.release();
    res.json(teamMembers);
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.status(500).json({ error: "Error fetching team members" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
