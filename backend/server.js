const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://neu-library-05f4.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());


const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const VisitorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },   
  college: { type: String },               
  major: { type: String },                 
  purpose: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const Visitor = mongoose.model("Visitor", VisitorSchema);

app.post("/api/visitor", async (req, res) => {
  try {
    const { email, role, college, major, purpose } = req.body;

    if (!email || !role || !purpose) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (role === "student" && (!college || !major)) {
      return res.status(400).json({ message: "College and major required for students" });
    }

    const visitor = await Visitor.create({
      email,
      role,
      college: college || null,
      major: major || null,
      purpose,
    });

    res.status(201).json({ message: "Access Granted", visitor });
  } catch (err) {
    res.status(500).json({ message: "Error saving visitor" });
  }
});

app.get("/api/admin/visitors", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ date: -1 });
    res.json(visitors);
  } catch (err) {
    console.error("Error fetching visitors:", err);
    res.status(500).json({ message: "Error fetching visitors" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
