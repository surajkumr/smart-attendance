const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ SIMPLE WORKING CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/class", require("./routes/classRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));