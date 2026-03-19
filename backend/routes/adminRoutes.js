const router = require("express").Router();
const User = require("../models/User");
const Class = require("../models/Class");
const auth = require("../middleware/auth");

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};

// Get all users
router.get("/users", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Create class
router.post("/class", auth, isAdmin, async (req, res) => {
  const { program, year, section, subject, teacher, students } = req.body;

  const newClass = await Class.create({
    program,
    year,
    section,
    subject,
    teacher,
    students,
  });

  res.json(newClass);
});

// Get all classes
router.get("/classes", auth, isAdmin, async (req, res) => {
  const classes = await Class.find()
    .populate("teacher", "name email")
    .populate("students", "name email");

  res.json(classes);
});

module.exports = router;