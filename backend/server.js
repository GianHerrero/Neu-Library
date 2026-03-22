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

// Save visitor record
app.post('/api/visitor', async (req, res) => {
  try {
    console.log("Visitor payload:", req.body); // Debug log
    const { email, college, major, purpose } = req.body;

    if (!email || !college || !major || !purpose) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const visitor = await Visitor.create({ email, college, major, purpose });
    res.json(visitor);
  } catch (err) {
    console.error("Error saving visitor:", err);
    res.status(500).json({ message: 'Error saving visitor' });
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
