import { DashboardChart } from "@/components/dashboard-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownToLine, ArrowUpFromLine, Box } from "lucide-react"

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
      <div className="flex size-10 items-center justify-center rounded-lg bg-sky-50 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-500/20">
        <svg viewBox="0 0 24 24" className="size-5 text-sky-700 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="2">
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
      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
        <svg viewBox="0 0 24 24" className="size-5 text-emerald-700 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
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
      <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:ring-indigo-500/20">
        <svg viewBox="0 0 24 24" className="size-5 text-indigo-700 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2">
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
      <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/10 dark:ring-orange-500/20">
        <svg viewBox="0 0 24 24" className="size-5 text-orange-700 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth="2">
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
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
      : "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${styles}`}>
      {label}
    </span>
  )
}

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === "inbound") {
    return (
      <div className="flex z-10 size-7 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-white dark:ring-zinc-950 dark:bg-emerald-900/50">
        <ArrowDownToLine className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  }
  if (type === "outbound") {
    return (
      <div className="flex z-10 size-7 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-white dark:ring-zinc-950 dark:bg-indigo-900/50">
        <ArrowUpFromLine className="size-3.5 text-indigo-600 dark:text-indigo-400" />
      </div>
    )
  }
  return (
    <div className="flex z-10 size-7 items-center justify-center rounded-full bg-orange-100 ring-4 ring-white dark:ring-zinc-950 dark:bg-orange-900/50">
      <Box className="size-3.5 text-orange-600 dark:text-orange-400" />
    </div>
  )
}

export default function DashboardIndex() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            Ringkasan performa gudang dan pergerakan stok Anda hari ini.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Hari Ini · 7 Hari Terakhir
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.title} className="p-4 shadow-sm border-gray-200 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-center">
            <div className="flex items-start gap-4">
              {c.icon}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-600 dark:text-zinc-400">{c.title}</div>
                <div
                  className={
                    c.emphasis === "danger"
                      ? "mt-1 text-3xl font-extrabold tracking-tight text-orange-700 dark:text-orange-500"
                      : "mt-1 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50"
                  }
                >
                  {c.value}
                </div>
                <div className="mt-2.5">
                  <TrendBadge trend={c.trend} label={c.trendLabel} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full border-gray-200 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800/60 pb-4">
              <CardTitle className="text-base font-semibold">Aktivitas Terakhir</CardTitle>
              <CardDescription className="text-xs">Log inbound, outbound, dan pergerakan stok</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-6 px-5 flex flex-col">
              <div className="relative border-l border-gray-100 dark:border-zinc-800 ml-3 space-y-6 flex-1">
                {activities.map((a, idx) => (
                  <div key={`${a.time}-${idx}`} className="relative pl-6">
                    <div className="absolute -left-3.5 top-0 flex items-center justify-center">
                      <ActivityIcon type={a.type} />
                    </div>
                    <div className="flex flex-col min-w-0 pb-1">
                      <div className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-zinc-500 mb-0.5">{a.time}</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-zinc-200 leading-snug">{a.message}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-auto">
                <button
                  type="button"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Lihat Semua Aktivitas
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
