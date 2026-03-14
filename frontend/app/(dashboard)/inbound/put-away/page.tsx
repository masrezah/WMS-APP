"use client";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { WmsService } from "@/services/wms.service";
import { useMutation } from "@tanstack/react-query";

export default function PutAwayPage() {
  const [productId, setProductId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");

  const putAwayMutation = useMutation({
    mutationFn: WmsService.putAway,
    onSuccess: () => {
      toast.success("Barang berhasil diletakkan di rak!");
      setProductId("");
      setLocationId("");
      setQuantity("");
      setBatchNo("");
      setCostPerUnit("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || "Gagal put-away");
    }
  });

  const handleConfirm = () => {
    if (!productId || !locationId || !quantity || !costPerUnit) {
      toast.error("Semua field wajib diisi");
      return;
    }
    const tenant_id = localStorage.getItem("tenant_id") || "T-001";
    putAwayMutation.mutate({
      tenant_id,
      product_id: productId,
      location_id: locationId,
      quantity: Number(quantity),
      batch_no: batchNo,
      cost_per_unit: Number(costPerUnit)
    });
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-[85vh] flex flex-col border-x-4 border-gray-800 shadow-2xl relative rounded-3xl overflow-hidden">
      {/* Header Ala PDA */}
      <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-blue-200 hover:text-white">← Keluar</Link>
        <h1 className="text-lg font-bold">WMS Scanner UI</h1>
        <span className="text-xs bg-red-500 px-2 py-1 rounded animate-pulse">REC</span>
      </div>
      
      <div className="p-4 flex-1 space-y-4 overflow-auto">
        {/* Scanner Input Area */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-dashed border-blue-300 text-center space-y-3">
          <p className="text-sm font-semibold text-gray-600">Form Put-Away</p>
          <input 
            type="text" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
            placeholder="Product ID (UUID)" 
          />
          <input 
            type="text" 
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
            placeholder="Target Location ID (UUID)" 
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm" 
              placeholder="Qty" 
            />
            <input 
              type="number" 
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm" 
              placeholder="Cost/Unit" 
            />
          </div>
          <input 
            type="text" 
            value={batchNo}
            onChange={(e) => setBatchNo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
            placeholder="Batch No (Opsional)" 
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <button 
          onClick={handleConfirm} 
          disabled={putAwayMutation.isPending}
          className="w-full py-4 bg-green-600 text-white font-black text-lg rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {putAwayMutation.isPending ? "Menyimpan..." : "✓ KONFIRMASI LOKASI"}
        </button>
      </div>
    </div>
  );
}
