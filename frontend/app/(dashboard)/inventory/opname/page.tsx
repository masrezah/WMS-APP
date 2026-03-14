"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

type RecoRow = {
  id: string
  bin: string
  sku: string
  itemName: string
  systemQty: number
  actualQty: number
}

const initialRows: RecoRow[] = [
  {
    id: "1",
    bin: "ZA-01-01",
    sku: "RM-0001",
    itemName: "Biji Plastik PP",
    systemQty: 300,
    actualQty: 295,
  },
  {
    id: "2",
    bin: "ZA-01-03",
    sku: "RM-0024",
    itemName: "Label Stiker",
    systemQty: 120,
    actualQty: 120,
  },
  {
    id: "3",
    bin: "ZA-02-02",
    sku: "FG-0102",
    itemName: "Botol 600ml",
    systemQty: 48,
    actualQty: 55,
  },
]

function formatDiff(diff: number) {
  if (diff > 0) return `+${diff}`
  return `${diff}`
}

export default function StockOpnamePage() {
  const [rows, setRows] = useState<RecoRow[]>(initialRows)

  const totalDiff = useMemo(() => {
    return rows.reduce((acc, r) => acc + (r.actualQty - r.systemQty), 0)
  }, [rows])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Opname</h1>
          <p className="mt-1 text-sm text-gray-600">
            Rekonsiliasi stok sistem vs fisik untuk memastikan akurasi persediaan.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            🖨️ Cetak Kertas Kerja
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            + Buat Sesi Opname
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Sesi Aktif: SO-2023-11-01 (Zona A)</p>
            <p className="mt-1 text-sm text-gray-600">
              Input hasil hitung fisik per bin, lalu selesaikan untuk penyesuaian stok.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
            In Progress
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Tabel Rekonsiliasi</h2>
            <p className="text-xs text-gray-600">
              Total selisih:{" "}
              <span className={totalDiff < 0 ? "font-semibold text-red-600" : totalDiff > 0 ? "font-semibold text-emerald-600" : "font-semibold text-gray-700"}>
                {formatDiff(totalDiff)}
              </span>
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-245 w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Lokasi (Bin)</th>
                <th className="px-4 py-3">SKU / Item</th>
                <th className="px-4 py-3 text-right">Stok Sistem</th>
                <th className="px-4 py-3">Input Aktual Fisik</th>
                <th className="px-4 py-3 text-right">Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const diff = row.actualQty - row.systemQty
                const diffClass =
                  diff < 0 ? "text-red-600" : diff > 0 ? "text-emerald-600" : "text-gray-700"

                return (
                  <tr key={row.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.bin}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{row.sku}</div>
                      <div className="text-xs text-gray-600">{row.itemName}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {row.systemQty.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        inputMode="numeric"
                        className="w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                        value={row.actualQty}
                        onChange={(e) => {
                          const next = Number(e.target.value)
                          setRows((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, actualQty: Number.isFinite(next) ? next : 0 } : r)),
                          )
                        }}
                      />
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${diffClass}`}>{formatDiff(diff)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Pastikan input aktual fisik sudah benar sebelum menyelesaikan sesi opname.
          </p>
          <button
            type="button"
            onClick={() => toast.success("Hasil Stock Opname berhasil disimpan!")}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Selesaikan Opname &amp; Sesuaikan Stok
          </button>
        </div>
      </section>
    </div>
  )
}
