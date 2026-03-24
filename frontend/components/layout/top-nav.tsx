"use client";

import { useStore } from "@/store/useStore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid Cumulative Layout Shift
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export function TopNav() {
  const tenantName = useStore((state) => state.tenantName) || "Gudang Belum Disetup";
  const role = useStore((state) => state.role);
  const setRole = useStore((state) => state.setRole);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
      <div className="flex items-center gap-4 w-1/3">
        <SidebarTrigger className="-ml-2 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200" />
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input 
            type="text" 
            placeholder="Cari menu atau data..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <ThemeToggle />
        
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs text-gray-500 font-medium dark:text-zinc-500">Tenant Aktif</span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{tenantName}</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "operator")}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </div>
          <span className="mt-0.5 text-[11px] text-gray-500 font-medium dark:text-zinc-500">Role Simulator</span>
        </div>
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100 border-2 border-blue-500 flex items-center justify-center font-extrabold text-blue-700 dark:bg-zinc-800 dark:border-blue-700 dark:text-blue-400">
          {role === "admin" ? "A" : "O"}
        </div>
      </div>
    </header>
  );
}
