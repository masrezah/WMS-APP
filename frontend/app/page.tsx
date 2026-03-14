import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-blue-900">WMS SaaS Platform</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Sistem manajemen gudang pintar untuk memantau stok, inboud, dan outbound dengan mudah dan efisien.
      </p>
      <div className="space-x-4">
        <Link href="/auth/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Login
        </Link>
        <Link href="/onboarding" className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition">
          Coba Gratis / Onboarding
        </Link>
      </div>
    </div>
  );
}
