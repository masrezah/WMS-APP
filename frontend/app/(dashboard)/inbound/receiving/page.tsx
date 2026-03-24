"use client";

import React, { useState } from "react";
import { BarcodeScanner } from "@/components/ui/barcode-scanner";
import { Boxes, CheckCircle2, ArrowDownToLine } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ReceivingPage() {
  const role = useStore((state) => state.role);
  const [scannedSku, setScannedSku] = useState<string | null>(null);

  // RBAC Proteksi Route Dasar beserta fallback (admin / operator) untuk user yang localStorage-nya belum keraseret ke enum baru
  const isAllowed = ['SUPER_ADMIN', 'TENANT_ADMIN', 'PURCHASING', 'WAREHOUSE_OPERATOR', 'admin', 'operator'].includes(role);

  if (!isAllowed) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-20 border border-red-200 bg-red-50 rounded-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak (403)</h2>
        <p className="text-red-700">Halaman ini hanya dapat diakses oleh Tim Gudang (Warehouse Operator) atau Admin.</p>
      </div>
    );
  }

  const handleScanSuccess = (decodedText: string) => {
    // Bunyikan suara beep jika di HP (opsional)
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
    setScannedSku(decodedText);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <ArrowDownToLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Penerimaan Barang (Inbound)</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Scan barcode atau QR Code untuk menerima persediaan ke Gudang secara otomatis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <BarcodeScanner 
            title="Kamera Scanner (Operator)" 
            onScanSuccess={handleScanSuccess} 
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-锌-100 mb-4 border-b pb-2">Informasi Scan</h3>
          
          {scannedSku ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex gap-3 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">SKU Berhasil Dipindai</p>
                  <p className="text-xl font-mono mt-1 font-bold">{scannedSku}</p>
                </div>
              </div>

              {/* Form simulasi put-away otomatis */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Input Kuantitas (Qty)</label>
                  <input type="number" defaultValue="1" className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <button className="w-full py-2.5 bg-gray-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-md font-semibold mt-4 shadow hover:bg-gray-800 transition-colors">
                  Konfirmasi Pemasukan Database
                </button>
                <button onClick={() => setScannedSku(null)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  Reset & Scan Ulang
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-lg outline-dashed outline-2 outline-gray-200 dark:outline-zinc-800 outline-offset-4">
              <Boxes className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-3" />
              <p className="text-gray-500 dark:text-zinc-400 font-medium">Belum ada item yang di-scan.</p>
              <p className="text-xs text-gray-400 mt-1">Arahkan kamera ke barcode produk fisik Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
