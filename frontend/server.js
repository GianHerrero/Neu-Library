const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-netlify-site.netlify.app" // replace with your actual Netlify URL
  ],
  credentials: true
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});

// API Routes
app.post('/api/visitor', async (req, res) => {
  try {
    console.log("Incoming visitor payload:", req.body);

    const { email, college, major, purpose } = req.body;
    if (!email || !college || !major || !purpose) {
      console.warn("Validation failed. Missing fields:", { email, college, major, purpose });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO visitors (email, college, major, purpose)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [email, college, major, purpose]
    );

    console.log("Visitor saved:", result.rows[0]);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving visitor:", err);
    return res.status(500).json({ message: "Error saving visitor", error: err.message });
  }
});

app.get('/api/admin/visitors', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM visitors ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching visitors:", err);
    res.status(500).json({ message: 'Error fetching visitors' });
  }
});

// Serve React frontend build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
