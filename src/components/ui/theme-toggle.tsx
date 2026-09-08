"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-border/80 bg-card animate-pulse shrink-0" />
    );
  }

  const isDark = theme === "dark" || resolvedTheme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-10 w-10 rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center justify-center shadow-2xs group shrink-0 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200 group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
