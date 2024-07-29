const express = require('express');
const router = express.Router();
const pool = require('./db');
const { authenticateToken } = require('./handlers');

// Journal routes
router.post("/journal_entries", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newJournalEntry = await pool.query(
      "INSERT INTO journal_entries (username, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [req.user.username, content]
    );
    res.json(newJournalEntry.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/journal_entries", authenticateToken, async (req, res) => {
  try {
    const journalEntries = await pool.query(
      "SELECT id, username, content, created_at FROM journal_entries WHERE username = $1 ORDER BY created_at DESC",
      [req.user.username]
    );
    res.json(journalEntries.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.delete("/journal_entries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM journal_entries WHERE id = $1 AND username = $2",
      [id, req.user.username]
    );
    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Posts routes
router.get("/posts", async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.created_at, p.updated_at, p.image_url, p.therapist_id, therapists.name AS therapist_name FROM posts p JOIN therapists ON p.therapist_id = therapists.therapist_id"
    );
    res.json(posts.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
});

router.get("/search-posts", async (req, res) => {
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

router.post("/posts/:id/comment", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, username } = req.user;
    const { content } = req.body;

    const newComment = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, user_id, content]
    );

    res.json(newComment.rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await pool.query(
      `SELECT c.comment_id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.user_id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at DESC`,
      [id]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
});

router.delete("/posts/:postId/comments/:commentId", authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    await pool.query(
      "DELETE FROM comments WHERE comment_id = $1 AND post_id = $2",
      [commentId, postId]
    );

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.post("/posts/:id/like", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (status) {
      await pool.query(
        "INSERT INTO likes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING",
        [id, req.user.user_id]
      );
      await pool.query(
        "DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id]
      );
    } else {
      await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id]
      );
    }
    res.json({ message: "Like updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/posts/:id/likes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await pool.query(
      "SELECT like_id, post_id, user_id, created_at, status FROM likes WHERE post_id = $1",
      [id]
    );
    res.json(likes.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/posts/:id/liked", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query(
      "SELECT like_id, post_id, user_id, created_at, status FROM likes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id]
    );
    res.json({ liked: like.rows.length > 0 });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.post("/posts/:id/dislike", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (status) {
      await pool.query(
        "INSERT INTO dislikes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING",
        [id, req.user.user_id]
      );
      await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id]
      );
    } else {
      await pool.query(
        "DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2",
        [id, req.user.user_id]
      );
    }
    res.json({ message: "Dislike updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/posts/:id/dislikes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const dislikes = await pool.query(
      "SELECT dislike_id, post_id, user_id, created_at FROM dislikes WHERE post_id = $1",
      [id]
    );
    res.json(dislikes.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/posts/:id/disliked", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const dislike = await pool.query(
      "SELECT dislike_id, post_id, user_id, created_at FROM dislikes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id]
    );
    res.json({ disliked: dislike.rows.length > 0 });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;