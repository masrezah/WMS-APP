"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Produk berhasil ditambahkan!");
    router.push("/master-data/products");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/master-data/products" className="text-gray-500 hover:text-gray-800">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Produk Baru</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
              <input type="text" className="w-full p-2.5 border rounded-md" placeholder="Masukkan nama produk..." required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">SKU / Barcode</label>
              <div className="flex gap-2">
                <input type="text" className="w-full p-2.5 border rounded-md" placeholder="Ketik atau scan barcode..." required />
                <button type="button" className="bg-gray-100 px-3 border rounded-md hover:bg-gray-200" title="Gunakan Scanner">
                  📷
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
              <select className="w-full p-2.5 border rounded-md bg-white">
                <option>Raw Material</option>
                <option>Finished Good</option>
                <option>Packaging Material</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Link href="/master-data/products" className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Batal</Link>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan Produk</button>
          </div>
        </form>
      </div>
    </div>
  );
}
