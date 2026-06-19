"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkTimeAndSetTheme = () => {
      const stored = localStorage.getItem("theme") as Theme | null;
      const hour = new Date().getHours();
      // Night is between 22:00 (10 PM) and 06:00 (6 AM)
      const isNightTime = hour >= 22 || hour < 6;
      
      const initial = stored || (isNightTime ? "dark" : "light");
      
      setTheme(initial);
      document.documentElement.classList.toggle("dark", initial === "dark");
    };

    checkTimeAndSetTheme();
    setMounted(true);

    // Check time periodically to switch automatically if no explicit preference is set
    const interval = setInterval(() => {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (!stored) {
        const hour = new Date().getHours();
        const isNightTime = hour >= 22 || hour < 6;
        const currentExpected = isNightTime ? "dark" : "light";
        setTheme((prev) => {
          if (prev !== currentExpected) {
            document.documentElement.classList.toggle("dark", currentExpected === "dark");
            return currentExpected;
          }
          return prev;
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // We render the context provider with the initial default theme for SSR
  // to prevent hiding the entire app before hydration.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
