const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/subject/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid subject id." });
  }

  try {
    const lessons = await Lesson.find({ subject: id });
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load lessons." });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid lesson id." });
  }

  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found." });
    }
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load lesson." });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, subject } = req.body;
    const newLesson = { title, content, subject };

    if (req.file) {
      newLesson.imageUrl = `/uploads/${req.file.filename}`;
    }

    const lesson = await Lesson.create(newLesson);
    res.status(201).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create lesson." });
  }
});

module.exports = router;