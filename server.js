require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studylib";
if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set. Using fallback JWT secret for development only."
  );
}
connectDB(MONGO_URI);


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/subjects", require("./routes/subject.routes"));
app.use("/api/lessons", require("./routes/lesson.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));