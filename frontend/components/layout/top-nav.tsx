"use client";
import { useStore } from "@/store/useStore";

export function TopNav() {
  const tenantName = useStore((state) => state.tenantName) || "Gudang Belum Disetup";
  const role = useStore((state) => state.role);
  const setRole = useStore((state) => state.setRole);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <input 
          type="text" 
          placeholder="Cari menu atau data..." 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs text-gray-500 font-medium">Tenant Aktif</span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-bold text-blue-700">{tenantName}</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "operator")}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </div>
          <span className="mt-0.5 text-[11px] text-gray-500 font-medium">Role Simulator</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-100 border-2 border-blue-500 flex items-center justify-center font-extrabold text-blue-700">
          {role === "admin" ? "A" : "O"}
        </div>
      </div>
    </header>
  );
}
