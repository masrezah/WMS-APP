"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const isOnboarded = useStore((state) => state.isOnboarded);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsAuthenticated(true);
      toast.success("Login berhasil!");
      
      if (isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else {
      toast.error("Gagal! Mohon isi email dan password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Masuk ke WMS</h2>
          <p className="text-sm text-gray-500 mt-2">Masukkan kredensial Anda untuk melanjutkan</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:border-blue-500 focus:ring-blue-500" 
              placeholder="admin@gudang.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:border-blue-500 focus:ring-blue-500" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
