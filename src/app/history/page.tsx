"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HistoryItem {
  id: number;
  nama: string;
  cita_cita: string;
  kelas?: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data");
      const result = await response.json();

      if (result.success) {
        setHistory(result.data);
      } else {
        setError("Gagal mengambil data history");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Gagal mengambil data history");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#FFF5F5] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
            Cek Petualanganmu
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Lihat semua hasil tes cita-cita yang pernah kamu lakukan
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#4A4A4A] hover:text-[#2D2D2D] font-medium transition-colors"
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
            Kembali ke Beranda
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
            <p className="mt-4 text-[#4A4A4A]">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchHistory}
              className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : history.length === 0 ? (
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
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Belum Ada History</h2>
            <p className="text-[#4A4A4A] mb-6">
              Mulai petualanganmu dengan mengikuti tes cita-cita!
            </p>
            <Link
              href="/kuis"
              className="inline-block bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Mulai Tes Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#FFB6C1] rounded-full flex items-center justify-center font-bold text-[#FF69B4] text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2D2D2D]">{item.nama}</h3>
                        {item.kelas && (
                          <p className="text-sm text-[#4A4A4A]">Kelas {item.kelas}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-13 mt-3">
                      <p className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1">
                        Cita-Cita
                      </p>
                      <p className="text-2xl font-bold text-[#2D2D2D]">{item.cita_cita}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6B6B6B] mb-1">Tanggal Tes</p>
                    <p className="text-sm font-medium text-[#4A4A4A]">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        {history.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/kuis"
              className="inline-block bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Coba Tes Lagi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
