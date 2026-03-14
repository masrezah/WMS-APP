"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

type OrderOption = {
  id: string
  customer: string
  shipTo: string
  items: { sku: string; name: string; qty: number }[]
}

const orderOptions: OrderOption[] = [
  {
    id: "OB-202311-014",
    customer: "PT Sinar Jaya Abadi",
    shipTo: "Jl. Industri No. 88, Jakarta",
    items: [
      { sku: "FG-0102", name: "Botol 600ml", qty: 48 },
      { sku: "FG-0207", name: "Karton Packing", qty: 10 },
    ],
  },
  {
    id: "OB-202311-016",
    customer: "PT Prima Logistik",
    shipTo: "Komplek Pergudangan Delta, Bekasi",
    items: [
      { sku: "FG-0301", name: "Galon 19L", qty: 6 },
      { sku: "FG-0207", name: "Karton Packing", qty: 6 },
    ],
  },
]

export default function ShipmentPage() {
  const [orderId, setOrderId] = useState(orderOptions[0]?.id ?? "")
  const [carrier, setCarrier] = useState("JNE Trucking")
  const [driverName, setDriverName] = useState("Budi Santoso")
  const [vehiclePlate, setVehiclePlate] = useState("B 1234 WMS")

  const doNumber = "DO-202311-001"

  const selected = useMemo(() => orderOptions.find((o) => o.id === orderId), [orderId])
  const doDate = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "2-digit" })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengiriman &amp; Surat Jalan (DO)</h1>
        <p className="mt-1 text-sm text-gray-600">
          Catat detail pengiriman dan generate dokumen Surat Jalan untuk proses dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">Detail Shipment</h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Pilih Order ID</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              >
                {orderOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.customer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Ekspedisi / Kurir</label>
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">Nama Pengemudi</label>
                <input
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Plat Nomor Kendaraan</label>
                <input
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Nomor DO</label>
              <input
                value={doNumber}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700"
              />
            </div>

            <button
              type="button"
              onClick={() => toast.success("Shipment berhasil dibuat dan Nomor DO berhasil digenerate!")}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Simpan &amp; Generate Shipment
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Preview Surat Jalan</h2>
              <p className="mt-1 text-xs text-gray-600">Mock-up dokumen untuk kebutuhan print</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
              🖨️ Cetak Surat Jalan
            </button>
          </div>

          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-extrabold text-gray-900">PT WMS Enterprise</div>
                <div className="mt-1 text-xs text-gray-600">Jl. Gudang Raya No. 10, Tangerang</div>
                <div className="text-xs text-gray-600">Telp: (021) 123-456</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-gray-900">SURAT JALAN (DO)</div>
                <div className="mt-1 text-xs text-gray-600">No: <span className="font-semibold text-gray-900">{doNumber}</span></div>
                <div className="text-xs text-gray-600">Tanggal: <span className="font-semibold text-gray-900">{doDate}</span></div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-gray-200 p-3">
                <div className="text-xs font-semibold text-gray-600">Kepada Yth</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{selected?.customer ?? "-"}</div>
                <div className="mt-1 text-xs text-gray-600">{selected?.shipTo ?? "-"}</div>
              </div>
              <div className="rounded-md border border-gray-200 p-3">
                <div className="text-xs font-semibold text-gray-600">Detail Pengiriman</div>
                <div className="mt-1 text-xs text-gray-700">Ekspedisi: <span className="font-semibold text-gray-900">{carrier || "-"}</span></div>
                <div className="mt-1 text-xs text-gray-700">Pengemudi: <span className="font-semibold text-gray-900">{driverName || "-"}</span></div>
                <div className="mt-1 text-xs text-gray-700">Plat: <span className="font-semibold text-gray-900">{vehiclePlate || "-"}</span></div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">Nama Barang</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(selected?.items ?? []).map((it, idx) => (
                    <tr key={`${selected?.id ?? "x"}-${it.sku}`} className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-900">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-gray-900">{it.sku}</td>
                      <td className="px-3 py-2 text-gray-800">{it.name}</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{it.qty.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                  {(!selected?.items || selected.items.length === 0) && (
                    <tr className="bg-white">
                      <td className="px-3 py-3 text-center text-gray-500" colSpan={4}>
                        Tidak ada item
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-md border border-gray-200 p-3">
                <div className="text-xs font-semibold text-gray-600">Dikirim Oleh</div>
                <div className="mt-10 border-t border-gray-300 pt-2 text-xs font-semibold text-gray-900">Gudang / Admin</div>
              </div>
              <div className="rounded-md border border-gray-200 p-3">
                <div className="text-xs font-semibold text-gray-600">Diterima Oleh</div>
                <div className="mt-10 border-t border-gray-300 pt-2 text-xs font-semibold text-gray-900">Pelanggan</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
