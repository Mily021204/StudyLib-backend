require('dotenv').config();

const express = require('express');
const app = express();
const Subject = require('./models/Subject');
const connectDB = require('./config/db');

// ✅ FIX 1: connect DB (enable this if MongoDB is ready)
connectDB();

// ✅ FIX 2: allow JSON body parsing
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;