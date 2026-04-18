const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const genToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json("Missing required fields");
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json("Email exists");

    const user = await User.create({ name, email, password });
    res.json({ token: genToken(user._id) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Missing required fields");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password");

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json("Invalid email or password");

    res.json({ token: genToken(user._id) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json("Server error");
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json("Server error");
  }
});

module.exports = router;