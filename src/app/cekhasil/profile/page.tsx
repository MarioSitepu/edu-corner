"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminProfile {
  username: string;
  email: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const result = await response.json();
      if (result.authenticated) {
        setAuthenticated(true);
        fetchProfile();
      } else {
        router.push("/cekhasil/login");
      }
    } catch (err) {
      router.push("/cekhasil/login");
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/profile");
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        setProfile(result.data);
        setError("");
      } else {
        setError(result.error || "Gagal mengambil profil");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      const errorMessage = err.message || "Gagal mengambil profil";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/cekhasil/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F9] to-[#FFF5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
          <p className="mt-4 text-[#4A4A4A]">Memverifikasi autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F9] to-[#FFF5F5] py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-2">
              Profil Admin
            </h1>
            <p className="text-lg text-[#4A4A4A]">
              Informasi akun admin Anda
            </p>
          </div>
          
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <Link
              href="/cekhasil"
              className="inline-flex items-center gap-2 text-[#4A4A4A] hover:text-[#2D2D2D] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Kembali ke Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
            <p className="mt-4 text-[#4A4A4A]">Memuat profil...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-500"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">Terjadi Kesalahan</h2>
            <p className="text-red-500 mb-6 text-sm">{error}</p>
            <button
              onClick={fetchProfile}
              className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Coba Lagi
            </button>
          </div>
        ) : profile ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] px-8 py-12 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#FF4D6D]"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin</h2>
              <p className="text-white/90">EduCorner: SahabatMimpi</p>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Username */}
                <div className="border-b border-gray-200 pb-6">
                  <label className="block text-sm font-semibold text-[#666666] mb-2 uppercase tracking-wide">
                    Username
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#F9FAFB] rounded-xl px-4 py-3 border-2 border-gray-200">
                      <p className="text-lg font-semibold text-[#2D2D2D]">{profile.username}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-600"
                      >
                        <path
                          d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="border-b border-gray-200 pb-6">
                  <label className="block text-sm font-semibold text-[#666666] mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#F9FAFB] rounded-xl px-4 py-3 border-2 border-gray-200">
                      <p className="text-lg font-semibold text-[#2D2D2D]">{profile.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-600"
                      >
                        <path
                          d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Informasi</h3>
                      <p className="text-sm text-blue-700">
                        Username dan email ini digunakan untuk login dan reset password. 
                        Untuk mengubah email, silakan hubungi administrator sistem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
