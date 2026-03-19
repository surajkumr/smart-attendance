import { Moon, Sun } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <button
        onClick={toggleTheme}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

export default Navbar;