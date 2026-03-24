"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { toast } from "sonner";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Simple debounce for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ["products", { search: debouncedSearch, category }],
    queryFn: () => ProductService.getProducts({ 
      search: debouncedSearch || undefined, 
      category: category === "Semua Kategori" ? undefined : category || undefined 
    }),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Gagal memuat data produk", {
        description: (error as Error)?.message || "Terjadi kesalahan pada server",
      });
    }
  }, [isError, error]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "raw material":
        return <span className="bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400 px-2 py-1 rounded text-xs font-medium">Raw Material</span>;
      case "finished good":
        return <span className="bg-green-100 text-green-800 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded text-xs font-medium">Finished Good</span>;
      case "packaging":
        return <span className="bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-1 rounded text-xs font-medium">Packaging</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium">{cat}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-50">Master Produk</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">Kelola semua data barang dan SKU Anda di sini.</p>
        </div>
        <Link 
          href="/master-data/products/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition whitespace-nowrap shadow-sm"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Cari SKU atau nama produk..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-zinc-700 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 dark:border-zinc-700 rounded-md text-sm bg-white dark:bg-zinc-900 dark:text-zinc-100 outline-none focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
          >
            <option value="">Semua Kategori</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Finished Good">Finished Good</option>
            <option value="Packaging">Packaging</option>
          </select>
        </div>
        
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-zinc-400 uppercase bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU / Barcode</th>
                <th className="px-4 py-3 font-semibold">Nama Produk</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Harga Satuan</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Loader2Icon className="w-8 h-8 animate-spin mb-2 text-blue-600" />
                      <p>Memuat data produk...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-red-500">
                      <AlertCircleIcon className="w-8 h-8 mb-2" />
                      <p>Gagal memuat data. Silakan coba lagi.</p>
                    </div>
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              ) : (
                products?.map((product) => (
                  <tr key={product.id} className="bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">{product.name}</td>
                    <td className="px-4 py-3">{getCategoryBadge(product.category)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => toast.info(`Fitur edit untuk ${product.sku} segera hadir!`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-zinc-400">
          <span>
            {products ? `Menampilkan ${products.length} produk` : 'Menampilkan 0 produk'}
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              Sebelumnya
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
