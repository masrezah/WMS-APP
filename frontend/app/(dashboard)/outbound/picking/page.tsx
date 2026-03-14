"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Camera } from "lucide-react"

type PickingTask = {
  routeName: string
  bin: string
  sku: string
  name: string
  qty: number
  strategy: "FIFO" | "FEFO"
}

const task: PickingTask = {
  routeName: "Smart Picking Task",
  bin: "ZA-02-04",
  sku: "FG-0102",
  name: "Botol 600ml",
  qty: 48,
  strategy: "FEFO",
}

export default function SmartPickingPage() {
  const [scanValue, setScanValue] = useState("")

  const helperText = useMemo(() => {
    if (!scanValue.trim()) return "Scan lokasi/pallet untuk verifikasi bin."
    return "Terbaca. Pastikan cocok dengan target lokasi."
  }, [scanValue])

  return (
    <div className="py-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wide text-gray-500">TABLET / PDA MODE</div>
                <h1 className="mt-1 text-xl font-bold text-gray-900">Smart Picking</h1>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                {task.strategy}
              </span>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-600">{task.routeName}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{task.strategy}/FIFO Route</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  Aktif
                </span>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold text-gray-600">Target Lokasi (Bin)</div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">{task.bin}</div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-xs font-semibold text-gray-600">SKU</div>
                  <div className="mt-1 text-lg font-bold text-gray-900">{task.sku}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-xs font-semibold text-gray-600">Nama Barang</div>
                  <div className="mt-1 text-base font-semibold text-gray-900">{task.name}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-xs font-semibold text-gray-600">Qty untuk Diambil</div>
                  <div className="mt-1 text-2xl font-extrabold text-gray-900">
                    {task.qty.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <label className="text-sm font-semibold text-gray-900">Scan Barcode Lokasi / Pallet</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  placeholder="Contoh: ZA-02-04"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base font-semibold text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                />
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Camera className="size-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{helperText}</p>
            </section>
          </div>

          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={() => toast.success("Barang berhasil dipick dan dimasukkan ke staging area!")}
              className="h-14 w-full rounded-xl bg-emerald-600 text-base font-extrabold tracking-wide text-white shadow-sm hover:bg-emerald-700"
            >
              ✓ KONFIRMASI PICKING
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
