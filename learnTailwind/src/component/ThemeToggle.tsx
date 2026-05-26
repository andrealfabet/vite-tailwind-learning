import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative flex items-center w-14 h-7 rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
        isDark
          ? "bg-gray-700 border border-white/10"
          : "bg-amber-200 border border-amber-300"
      }`}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-[11px]">🌙</span>
      <span className="absolute right-1.5 text-[11px]">☀️</span>

      {/* Sliding knob */}
      <span
        className={`relative z-10 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
          isDark
            ? "translate-x-0 bg-gray-200"
            : "translate-x-7 bg-amber-500"
        }`}
      />
    </button>
  );
}

export default ThemeToggle;
