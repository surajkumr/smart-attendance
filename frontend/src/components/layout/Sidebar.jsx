import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardCheck, User, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, setRole } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/");
  };

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-indigo-700"
        : "hover:bg-indigo-500"
    }`;

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500 text-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-10 tracking-wide">
        Smart Attendance
      </h2>

      <ul className="space-y-3">
        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className={linkClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </li>

        {role === "teacher" && (
          <li>
            <button
              onClick={() => navigate("/mark-attendance")}
              className={linkClass("/mark-attendance")}
            >
              <ClipboardCheck size={18} />
              Mark Attendance
            </button>
          </li>
        )}

        {role === "student" && (
          <li>
            <button
              onClick={() => navigate("/my-attendance")}
              className={linkClass("/my-attendance")}
            >
              <User size={18} />
              My Attendance
            </button>
          </li>
        )}

        {role === "admin" && (
          <li>
            <button
              onClick={() => navigate("/admin")}
              className={linkClass("/admin")}
            >
              Admin Panel
            </button>
          </li>
        )}
      </ul>

      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 p-3 rounded-lg transition w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
