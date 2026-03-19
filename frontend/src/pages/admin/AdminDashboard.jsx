import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllUsers, getAllClasses } from "../../services/adminService";
import { motion } from "framer-motion";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const usersRes = await getAllUsers();
    const classesRes = await getAllClasses();

    setUsers(usersRes.data);
    setClasses(classesRes.data);
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        {/* Users Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            All Users
          </h2>

          <table className="w-full text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b text-black dark:text-white"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Classes Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">All Classes</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-b">
                  <td>
                    {cls.program} Year {cls.year} - {cls.section}
                  </td>
                  <td>{cls.subject}</td>
                  <td>{cls.teacher?.name}</td>
                  <td>{cls.students.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default AdminDashboard;
