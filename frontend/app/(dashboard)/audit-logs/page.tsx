"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Activity, ShieldAlert, History, Filter } from "lucide-react";

// Tipe data berdasarkan Model Prisma AuditLog yang kita buat
interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  old_data: any;
  new_data: any;
  created_at: string;
}

// Data Mockup untuk UI karena belum ada fungsi Fetch API riil
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "a1",
    tenant_id: "tenant-1",
    user_id: "usr_9982",
    action: "UPDATE",
    entity: "InventoryBatch",
    old_data: { quantity: 150 },
    new_data: { quantity: 120 },
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mnt lalu
  },
  {
    id: "a2",
    tenant_id: "tenant-1",
    user_id: "usr_9982",
    action: "CREATE",
    entity: "TransactionLog",
    old_data: null,
    new_data: { type: "OUTBOUND", quantity: 30 },
    created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    id: "a3",
    tenant_id: "tenant-1",
    user_id: "usr_1024",
    action: "DELETE",
    entity: "Product",
    old_data: { sku: "PRD-X99", name: "Obsolete Part" },
    new_data: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 jam lalu
  }
];

export default function AuditLogsPage() {
  const role = useStore((state) => state.role);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // RBAC Proteksi Route: Hanya SUPER_ADMIN dan TENANT_ADMIN (serta 'admin' lama) yang boleh melihat Log Sistem
  const isAllowed = ['SUPER_ADMIN', 'TENANT_ADMIN', 'admin'].includes(role);

  useEffect(() => {
    if (!isAllowed) return;

    // Simulasi Fetch API ke backend NestJS (GET /audit-logs)
    const fetchLogs = async () => {
      try {
        // Simulasi delay jaringan
        await new Promise(resolve => setTimeout(resolve, 800));
        setLogs(MOCK_AUDIT_LOGS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [isAllowed]);

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] p-8 text-center bg-gray-50 dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-2xl max-w-lg mx-auto mt-20">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Akses Ditolak (403)</h2>
        <p className="text-gray-600 dark:text-zinc-400">
          Anda menggunakan peran <span className="font-bold text-red-500">{role}</span>. <br />
          Halaman Audit Trail berisikan data sensitif perusahaan dan hanya dapat diakses oleh Level Manajerial / Pemilik Tenant.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Audit Trail
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Log aktivitas sistem yang dimutasi oleh interceptor backend NestJS.</p>
        </div>
        
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
          <Filter className="w-4 h-4" />
          Filter Log
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-zinc-400">
            <thead className="bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-zinc-200 font-semibold border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Aksi</th>
                <th className="px-6 py-4">Entitas/Tabel</th>
                <th className="px-6 py-4">ID Pengguna</th>
                <th className="px-6 py-4">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y border-gray-200 dark:border-zinc-700 divide-gray-100 dark:divide-zinc-800">
              {isLoading ? (
                // Loading Skeketons
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-48"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Activity className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
                    Belum ada log aktivitas tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-zinc-300">
                      {new Date(log.created_at).toLocaleString('id-ID', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30' : ''}
                        ${log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30' : ''}
                        ${log.action === 'DELETE' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30' : ''}
                      `}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{log.entity}</td>
                    <td className="px-6 py-4">{log.user_id}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={JSON.stringify(log.new_data || log.old_data)}>
                      <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-orange-600 dark:text-orange-400">
                        {JSON.stringify(log.new_data || log.old_data)}
                      </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
