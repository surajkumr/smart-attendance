const router = require("express").Router();
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

// Mark attendance
router.post("/", auth, async (req, res) => {
  const { student, classId, status } = req.body;

  const existing = await Attendance.findOne({
    student,
    class: classId,
    date: { 
      $gte: new Date().setHours(0,0,0,0),
      $lte: new Date().setHours(23,59,59,999)
    }
  });

  if (existing) return res.status(400).json({ msg: "Already marked" });

  const record = await Attendance.create({
    student,
    class: classId,
    status
  });

  res.json(record);
});

// Get attendance percentage
router.get("/percentage/:studentId", auth, async (req, res) => {
  const total = await Attendance.countDocuments({ student: req.params.studentId });
  const present = await Attendance.countDocuments({
    student: req.params.studentId,
    status: "Present"
  });

  const percentage = total === 0 ? 0 : (present / total) * 100;

  res.json({ percentage });
});

module.exports = router;