const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  imageUrl: String,
});

module.exports = mongoose.model("Lesson", lessonSchema);