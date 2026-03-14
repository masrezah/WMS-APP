"use client";
import { toast } from "sonner";
import Link from "next/link";

export default function PutAwayPage() {
  const handleConfirm = () => {
    toast.success("Barang berhasil diletakkan di rak!");
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
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-dashed border-blue-300 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-2">Scan Barcode Pallet / Rak</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-center text-lg" 
              placeholder="|| |||| ||||| ||" 
              autoFocus 
            />
            <button className="bg-blue-100 px-4 rounded-lg text-blue-700 text-xl border border-blue-200">
              📷
            </button>
          </div>
        </div>

        {/* Task Card */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-5 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
            PUT-AWAY TASK
          </div>
          <h3 className="font-bold text-gray-800 mt-2">Kardus Packing Medium</h3>
          <p className="text-xs text-gray-500 mb-3">SKU-1001</p>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600 font-medium">Qty: <span className="text-lg font-black text-gray-800">500 Pcs</span></span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold">Pallet P-092</span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-yellow-200 text-center shadow-inner">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Target Lokasi (Bin)</p>
            <p className="text-4xl font-black text-blue-700 tracking-wider">A-01-R2-L1</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <button 
          onClick={handleConfirm} 
          className="w-full py-4 bg-green-600 text-white font-black text-lg rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition flex justify-center items-center gap-2"
        >
          ✓ KONFIRMASI LOKASI
        </button>
      </div>
    </div>
  );
}
