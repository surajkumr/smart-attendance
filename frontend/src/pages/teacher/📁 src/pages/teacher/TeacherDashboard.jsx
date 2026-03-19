import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import API from "../../services/api";
import { motion } from "framer-motion";

function TeacherDashboard() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await API.get("/class");
    setClasses(res.data);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Teacher Dashboard
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            My Classes
          </h2>

          <table className="w-full text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Program</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Students</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr
                  key={cls._id}
                  className="border-b text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {cls.program} Year {cls.year} - {cls.section}
                  </td>
                  <td className="p-3">{cls.subject}</td>
                  <td className="p-3">{cls.students.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default TeacherDashboard;