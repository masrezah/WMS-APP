"use client";

import { useQuery } from "@tanstack/react-query";
import { WmsService } from "@/services/wms.service";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";

type StockStatus = "Aman" | "Low Stock"

type StockRow = {
  id: string
  sku: string
  name: string
  bin: string
  batchExp: string
  available: number
  status: StockStatus
}

export default function StockPage() {
  const tenant_id = typeof window !== 'undefined' ? localStorage.getItem("tenant_id") || "T-001" : "T-001";

  const { data: stockResponse, isLoading, isError } = useQuery({
    queryKey: ["stock", tenant_id],
    queryFn: () => WmsService.getStock(tenant_id),
  });

  const stocks = stockResponse?.data || [];

  const stockData: StockRow[] = stocks.map((s: any) => ({
    id: s.id,
    sku: s.product?.sku || "-",
    name: s.product?.name || "-",
    bin: s.location ? `${s.location.zone}-${s.location.rack}-${s.location.shelf}-${s.location.bin}` : "-",
    batchExp: `${s.batch_no || "NO-BATCH"} / ${s.expiry_date ? new Date(s.expiry_date).toISOString().split('T')[0] : "-"}`,
    available: s.quantity,
    status: s.quantity < 50 ? "Low Stock" : "Aman", // simple threshold logic
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Real-time</h1>
          <p className="mt-1 text-sm text-gray-600">
            Pantau ketersediaan barang di seluruh lokasi gudang beserta batch dan masa kedaluwarsanya.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="mr-2 size-4 text-gray-400">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Daftar Inventori</h2>
            <p className="text-xs text-gray-600">{stockData.length} item ditemukan</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-245 w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">SKU / Nama Item</th>
                <th className="px-4 py-3">Lokasi (Bin)</th>
                <th className="px-4 py-3">Batch / Exp Date</th>
                <th className="px-4 py-3 text-right">Tersedia</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Loader2Icon className="w-8 h-8 animate-spin mb-2 text-blue-600" />
                      <p>Memuat data stok...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-red-500">
                    <AlertCircleIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>Gagal memuat data stok.</p>
                  </td>
                </tr>
              ) : stockData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    Tidak ada data stok.
                  </td>
                </tr>
              ) : stockData.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{row.sku}</div>
                    <div className="text-xs text-gray-600">{row.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{row.bin}</td>
                  <td className="px-4 py-3 text-gray-600">{row.batchExp}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {row.available.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "Aman" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        {row.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
