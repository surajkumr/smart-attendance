const router = require("express").Router();
const User = require("../models/User");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");


// ==========================
// Defaulter List (<75%)
// ==========================
router.get("/defaulters", auth, async (req, res) => {
  try {
    const { classId } = req.query;

    let students;

    if (classId) {
      const selectedClass = await Class.findById(classId);
      students = await User.find({
        role: "student",
        _id: { $in: selectedClass.students },
      });
    } else {
      students = await User.find({ role: "student" });
    }

    const result = [];

    for (let student of students) {
      const attendanceFilter = { student: student._id };

      if (classId) {
        attendanceFilter.class = classId;
      }

      const total = await Attendance.countDocuments(attendanceFilter);

      const present = await Attendance.countDocuments({
        ...attendanceFilter,
        status: "Present",
      });

      const percentage =
        total === 0 ? 0 : (present / total) * 100;

      if (percentage < 75) {
        result.push({
          name: student.name,
          email: student.email,
          percentage: percentage.toFixed(2),
        });
      }
    }

    res.json(result);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


// ==========================
// Dashboard Stats (FILTERABLE)
// ==========================
router.get("/stats", auth, async (req, res) => {
  try {
    const { classId } = req.query;

    let attendanceFilter = {};
    let studentFilter = {};

    if (classId) {
      attendanceFilter.class = classId;

      const selectedClass = await Class.findById(classId);

      if (selectedClass) {
        studentFilter._id = { $in: selectedClass.students };
      }
    }

    const totalStudents = classId
      ? await User.countDocuments({
          role: "student",
          ...studentFilter,
        })
      : await User.countDocuments({ role: "student" });

    const totalClasses = await Class.countDocuments();

    const totalAttendance =
      await Attendance.countDocuments(attendanceFilter);

    const totalPresent =
      await Attendance.countDocuments({
        ...attendanceFilter,
        status: "Present",
      });

    const percentage =
      totalAttendance === 0
        ? 0
        : ((totalPresent / totalAttendance) * 100).toFixed(2);

    res.json({
      totalStudents,
      totalClasses,
      attendancePercentage: percentage,
    });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


// ==========================
// Monthly Analytics (FILTERABLE)
// ==========================
router.get("/monthly", auth, async (req, res) => {
  try {
    const { classId } = req.query;

    let matchStage = {};

    if (classId) {
      matchStage.class = require("mongoose").Types.ObjectId(classId);
    }

    const data = await Attendance.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },

      {
        $project: {
          month: "$_id",
          attendance: {
            $multiply: [
              { $divide: ["$present", "$total"] },
              100,
            ],
          },
        },
      },

      { $sort: { month: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Student Personal Analytics
const mongoose = require("mongoose");

router.get("/student", auth, async (req, res) => {
  try {
    const studentId = req.user.id;

    const total = await Attendance.countDocuments({
      student: studentId,
    });

    const present = await Attendance.countDocuments({
      student: studentId,
      status: "Present",
    });

    const absent = total - present;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    const monthly = await Attendance.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          attendance: {
            $multiply: [
              { $divide: ["$present", "$total"] },
              100,
            ],
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      total,
      present,
      absent,
      percentage,
      monthly,
    });
  } catch (err) {
    console.error(err); // IMPORTANT: see error in terminal
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;