import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import AttendanceChart from "../../components/charts/AttendanceChart";
import { getDashboardStats } from "../../services/dashboardService";
import API from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendancePercentage: 0,
  });

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    loadStats();
    loadClasses();
  }, []);

  const loadStats = (classId = "") => {
    getDashboardStats(classId).then((res) => {
      setStats(res.data);
    });
  };

  const loadClasses = async () => {
    const res = await API.get("/class");
    setClasses(res.data);
  };

  const handleFilterChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    loadStats(classId);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <select
        value={selectedClass}
        className="mb-6 p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        onChange={handleFilterChange}
      >
        <option value="">All Classes</option>

        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.program} Year {cls.year} - Section {cls.section}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Classes" value={stats.totalClasses} />
        <Card title="Total Students" value={stats.totalStudents} />
        <Card title="Attendance %" value={`${stats.attendancePercentage}%`} />
      </div>

      <AttendanceChart selectedClass={selectedClass} />
    </MainLayout>
  );
}

export default Dashboard;