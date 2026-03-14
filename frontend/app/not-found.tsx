import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-6">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
