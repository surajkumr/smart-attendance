import { useEffect, useState } from "react";
import { getDefaulters } from "../../services/dashboardService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DefaulterList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchDefaulters();
  }, []);

  const fetchDefaulters = () => {
    getDefaulters().then((res) => {
      setStudents(res.data);
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Defaulter List (Below 75%)", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Name", "Email", "Attendance %"]],
      body: students.map((s) => [
        s.name,
        s.email,
        `${s.percentage}%`,
      ]),
    });

    doc.save("Defaulters.pdf");
  };

  if (students.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-red-500">
          ⚠ Defaulter List (Below 75%)
        </h3>

        <button
          onClick={exportPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Export PDF
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b">
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td className="text-red-500 font-semibold">
                {student.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DefaulterList;