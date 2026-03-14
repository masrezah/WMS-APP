"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const role = useStore((state) => state.role);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊", roles: ["admin"] as const },
    { name: "Master Data", href: "/master-data/products", icon: "📦", roles: ["admin"] as const },
    { name: "Inbound", href: "/inbound/receiving", icon: "📥", roles: ["admin", "operator"] as const },
    { name: "Inventory", href: "/inventory/stock", icon: "🏢", roles: ["admin", "operator"] as const },
    { name: "Outbound", href: "/outbound/orders", icon: "📤", roles: ["admin", "operator"] as const },
  ].filter((item) => item.roles.includes(role));

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 min-h-screen p-4 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold whitespace-nowrap">WMS Panel</h1>
            <div className="mt-1 text-xs text-blue-200">Login sbg: <span className="font-semibold text-white">{role}</span></div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 bg-blue-800 hover:bg-blue-700 rounded-md text-white"
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-md transition"
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
