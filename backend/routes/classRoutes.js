const router = require("express").Router();
const Class = require("../models/Class");
const auth = require("../middleware/auth");

// Create Class (Admin use)
router.post("/", auth, async (req, res) => {
  const { program, year, section, subject, teacher, students } = req.body;

  try {
    const newClass = await Class.create({
      program,
      year,
      section,
      subject,
      teacher,
      students
    });

    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: "Error creating class" });
  }
});

// Get classes
router.get("/", auth, async (req, res) => {
  try {
    let classes;

    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user.id })
        .populate("teacher", "name")
        .populate("students", "name");
    } else {
      classes = await Class.find()
        .populate("teacher", "name")
        .populate("students", "name");
    }

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes" });
  }
});

// Get students of specific class
router.get("/:classId/students", auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId)
      .populate("students", "-password");

    if (!classData) {
      return res.status(404).json({ msg: "Class not found" });
    }

    res.json(classData.students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

module.exports = router;