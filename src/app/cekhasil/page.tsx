"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generatePDFFromData } from "@/lib/pdf-generator";

interface HistoryItem {
  id: number;
  nama: string;
  cita_cita: string;
  kelas?: string;
  created_at: string;
}

export default function CekHasilPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
        fetchHistory();
      } else {
        router.push("/cekhasil/login");
      }
    } catch (err) {
      router.push("/cekhasil/login");
    } finally {
      setCheckingAuth(false);
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

  const handleDownloadPDF = async (item: HistoryItem) => {
    try {
      setDownloadingId(item.id);
      
      // Fetch explanation dari API
      let explanation = '';
      try {
        const explainResponse = await fetch("/api/explain-career", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ citaCita: item.cita_cita }),
        });
        
        if (explainResponse.ok) {
          const explainResult = await explainResponse.json();
          explanation = explainResult.explanation || '';
        }
      } catch (err) {
        console.warn('Failed to fetch explanation:', err);
      }

      // Generate PDF menggunakan utility function
      await generatePDFFromData({
        nama: item.nama,
        kelas: item.kelas || '',
        citaCita: item.cita_cita,
        explanation: explanation,
        timestamp: item.created_at,
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/data");
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        setHistory(result.data || []);
        setError("");
      } else {
        setError(result.error || "Gagal mengambil data history");
      }
    } catch (err: any) {
      console.error("Error fetching history:", err);
      const errorMessage = err.message || "Gagal mengambil data history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data dengan ID ${id}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/data/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Hapus dari state
        setHistory(history.filter((item) => item.id !== id));
        alert("Data berhasil dihapus!");
      } else {
        alert(`Gagal menghapus data: ${result.error}`);
      }
    } catch (err: any) {
      console.error("Error deleting data:", err);
      alert("Terjadi kesalahan saat menghapus data");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter data berdasarkan search term
  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.nama.toLowerCase().includes(searchLower) ||
      item.cita_cita.toLowerCase().includes(searchLower) ||
      (item.kelas && item.kelas.toLowerCase().includes(searchLower))
    );
  });

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
      <div className="max-w-7xl mx-auto">
        {/* Header dengan Logout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-[#4A4A4A]">
              Kelola dan lihat semua hasil tes cita-cita siswa
            </p>
          </div>
          
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <Link
              href="/"
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
              Beranda
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#666666]"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, cita-cita, atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-[#2D2D2D] placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-[#666666] hover:text-[#2D2D2D] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-[#666666] mb-1">Total Data</div>
            <div className="text-3xl font-bold text-[#2D2D2D]">{history.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-[#666666] mb-1">Hasil Filter</div>
            <div className="text-3xl font-bold text-[#2D2D2D]">{filteredHistory.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-[#666666] mb-1">Cita-Cita Unik</div>
            <div className="text-3xl font-bold text-[#2D2D2D]">
              {new Set(history.map((item) => item.cita_cita)).size}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
            <p className="mt-4 text-[#4A4A4A]">Memuat data...</p>
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchHistory}
                className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Coba Lagi
              </button>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-[#2D2D2D] font-semibold px-6 py-3 rounded-lg transition-all text-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-[#FFB6C1] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FF69B4]"
              >
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
              {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data"}
            </h2>
            <p className="text-[#4A4A4A] mb-6">
              {searchTerm
                ? "Coba gunakan kata kunci lain untuk mencari"
                : "Belum ada hasil tes cita-cita yang tersimpan"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-block bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm">
                <div className="col-span-1">ID</div>
                <div className="col-span-2">Nama</div>
                <div className="col-span-1">Kelas</div>
                <div className="col-span-3">Cita-Cita</div>
                <div className="col-span-2">Tanggal</div>
                <div className="col-span-3 text-center">Aksi</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm font-medium text-[#666666]">
                      {item.id}
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-[#2D2D2D]">
                      {item.nama}
                    </div>
                    <div className="col-span-1 text-sm text-[#4A4A4A]">
                      {item.kelas || "-"}
                    </div>
                    <div className="col-span-3 text-sm font-medium text-[#FF4D6D]">
                      {item.cita_cita}
                    </div>
                    <div className="col-span-2 text-xs text-[#666666]">
                      {formatDate(item.created_at)}
                    </div>
                    <div className="col-span-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleDownloadPDF(item)}
                        disabled={downloadingId === item.id}
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {downloadingId === item.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
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
                            <span>Mengunduh...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Unduh PDF</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Hapus data"
                      >
                        {deletingId === item.id ? (
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
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refresh Button */}
        {!loading && !error && (
          <div className="mt-6 text-center">
            <button
              onClick={fetchHistory}
              className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
