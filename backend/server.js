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
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Start server only after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Visitor schema
const VisitorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  college: { type: String, required: true },
  major: { type: String, required: true },
  purpose: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', VisitorSchema);

// Routes
app.post('/api/visitor', async (req, res) => {
  try {
    console.log("Incoming visitor payload:", req.body);

    const { email, college, major, purpose } = req.body;
    if (!email || !college || !major || !purpose) {
      console.warn("Validation failed. Missing fields:", { email, college, major, purpose });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const visitor = new Visitor({ email, college, major, purpose });
    const savedVisitor = await visitor.save();

    console.log("Visitor saved:", savedVisitor);
    return res.status(201).json(savedVisitor);
  } catch (err) {
    console.error("Error saving visitor:", err);
    return res.status(500).json({ message: "Error saving visitor", error: err.message });
  }
});

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
startServer();
