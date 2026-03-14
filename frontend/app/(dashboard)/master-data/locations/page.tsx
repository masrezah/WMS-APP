export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Generator Lokasi & Label Rak</h1>
      {/* Tanda > sudah diganti jadi &gt; biar React gak bingung */}
      <p className="text-gray-500 text-sm">Buat struktur rak (Zone &gt; Aisle &gt; Rak &gt; Level &gt; Bin) dan cetak label barcodenya.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Generate Lokasi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">Mass Generate Bin</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Zona</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Contoh: A" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Jumlah Lorong (Aisle)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="1-10" />
              </div>
            </div>
            <button className="w-full py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700">
              Generate Format Lokasi
            </button>
          </div>
        </div>

        {/* Simulasi Print Label */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">Printable Barcode Label</h2>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="bg-white border-2 border-black p-4 w-48 text-center mb-4">
              <div className="text-xl font-black mb-1">A-01-R2-L1</div>
              <div className="h-10 bg-gray-800 w-full mb-1"></div> {/* Mockup Barcode */}
              <div className="text-[10px] text-gray-500">Zone A - Lorong 1 - Rak 2</div>
            </div>
            <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 flex items-center gap-2">
              🖨️ Cetak Semua Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}