require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const Subject = require('./models/Subject');
const connectDB = require('./config/db');

/* ✅ CONNECT DB */
connectDB();

/* ✅ CORS CONFIG (PRODUCTION SAFE) */
app.use(cors({
  origin: "https://study-lib-seven.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ✅ FIX PREFLIGHT REQUEST */
app.options(/.*/, cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;

/* ================= ROUTES ================= */

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});

/* ✅ AUTH ROUTES (THIS FIXES YOUR 404 LOGIN ERROR) */
app.use("/api/auth", require("./routes/auth.routes"));

/* SUBJECT ROUTES */
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const subject = new Subject({
      name: req.body.name
    });

    const saved = await subject.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* SERVER START */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;