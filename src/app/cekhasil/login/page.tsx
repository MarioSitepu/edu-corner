"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoWebp from "../../logo.webp";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cek apakah sudah login
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const result = await response.json();
      if (result.authenticated) {
        router.push("/cekhasil");
      }
    } catch (err) {
      // Belum login, tetap di halaman login
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/cekhasil");
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[#FFE4E9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Fun Floating Shapes */}
        <div className="absolute top-1/4 left-[5%] w-16 h-16 bg-purple-300/30 rounded-lg rotate-12 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-[10%] w-12 h-12 bg-yellow-300/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-[15%] w-20 h-20 bg-green-300/30 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
        <div className="absolute top-[60%] right-[5%] w-14 h-14 bg-pink-300/35 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        
        {/* Star shapes */}
        <div className="absolute top-[15%] right-[20%] text-4xl opacity-20 animate-pulse" style={{ animationDuration: '2s' }}>⭐</div>
        <div className="absolute bottom-[20%] right-[15%] text-3xl opacity-20 animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.5s' }}>✨</div>
        <div className="absolute top-[45%] left-[8%] text-3xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🌟</div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in border border-pink-100">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FFB6C1] via-[#FFC0CB] to-[#FFD4E5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src={logoWebp}
                  alt="Logo EduCorner: SahabatMimpi"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#AD1457] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Admin Login
            </h1>
            <p className="text-[#C2185B] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              EduCorner:SahabatMimpi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-bold text-[#AD1457] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F8BBD0]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-[#F8BBD0] focus:ring-2 focus:ring-[#FCE4EC] bg-white text-[#2D2D2D] transition-all placeholder:text-gray-400"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  placeholder="Nama Admin"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-[#AD1457]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Password
                </label>
                <a
                  href="/cekhasil/login/forgot-password"
                  className="text-sm text-[#F06292] hover:text-[#C2185B] transition-colors font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F8BBD0]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21ZM16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-[#F8BBD0] focus:ring-2 focus:ring-[#FCE4EC] bg-white text-[#2D2D2D] transition-all placeholder:text-gray-400"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  placeholder="Kata Sandi"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] hover:from-[#F48FB1] hover:to-[#F8BBD0] text-[#AD1457] font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-pink-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span>
                  Masuk
                </span>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#C2185B] hover:text-[#AD1457] text-sm font-semibold transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L2.29289 11.2929L1.58579 12L2.29289 12.7071L3 12ZM21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11V13ZM8.29289 5.29289L2.29289 11.2929L3.70711 12.7071L9.70711 6.70711L8.29289 5.29289ZM2.29289 12.7071L8.29289 18.7071L9.70711 17.2929L3.70711 11.2929L2.29289 12.7071ZM3 13H21V11H3V13Z" fill="currentColor"/>
              </svg>
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer - positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
        </p>
      </div>
    </div>
  );
}
