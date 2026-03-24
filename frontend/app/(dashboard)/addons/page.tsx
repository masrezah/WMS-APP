"use client";

import React, { useState } from "react";
import { 
  Boxes, 
  Map as MapIcon, 
  Calculator, 
  Barcode, 
  Laptop, 
  Settings2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

type ModuleStatus = "active" | "inactive" | "coming_soon";

interface AddonModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ModuleStatus;
  category: string;
}

const ADDON_MODULES: AddonModule[] = [
  {
    id: "inventory-valuation",
    name: "Akuntansi & Valuasi Persediaan",
    description: "Hitung HPP menggunakan metode FIFO, LIFO, atau Moving Average secara otomatis.",
    icon: <Calculator className="w-6 h-6 text-blue-500" />,
    status: "active",
    category: "Finance & Accounting"
  },
  {
    id: "layout-routing",
    name: "Layouting & Rute Material",
    description: "Validasi kapasitas lorong dan penentuan rute Forklift/Truk berdasarkan jarak minimum.",
    icon: <MapIcon className="w-6 h-6 text-emerald-500" />,
    status: "inactive",
    category: "Warehouse Operations"
  },
  {
    id: "barcode-automation",
    name: "Barcode & Mobile Automation",
    description: "Pembuatan otomatis Barcode/QR Code untuk rak dan palet dengan dukungan RF Scanner.",
    icon: <Barcode className="w-6 h-6 text-indigo-500" />,
    status: "coming_soon",
    category: "Automation"
  },
  {
    id: "erp-integration",
    name: "Integrasi ERP Pihak Ketiga",
    description: "Sambungkan WMS ke SAP, Oracle, Odoo, atau Software Akuntansi lokal.",
    icon: <Settings2 className="w-6 h-6 text-orange-500" />,
    status: "coming_soon",
    category: "Integrations"
  }
];

import { useStore } from "@/store/useStore";

export default function AddonsPage() {
  const activeModules = useStore(state => state.activeModules) || [];
  const toggleAddon = useStore(state => state.toggleAddon);

  const modules = ADDON_MODULES.map(mod => {
    if (mod.status === "coming_soon") return mod;
    return {
      ...mod,
      status: activeModules.includes(mod.id) ? "active" : "inactive"
    } as AddonModule;
  });

  const toggleModule = (id: string, currentStatus: ModuleStatus) => {
    if (currentStatus === "coming_soon") return;
    toggleAddon(id);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Boxes className="w-8 h-8 text-blue-600" />
            Modul Tambahan (Add-ons)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Kelola dan kustomisasi fitur spesifik (Modul Pisahan) untuk disesuaikan dengan kebutuhan alur kerja gudang Anda.
          </p>
        </div>
      </div>

      {/* Grid Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div 
            key={mod.id} 
            className={`relative group bg-white dark:bg-gray-800 rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg ${
              mod.status === 'active' 
                ? 'border-blue-200 dark:border-blue-900 shadow-sm' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {mod.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {mod.category}
                  </span>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => toggleModule(mod.id, mod.status)}
                disabled={mod.status === "coming_soon"}
                className={`transition-colors focus:outline-none ${mod.status === "coming_soon" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {mod.status === "active" ? (
                  <ToggleRight className="w-10 h-10 text-blue-600" />
                ) : mod.status === "inactive" ? (
                  <ToggleLeft className="w-10 h-10 text-gray-400" />
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                    Segera Hadir
                  </span>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {mod.description}
            </p>

            {/* Active Indicator Strip */}
            {mod.status === "active" && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-2xl"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
