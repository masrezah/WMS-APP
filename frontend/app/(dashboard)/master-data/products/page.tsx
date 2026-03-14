import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Produk</h1>
          <p className="text-gray-500 text-sm">Kelola semua data barang dan SKU Anda di sini.</p>
        </div>
        <Link 
          href="/master-data/products/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Cari SKU atau nama produk..." 
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <select className="p-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Semua Kategori</option>
            <option>Raw Material</option>
            <option>Finished Good</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 border-b">SKU / Barcode</th>
                <th className="px-4 py-3 border-b">Nama Produk</th>
                <th className="px-4 py-3 border-b">Kategori</th>
                <th className="px-4 py-3 border-b">Harga Satuan</th>
                <th className="px-4 py-3 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">SKU-1001</td>
                <td className="px-4 py-3">Kardus Packing Medium</td>
                <td className="px-4 py-3"><span className="bg-gray-200 px-2 py-1 rounded text-xs">Packaging</span></td>
                <td className="px-4 py-3">Rp 5.000</td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">Edit</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">SKU-1002</td>
                <td className="px-4 py-3">Biji Plastik PET</td>
                <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Raw Material</span></td>
                <td className="px-4 py-3">Rp 15.000</td>
                <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">Edit</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Menampilkan 1-2 dari 2 produk</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Sebelumnya</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
