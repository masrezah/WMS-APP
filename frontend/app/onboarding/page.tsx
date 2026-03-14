"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

export default function OnboardingPage() {
  const [warehouseName, setWarehouseName] = useState("");
  const setTenantName = useStore((state) => state.setTenantName);
  const setIsOnboarded = useStore((state) => state.setIsOnboarded);
  const router = useRouter();

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (warehouseName) {
      setTenantName(warehouseName);
      setIsOnboarded(true);
      toast.success(`Gudang "${warehouseName}" berhasil disetup!`);
      router.push("/dashboard"); 
    } else {
      toast.error("Nama gudang tidak boleh kosong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Setup Gudang Pertama</h2>
        <p className="text-center text-gray-500 mb-8">
          Mulai kelola inventaris Anda dengan membuat gudang (Tenant) pertama Anda.
        </p>
        <form onSubmit={handleSetup} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nama Gudang / Cabang</label>
            <input 
              type="text" 
              value={warehouseName} 
              onChange={(e) => setWarehouseName(e.target.value)} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:border-blue-500 focus:ring-blue-500" 
              placeholder="Contoh: Gudang Utama Jakarta" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-md hover:bg-green-700 transition"
          >
            Buat Gudang & Lanjut
          </button>
        </form>
      </div>
    </div>
  );
}
