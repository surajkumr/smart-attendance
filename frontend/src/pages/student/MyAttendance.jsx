import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import { getStudentAnalytics } from "../../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MyAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getStudentAnalytics();
      setData(res.data);
    } catch (err) {
      setError("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    doc.text("My Attendance Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Metric", "Value"]],
      body: [
        ["Total Classes", data.total],
        ["Present", data.present],
        ["Absent", data.absent],
        ["Attendance %", `${data.percentage}%`],
      ],
    });

    doc.save("My_Attendance_Report.pdf");
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-indigo-600 font-medium">
          Loading your attendance...
        </p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="text-red-500 font-semibold">{error}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            My Attendance
          </h1>

          <button
            onClick={exportPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Download Report
          </button>
        </div>

        {/* Warning Badge */}
        {data.percentage < 75 && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 font-semibold">
            ⚠ Your attendance is below 75%. Please improve.
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Classes" value={data.total} />
          <Card title="Present" value={data.present} />
          <Card title="Attendance %" value={`${data.percentage}%`} />
        </div>

        {/* Monthly Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10">
          <h3 className="mb-4 font-semibold">
            Monthly Performance
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={(data.monthly || []).map((m) => ({
                month: `Month ${m.month}`,
                attendance: Number(m.attendance.toFixed(0)),
              }))}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="attendance"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Class-wise Breakdown */}
        {data.classWise && data.classWise.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">
              Class-wise Attendance
            </h3>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th>Class</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {data.classWise.map((cls, index) => (
                  <tr key={index} className="border-b">
                    <td>{cls.className}</td>
                    <td
                      className={`font-semibold ${
                        cls.percentage < 75
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {cls.percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}

export default MyAttendance;