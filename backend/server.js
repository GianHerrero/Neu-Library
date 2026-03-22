const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Visitor schema (full info)
const VisitorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  college: { type: String, required: true },
  major: { type: String, required: true },
  purpose: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', VisitorSchema);

// POST /api/visitor
app.post('/api/visitor', async (req, res) => {
  try {
    // Debug: log incoming payload
    console.log("Visitor payload received:", req.body);

    // Destructure fields
    const { email, college, major, purpose } = req.body;

    // Validate required fields
    if (!email || !college || !major || !purpose) {
      console.warn("Missing fields:", { email, college, major, purpose });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create and save visitor
    const visitor = new Visitor({
      email,
      college,
      major,
      purpose,
      date: new Date() // auto‑add timestamp
    });

    await visitor.save();

    console.log("Visitor saved successfully:", visitor);
    res.status(201).json(visitor);

  } catch (err) {
    console.error("Error saving visitor:", err);
    res.status(500).json({ message: "Error saving visitor", error: err.message });
  }
});

// Fetch all visitor logs
app.get('/api/admin/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ date: -1 });
    res.json(visitors);
  } catch (err) {
    console.error("Error fetching visitors:", err);
    res.status(500).json({ message: 'Error fetching visitors' });
  }
});

// Start server
app.listen(5000, () => console.log('Backend running on port 5000'));
