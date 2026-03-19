import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition">      <Sidebar />
      <div className="flex-1 p-8">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default MainLayout;