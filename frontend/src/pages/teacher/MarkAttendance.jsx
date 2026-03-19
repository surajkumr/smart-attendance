import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import API from "../../services/api";
import { motion } from "framer-motion";

function MarkAttendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [markedStudents, setMarkedStudents] = useState({});

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await API.get("/class");
    setClasses(res.data);
  };

  const fetchStudents = async (classId) => {
    setLoading(true);
    const res = await API.get(`/class/${classId}/students`);
    setStudents(res.data);
    setMarkedStudents({});
    setLoading(false);
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    if (classId) {
      fetchStudents(classId);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await API.post("/attendance", {
        student: studentId,
        classId: selectedClass,
        status,
      });

      setMarkedStudents((prev) => ({
        ...prev,
        [studentId]: status,
      }));
    } catch {
      alert("Already marked today");
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>

        {/* Class Selector */}
        <select
          className="mb-6 p-3 border rounded-lg w-full md:w-1/3"
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.program} Year {cls.year} - Section {cls.section} (
              {cls.subject})
            </option>
          ))}
        </select>

        {/* Loading State */}
        {loading && (
          <p className="text-indigo-600 font-medium">Loading students...</p>
        )}

        {/* Student Table */}
        {students.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-indigo-600 text-white">
                <tr className="border-b text-black dark:text-white">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const status = markedStudents[student._id];

                  return (
                    <tr
                      key={student._id}
                      className={`border-b transition ${
                        status === "Present"
                          ? "bg-green-50"
                          : status === "Absent"
                            ? "bg-red-50"
                            : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.email}</td>

                      <td className="p-4 text-center space-x-2">
                        <button
                          disabled={!!status}
                          onClick={() => markAttendance(student._id, "Present")}
                          className={`px-4 py-2 rounded-lg text-white transition ${
                            status
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          disabled={!!status}
                          onClick={() => markAttendance(student._id, "Absent")}
                          className={`px-4 py-2 rounded-lg text-white transition ${
                            status
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedClass && students.length === 0 && (
          <p className="text-gray-500 mt-6">
            No students enrolled in this class.
          </p>
        )}
      </motion.div>
    </MainLayout>
  );
}

export default MarkAttendance;
