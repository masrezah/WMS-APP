export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Gudang</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">
          + Tambah Cabang
        </button>
      </div>

      {/* Empty State Illustration */}
      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada gudang cabang</h3>
        <p className="text-gray-500 max-w-md mb-6">
          Anda saat ini hanya menggunakan satu gudang utama (Tenant Default). Tambahkan gudang cabang baru jika Anda memiliki lebih dari satu fasilitas penyimpanan.
        </p>
        <button className="px-6 py-2 border-2 border-dashed border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 font-medium">
          Daftarkan Gudang Baru
        </button>
      </div>
    </div>
  );
}
