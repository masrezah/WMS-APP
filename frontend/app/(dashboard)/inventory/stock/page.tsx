type StockStatus = "Aman" | "Low Stock"

type StockRow = {
  sku: string
  name: string
  bin: string
  batchExp: string
  available: number
  status: StockStatus
}

const stockData: StockRow[] = [
  {
    sku: "RM-0001",
    name: "Biji Plastik PP",
    bin: "ZA-01-01",
    batchExp: "PP-2401 / 2026-12-31",
    available: 1200,
    status: "Aman",
  },
  {
    sku: "FG-0102",
    name: "Botol 600ml",
    bin: "ZB-02-04",
    batchExp: "FG-2410 / 2027-03-15",
    available: 48,
    status: "Low Stock",
  },
  {
    sku: "RM-0024",
    name: "Label Stiker",
    bin: "ZA-03-02",
    batchExp: "LBL-2408 / 2026-08-30",
    available: 320,
    status: "Aman",
  },
  {
    sku: "FG-0207",
    name: "Karton Packing",
    bin: "ZB-01-06",
    batchExp: "CTN-2405 / 2026-11-01",
    available: 95,
    status: "Low Stock",
  },
]

function StatusBadge({ status }: { status: StockStatus }) {
  const styles =
    status === "Aman"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-red-50 text-red-700 ring-red-200"

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}>
      {status}
    </span>
  )
}

export default function RealtimeStockPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Real-time</h1>
          <p className="mt-1 text-sm text-gray-600">
            Pantau ketersediaan stok per lokasi penyimpanan secara ringkas dan cepat.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
        >
          📥 Export Excel
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="text-sm font-semibold text-gray-800">Search (SKU/Nama)</label>
            <input
              placeholder="Contoh: FG-0102 / Botol 600ml"
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-gray-800">Kategori</label>
            <select className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200">
              <option value="">Semua</option>
              <option value="raw">Raw Material</option>
              <option value="fg">Finished Good</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-gray-800">Zona Penyimpanan</label>
            <select className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200">
              <option value="">Semua</option>
              <option value="zona-a">Zona A</option>
              <option value="zona-b">Zona B</option>
            </select>
          </div>

          <div className="md:col-span-1 md:flex md:items-end">
            <button
              type="button"
              className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Daftar Stok</h2>
            <p className="text-xs text-gray-600">{stockData.length} item</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-220 w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Nama Barang</th>
                <th className="px-4 py-3">Lokasi (Bin)</th>
                <th className="px-4 py-3">Batch / Exp</th>
                <th className="px-4 py-3 text-right">Tersedia</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockData.map((row) => (
                <tr key={`${row.sku}-${row.bin}`} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.sku}</td>
                  <td className="px-4 py-3 text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-800">{row.bin}</td>
                  <td className="px-4 py-3 text-gray-700">{row.batchExp}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {row.available.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
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
