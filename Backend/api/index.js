const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'rx782-super-secret-key-1979';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with that email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User's Gunplas (Dashboard)
app.get('/api/gunpla/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gunplas WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching user gunplas' });
  }
});

// Get All Gunplas (Global Feed)
app.get('/api/gunpla', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, u.username 
      FROM gunplas g 
      JOIN users u ON g.user_id = u.id 
      ORDER BY g.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching global gunplas' });
  }
});

// Create Gunpla
app.post('/api/gunpla', authenticateToken, async (req, res) => {
  try {
    const { model_name, grade, series, status, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO gunplas (user_id, model_name, grade, series, status, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, model_name, grade, series, status, image_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating gunpla' });
  }
});

// Update Gunpla
app.put('/api/gunpla/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { model_name, grade, series, status, image_url } = req.body;

    // Check ownership
    const gunplaResult = await pool.query('SELECT * FROM gunplas WHERE id = $1', [id]);
    if (gunplaResult.rows.length === 0) return res.status(404).json({ error: 'Gunpla not found' });
    if (gunplaResult.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const result = await pool.query(
      'UPDATE gunplas SET model_name = $1, grade = $2, series = $3, status = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [model_name, grade, series, status, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating gunpla' });
  }
});

// Delete Gunpla
app.delete('/api/gunpla/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const gunplaResult = await pool.query('SELECT * FROM gunplas WHERE id = $1', [id]);
    if (gunplaResult.rows.length === 0) return res.status(404).json({ error: 'Gunpla not found' });
    if (gunplaResult.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await pool.query('DELETE FROM gunplas WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting gunpla' });
  }
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;