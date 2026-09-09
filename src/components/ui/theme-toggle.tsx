"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-xl border border-border/80 bg-card animate-pulse shrink-0", className)} />
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
      className={cn(
        "h-9 w-9 rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted/60 transition-all flex items-center justify-center shadow-2xs group shrink-0 cursor-pointer",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}

