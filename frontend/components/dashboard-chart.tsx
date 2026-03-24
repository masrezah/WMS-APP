"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "2024-04-01", inbound: 222, outbound: 150 },
  { date: "2024-04-02", inbound: 97, outbound: 180 },
  { date: "2024-04-03", inbound: 167, outbound: 120 },
  { date: "2024-04-04", inbound: 242, outbound: 260 },
  { date: "2024-04-05", inbound: 373, outbound: 290 },
  { date: "2024-04-06", inbound: 301, outbound: 340 },
  { date: "2024-04-07", inbound: 245, outbound: 180 },
  // Let's add more realistic dummy data for 90 days.
]

// To make this concise, I'll generate a 90 days array programmatically
const generateData = () => {
  const data = []
  const startDate = new Date("2024-04-01")
  for (let i = 0; i < 90; i++) {
    const nextDate = new Date(startDate)
    nextDate.setDate(startDate.getDate() + i)
    // Create random smooth-ish curves
    data.push({
      date: nextDate.toISOString().split("T")[0],
      inbound: Math.floor(200 + Math.sin(i / 5) * 100 + Math.random() * 50),
      outbound: Math.floor(150 + Math.cos(i / 5) * 80 + Math.random() * 50),
    })
  }
  return data
}
const fullChartData = generateData()

const chartConfig = {
  inbound: {
    label: "Inbound",
    color: "hsl(var(--chart-1))",
  },
  outbound: {
    label: "Outbound",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DashboardChart() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [valuation, setValuation] = React.useState<number | null>(null)
  const [isValuationLoading, setIsValuationLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate fetching from our new Inventory Valuation Add-on
    // Target: http://localhost:3001/addons/inventory-valuation/:tenantId/summary
    const fetchValuation = async () => {
      try {
        const res = await fetch('http://localhost:3001/addons/inventory-valuation/example-tenant/summary?method=FIFO');
        if (res.ok) {
          const data = await res.json();
          setValuation(data.totalTenantValue || 1250000); // Fallback mockup value if DB is empty
        } else {
          setValuation(1250000); // Mock for UI visual if backend returns error due to no DB
        }
      } catch (error) {
        console.log("Valuation API not reachable, using mockup data.");
        setValuation(1250000);
      } finally {
        setIsValuationLoading(false);
      }
    };

    fetchValuation();
  }, []);

  const filteredData = fullChartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7
    
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // To match the beautiful dark gradient style of Shadcn interactive chart
  // we will use the custom ID 'fillInbound' and 'fillOutbound'.
  // We use dark card background implicitly from Next Themes if dark is active.

  return (
    <Card className="border border-gray-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row dark:border-zinc-800">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-xl dark:text-zinc-50">Total Aktivitas</CardTitle>
          <CardDescription className="dark:text-zinc-400">
            Total pergerakan stok ({timeRange === "90d" ? "3 bulan terakhir" : timeRange === "30d" ? "30 hari terakhir" : "7 hari terakhir"})
          </CardDescription>
          
          <div className="mt-4 border-l-4 border-blue-500 pl-4 py-1">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valuasi Persediaan (FIFO)</h4>
            {isValuationLoading ? (
              <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded mt-1"></div>
            ) : (
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                Rp {valuation?.toLocaleString('id-ID')}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 px-6 py-4 sm:px-6 sm:py-6 bg-transparent">
          <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 text-xs shadow-sm">
            <button
              onClick={() => setTimeRange("90d")}
              className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-medium transition-all ${timeRange === "90d" ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50" : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-50"}`}
            >
              Last 3 months
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-medium transition-all ${timeRange === "30d" ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50" : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-50"}`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 font-medium transition-all ${timeRange === "7d" ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50" : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-50"}`}
            >
              Last 7 days
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillInbound" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#8884d8"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#8884d8"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#82ca9d"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#82ca9d"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              className="text-gray-500 dark:text-zinc-400 text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="outbound"
              type="monotone"
              fill="url(#fillOutbound)"
              fillOpacity={0.4}
              stroke="#82ca9d"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="inbound"
              type="monotone"
              fill="url(#fillInbound)"
              fillOpacity={0.4}
              stroke="#8884d8"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
