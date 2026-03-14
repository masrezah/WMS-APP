"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">500 - Terjadi Kesalahan</h1>
      <p className="text-gray-600 mb-6">Maaf, sistem mengalami gangguan internal. Tim kami sedang menanganinya.</p>
      <button 
        onClick={() => reset()}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Coba Lagi
      </button>
    </div>
  );
}
