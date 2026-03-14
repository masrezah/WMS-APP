"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WmsService } from "@/services/wms.service";
import { toast } from "sonner";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";

export default function WarehousesPage() {
  const queryClient = useQueryClient();
  const tenant_id = typeof window !== 'undefined' ? localStorage.getItem("tenant_id") || "T-001" : "T-001";

  const { data: warehouseResponse, isLoading, isError } = useQuery({
    queryKey: ["warehouses", tenant_id],
    queryFn: () => WmsService.listWarehouses(tenant_id),
  });

  const createMutation = useMutation({
    mutationFn: WmsService.createWarehouse,
    onSuccess: () => {
      toast.success("Gudang berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["warehouses", tenant_id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambah gudang");
    }
  });

  const handleAddDemoWarehouse = () => {
    createMutation.mutate({
      tenant_id,
      name: "Gudang Cabang Baru",
      type: "Private",
      method: "FIFO",
      layout_type: "Garis Lurus Sederhana"
    });
  };

  const warehouses = warehouseResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Gudang</h1>
        <button 
          onClick={handleAddDemoWarehouse}
          disabled={createMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-50"
        >
          {createMutation.isPending ? "Menambahkan..." : "+ Tambah Cabang Demo"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          <Loader2Icon className="w-8 h-8 animate-spin mb-2 text-blue-600" />
          <p>Memuat data gudang...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-red-500 bg-white rounded-lg border border-gray-200">
          <AlertCircleIcon className="w-8 h-8 mb-2" />
          <p>Gagal memuat data gudang.</p>
        </div>
      ) : warehouses.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada gudang</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Anda belum memiliki gudang. Tambahkan gudang pertama Anda untuk mulai mengelola inventori.
          </p>
          <button 
            onClick={handleAddDemoWarehouse}
            className="px-6 py-2 border-2 border-dashed border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 font-medium"
          >
            Daftarkan Gudang Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((w: any) => (
            <div key={w.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">🏢</div>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                  {w.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{w.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{w.address || "Belum ada alamat"}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Metode</span>
                  <span className="font-medium text-gray-900">{w.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Layout</span>
                  <span className="font-medium text-gray-900">{w.layout_type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
