const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

module.exports = protect;