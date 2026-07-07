"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // To avoid mismatch between server and client
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    // return (
    //     <button
    //         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    //         className="p-2 rounded-lg border border-gray-400 dark:border-white transition">
    //         {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    //     </button>
    // );
}
