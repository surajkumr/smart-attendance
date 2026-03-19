import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getMonthlyData } from "../../services/dashboardService";

function AttendanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMonthlyData().then((res) => {
      const formatted = res.data.map((item) => ({
        month: `Month ${item.month}`,
        attendance: item.attendance.toFixed(0),
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <h3 className="mb-4 font-semibold">Monthly Attendance</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="attendance" fill="#6366F1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;