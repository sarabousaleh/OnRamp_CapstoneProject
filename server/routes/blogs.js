const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("./authentication");

router.get("/posts", async (req, res) => {
  try {
    const query = `
            SELECT posts.*, therapists.name AS therapist_name
            FROM posts
            JOIN therapists ON posts.therapist_id = therapists.therapist_id
        `;
    const posts = await pool.query(query);
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
            SELECT * 
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

router.get("/posts", async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC",
    );
    res.json(posts.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.post("/posts/:id/comment", authenticateToken, async (req, res) => {
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

router.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await pool.query(
      `SELECT c.*, u.username FROM comments c
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

router.delete(
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

router.post("/posts/:id/like", authenticateToken, async (req, res) => {
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

router.get("/posts/:id/likes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await pool.query("SELECT * FROM likes WHERE post_id = $1", [
      id,
    ]);
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
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id],
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

router.get("/posts/:id/dislikes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const dislikes = await pool.query(
      "SELECT * FROM dislikes WHERE post_id = $1",
      [id],
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
      "SELECT * FROM dislikes WHERE post_id = $1 AND user_id = $2",
      [id, req.user.user_id],
    );
    res.json({ disliked: dislike.rows.length > 0 });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
