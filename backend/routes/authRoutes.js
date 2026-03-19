const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Get all students
router.get("/students", async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json(students);
});
// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email);

  const user = await User.findOne({ email });
  console.log("User found:", user);

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  console.log("Password match:", valid);

  if (!valid) {
    return res.status(400).json({ msg: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, role: user.role });
});

module.exports = router;