type Trend = "up" | "down"

type SummaryCard = {
  title: string
  value: string
  trend: Trend
  trendLabel: string
  icon: React.ReactNode
  emphasis?: "danger"
}

type ActivityType = "inbound" | "outbound" | "stock"

type Activity = {
  time: string
  message: string
  type: ActivityType
}

type BarRow = {
  sku: string
  fast: number
  slow: number
}

const summaryCards: SummaryCard[] = [
  {
    title: "Total SKU Aktif",
    value: "1.284",
    trend: "up",
    trendLabel: "+5% dari minggu lalu",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-lg bg-sky-50 ring-1 ring-inset ring-sky-200">
        <svg viewBox="0 0 24 24" className="size-5 text-sky-700" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </div>
    ),
  },
  {
    title: "Barang Masuk (Inbound)",
    value: "3.420",
    trend: "up",
    trendLabel: "+12% dari minggu lalu",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-inset ring-emerald-200">
        <svg viewBox="0 0 24 24" className="size-5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M4 20h16" />
        </svg>
      </div>
    ),
  },
  {
    title: "Pesanan Diproses (Outbound)",
    value: "186",
    trend: "up",
    trendLabel: "+3% dari minggu lalu",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-inset ring-indigo-200">
        <svg viewBox="0 0 24 24" className="size-5 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 7h10v10H7z" />
          <path d="M4 10V6a2 2 0 0 1 2-2h4" />
          <path d="M20 14v4a2 2 0 0 1-2 2h-4" />
        </svg>
      </div>
    ),
  },
  {
    title: "Stok Menipis",
    value: "23",
    trend: "down",
    trendLabel: "-2% dari minggu lalu",
    emphasis: "danger",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50 ring-1 ring-inset ring-orange-200">
        <svg viewBox="0 0 24 24" className="size-5 text-orange-700" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 4.9 2.6 19.2A1.5 1.5 0 0 0 3.9 21h16.2a1.5 1.5 0 0 0 1.3-2.2L13.7 4.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>
    ),
  },
]

const barRows: BarRow[] = [
  { sku: "SKU-1001", fast: 88, slow: 22 },
  { sku: "SKU-1005", fast: 72, slow: 35 },
  { sku: "SKU-1020", fast: 64, slow: 18 },
  { sku: "SKU-1042", fast: 52, slow: 44 },
  { sku: "SKU-1088", fast: 41, slow: 56 },
  { sku: "SKU-1103", fast: 30, slow: 70 },
]

const activities: Activity[] = [
  { time: "10:30", message: "Penerimaan 500 Kardus dari PT A", type: "inbound" },
  { time: "09:15", message: "Picking Order DO-001 selesai", type: "outbound" },
  { time: "08:40", message: "Put-away selesai: ZA-02-04 → ZA-03-01", type: "stock" },
  { time: "08:10", message: "Outbound OB-202311-016 dialokasikan", type: "outbound" },
  { time: "07:55", message: "Stok menipis terdeteksi: FG-0102 (Bin ZB-02-04)", type: "stock" },
]

function TrendBadge({ trend, label }: { trend: Trend; label: string }) {
  const styles =
    trend === "up"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-red-50 text-red-700 ring-red-200"

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}>
      {label}
    </span>
  )
}

function ActivityDot({ type }: { type: ActivityType }) {
  const color =
    type === "inbound"
      ? "bg-emerald-500"
      : type === "outbound"
        ? "bg-indigo-500"
        : "bg-orange-500"

  return <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${color}`} />
}

export default function DashboardIndex() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600">
            Ringkasan performa gudang dan pergerakan stok Anda hari ini.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
        >
          Hari Ini · 7 Hari Terakhir
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              {c.icon}
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">{c.title}</div>
                <div
                  className={
                    c.emphasis === "danger"
                      ? "mt-2 text-3xl font-extrabold tracking-tight text-orange-700"
                      : "mt-2 text-3xl font-extrabold tracking-tight text-gray-900"
                  }
                >
                  {c.value}
                </div>
                <div className="mt-2">
                  <TrendBadge trend={c.trend} label={c.trendLabel} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Fast vs Slow Moving Items</h2>
                  <p className="mt-1 text-xs text-gray-600">
                    Mockup visual per SKU (Fast: biru, Slow: abu-abu)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full bg-sky-500" />
                    Fast Moving
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full bg-gray-300" />
                    Slow Moving
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {barRows.map((r) => (
                  <div key={r.sku} className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-3">
                      <div className="text-sm font-semibold text-gray-900">{r.sku}</div>
                      <div className="mt-0.5 text-xs text-gray-600">Pergerakan 7 hari</div>
                    </div>
                    <div className="col-span-9">
                      <div className="flex h-10 items-center gap-2">
                        <div className="flex-1 rounded-lg bg-gray-100 p-1">
                          <div className="flex h-8 items-center gap-1.5">
                            <div className="h-8 rounded-md bg-sky-500" style={{ width: `${r.fast}%` }} />
                            <div className="h-8 rounded-md bg-gray-300" style={{ width: `${r.slow}%` }} />
                          </div>
                        </div>
                        <div className="w-20 text-right text-xs font-semibold text-gray-700">
                          {r.fast}/{r.slow}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-semibold text-gray-900">Insight Cepat</div>
                <div className="mt-1 text-sm text-gray-700">
                  SKU dengan fast moving tinggi diprioritaskan untuk replenishment dan slotting dekat area picking.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Aktivitas Terakhir</h2>
              <p className="mt-1 text-xs text-gray-600">Log inbound, outbound, dan pergerakan stok</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {activities.map((a, idx) => (
                  <div key={`${a.time}-${idx}`} className="flex items-start gap-3">
                    <ActivityDot type={a.type} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-600">{a.time}</div>
                      <div className="mt-0.5 text-sm font-semibold text-gray-900">{a.message}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
              >
                Lihat Semua Aktivitas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
