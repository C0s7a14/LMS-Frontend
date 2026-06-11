import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="
        w-12
        h-12
        rounded-2xl
        flex
        items-center
        justify-center
        transition-all

        bg-gray-100
        text-gray-700
        hover:bg-gray-200

        dark:bg-blue-500/20
        dark:text-blue-400
        dark:hover:bg-blue-500/30
      "
    >
      {isDark ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}