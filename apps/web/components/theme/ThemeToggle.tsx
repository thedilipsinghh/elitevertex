"use client";

import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by displaying neutral icon until mounted
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center gap-2 rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
        {!mounted ? "dark_mode" : isDark ? "light_mode" : "dark_mode"}
      </span>
      {showLabel && (
        <span className="text-sm font-semibold uppercase tracking-wider">
          {!mounted ? "Theme" : isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
