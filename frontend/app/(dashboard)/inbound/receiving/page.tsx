"use client";
import { useState } from "react";
import { toast } from "sonner";
import { WmsService } from "@/services/wms.service";
import { useStore } from "@/store/useStore";
import { useMutation } from "@tanstack/react-query";

export default function ReceivingPage() {
  const tenantName = useStore((state) => state.tenantName); // Note: Should ideally be tenant_id, but using tenantName as proxy if auth isn't fully returning tenantId yet. For now let's use a dummy tenantId or the one from store.
  // We need to fetch product list ideally, but for now we'll hardcode or use simple inputs
  const [poNumber, setPoNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [productId, setProductId] = useState(""); // Dummy for now
  const [quantity, setQuantity] = useState("");

  const receivingMutation = useMutation({
    mutationFn: WmsService.receiving,
    onSuccess: () => {
      toast.success("Data penerimaan barang (Receiving) berhasil disimpan!");
      setPoNumber("");
      setSupplier("");
      setArrivalDate("");
      setProductId("");
      setQuantity("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || "Terjadi kesalahan saat menyimpan");
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity) {
      toast.error("Product ID dan Quantity wajib diisi");
      return;
    }
    // Asumsikan kita punya tenant_id di localStorage atau dari user object.
    // Karena saat ini login tidak menyimpan tenantId secara eksplisit di store, 
    // kita gunakan "dummy-tenant" atau tenantName untuk keperluan demo.
    const tenant_id = localStorage.getItem("tenant_id") || "T-001"; // Sebaiknya ambil dari auth user info

    receivingMutation.mutate({
      tenant_id,
      product_id: productId,
      quantity: Number(quantity),
      po_number: poNumber,
      supplier_name: supplier,
      arrival_date: arrivalDate,
      inspection_status: "GOOD",
      unloading_status: "DONE"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receiving (Barang Masuk)</h1>
          <p className="text-gray-500 text-sm">Catat penerimaan barang dari PO atau Supplier.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor PO / Surat Jalan</label>
              <input 
                type="text" 
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Contoh: PO-202310..." 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier / Pengirim</label>
              <input 
                type="text" 
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Nama PT/Supplier" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Terima</label>
              <input 
                type="date" 
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Detail Item Diterima</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product ID (SKU UUID)</label>
                <input 
                  type="text" 
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Masukkan ID Produk dari database" 
                  required 
                />
                <p className="text-xs text-gray-500 mt-1">Harus ID produk valid di DB tenant ini</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity Diterima</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Jumlah aktual" 
                  min="1"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition">Batal</button>
            <button 
              type="submit" 
              disabled={receivingMutation.isPending}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {receivingMutation.isPending ? "Menyimpan..." : "Simpan & Generate Put-Away"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
