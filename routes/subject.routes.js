const router = require("express").Router();
const Subject = require("../models/Subject");
const Lesson = require("../models/Lesson");

router.get("/", async (req, res) => {
  res.json(await Subject.find());
});

router.post("/", async (req, res) => {
  res.json(await Subject.create(req.body));
});

router.delete("/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    
    // Delete all lessons associated with this subject
    await Lesson.deleteMany({ subject: subjectId });
    
    // Delete the subject
    const subject = await Subject.findByIdAndDelete(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json({ message: "Subject and associated lessons deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

module.exports = router;