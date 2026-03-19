const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  program: {
    type: String,
    enum: ["BTech", "MTech", "BCA", "MCA"],
    required: true,
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: true,
  },
  section: {
    type: String,
    enum: ["A", "B", "C"],
    default: "A",
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Class", classSchema);