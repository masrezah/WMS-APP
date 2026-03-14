type StockValidation = "Tersedia" | "Stok Kurang"

type OutboundItem = {
  sku: string
  name: string
  qty: number
}

type OutboundOrder = {
  id: string
  customer: string
  orderDate: string
  items: OutboundItem[]
  validation: StockValidation
}

const orders: OutboundOrder[] = [
  {
    id: "OB-202311-014",
    customer: "PT Sinar Jaya Abadi",
    orderDate: "2026-03-12",
    items: [
      { sku: "FG-0102", name: "Botol 600ml", qty: 48 },
      { sku: "FG-0207", name: "Karton Packing", qty: 10 },
    ],
    validation: "Tersedia",
  },
  {
    id: "OB-202311-015",
    customer: "CV Maju Bersama",
    orderDate: "2026-03-13",
    items: [{ sku: "FG-0102", name: "Botol 600ml", qty: 120 }],
    validation: "Stok Kurang",
  },
  {
    id: "OB-202311-016",
    customer: "PT Prima Logistik",
    orderDate: "2026-03-14",
    items: [
      { sku: "FG-0301", name: "Galon 19L", qty: 6 },
      { sku: "FG-0207", name: "Karton Packing", qty: 6 },
    ],
    validation: "Tersedia",
  },
]

function ValidationBadge({ status }: { status: StockValidation }) {
  const styles =
    status === "Tersedia"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-red-50 text-red-700 ring-red-200"

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}>
      {status}
    </span>
  )
}

export default function OutboundOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cek Order Keluar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Validasi ketersediaan stok sebelum alokasi dan proses picking dilakukan.
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Daftar Order Outbound</h2>
            <p className="text-xs text-gray-600">{orders.length} order</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-270 w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Tanggal Order</th>
                <th className="px-4 py-3">Item Details</th>
                <th className="px-4 py-3">Validasi Stok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => {
                const canAllocate = o.validation === "Tersedia"

                return (
                  <tr key={o.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{o.id}</td>
                    <td className="px-4 py-3 text-gray-800">{o.customer}</td>
                    <td className="px-4 py-3 text-gray-700">{o.orderDate}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {o.items.map((it) => (
                          <div key={`${o.id}-${it.sku}`} className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-gray-900">{it.sku}</div>
                              <div className="truncate text-xs text-gray-600">{it.name}</div>
                            </div>
                            <div className="shrink-0 text-right text-sm font-semibold text-gray-900">
                              {it.qty.toLocaleString("id-ID")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ValidationBadge status={o.validation} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={!canAllocate}
                        className={
                          canAllocate
                            ? "inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                            : "inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-400"
                        }
                      >
                        Alokasikan &amp; Proses Picking
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
