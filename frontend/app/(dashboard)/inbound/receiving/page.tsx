"use client";
import { toast } from "sonner";

export default function ReceivingPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Data penerimaan barang (Receiving) berhasil disimpan!");
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
              <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: PO-202310..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier / Pengirim</label>
              <input type="text" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nama PT/Supplier" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Terima</label>
              <input type="date" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Daftar Item Diterima</h3>
              <button type="button" className="text-sm bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">+ Scan Item</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 border-b">SKU</th>
                    <th className="p-3 border-b">Nama Produk</th>
                    <th className="p-3 border-b text-center">Qty Dipesan</th>
                    <th className="p-3 border-b text-center">Qty Diterima</th>
                    <th className="p-3 border-b">Kondisi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">SKU-1001</td>
                    <td className="p-3">Kardus Packing Medium</td>
                    <td className="p-3 text-center">500</td>
                    <td className="p-3">
                      <input type="number" className="w-20 p-1.5 border rounded mx-auto block text-center" defaultValue={500} />
                    </td>
                    <td className="p-3">
                      <select className="p-1.5 border rounded text-sm w-full bg-white">
                        <option>Good</option>
                        <option>Damage</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3 font-medium">SKU-1002</td>
                    <td className="p-3">Biji Plastik PET</td>
                    <td className="p-3 text-center">1000</td>
                    <td className="p-3">
                      <input type="number" className="w-20 p-1.5 border rounded mx-auto block text-center" defaultValue={980} />
                    </td>
                    <td className="p-3">
                      <select className="p-1.5 border rounded text-sm w-full bg-white">
                        <option>Good</option>
                        <option>Damage</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">Simpan & Generate Put-Away</button>
          </div>
        </form>
      </div>
    </div>
  );
}
