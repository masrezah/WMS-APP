"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { WmsService } from "@/services/wms.service"

type StockValidation = "Tersedia" | "Stok Kurang" | "Belum Dicek"

type OutboundItem = {
  productId: string
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

// Mock Data untuk order yang masuk (seharusnya dari API GET Orders)
const mockOrders: OutboundOrder[] = [
  {
    id: "OB-202311-014",
    customer: "PT Sinar Jaya Abadi",
    orderDate: "2026-03-12",
    items: [
      { productId: "p-1", sku: "FG-0102", name: "Botol 600ml", qty: 48 },
    ],
    validation: "Belum Dicek",
  },
]

function ValidationBadge({ status }: { status: StockValidation }) {
  const styles = {
    Tersedia: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "Stok Kurang": "bg-red-50 text-red-700 ring-red-200",
    "Belum Dicek": "bg-gray-50 text-gray-700 ring-gray-200",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function OutboundOrdersPage() {
  const [orders, setOrders] = useState<OutboundOrder[]>(mockOrders);

  const checkMutation = useMutation({
    mutationFn: async ({ tenantId, productId }: { tenantId: string, productId: string }) => {
      return WmsService.checkOrder(tenantId, productId);
    },
    onSuccess: (data, variables) => {
      // Dummy logic to update the local state validation
      setOrders(prev => prev.map(o => {
        const hasItem = o.items.find(i => i.productId === variables.productId);
        if (hasItem) {
          const isEnough = data.total_stock >= hasItem.qty;
          return { ...o, validation: isEnough ? "Tersedia" : "Stok Kurang" };
        }
        return o;
      }));
      toast.success(`Stok tersedia: ${data.total_stock}`);
    },
    onError: (error: any) => {
      toast.error("Gagal cek stok");
    }
  });

  const pickMutation = useMutation({
    mutationFn: WmsService.pickOrder,
    onSuccess: (data) => {
      toast.success("Alokasi Picking berhasil!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal alokasi");
    }
  });

  const handleCheckStock = (order: OutboundOrder) => {
    const tenant_id = localStorage.getItem("tenant_id") || "T-001";
    order.items.forEach(item => {
      checkMutation.mutate({ tenantId: tenant_id, productId: item.productId });
    });
  };

  const handleAllocate = (order: OutboundOrder) => {
    const tenant_id = localStorage.getItem("tenant_id") || "T-001";
    // We only take the first item for demo
    const item = order.items[0];
    if (!item) return;

    pickMutation.mutate({
      tenant_id,
      product_id: item.productId,
      required_quantity: item.qty,
      strategy: "FIFO" // default
    });
  };

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
                      {o.validation === "Belum Dicek" ? (
                        <button
                          onClick={() => handleCheckStock(o)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Cek Stok
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAllocate(o)}
                          disabled={!canAllocate || pickMutation.isPending}
                          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                            canAllocate
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "cursor-not-allowed bg-gray-100 text-gray-400"
                          }`}
                        >
                          {pickMutation.isPending ? "Allocating..." : "Alokasikan (Pick)"}
                        </button>
                      )}
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
