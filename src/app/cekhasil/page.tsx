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

interface CareerExplanation {
  id: number;
  cita_cita: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

type TabType = 'edu_corner' | 'career_explanations';
type SortField = 'id' | 'nama' | 'kelas' | 'cita_cita' | 'created_at' | 'updated_at' | 'explanation';
type SortOrder = 'asc' | 'desc';

export default function CekHasilPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [careerExplanations, setCareerExplanations] = useState<CareerExplanation[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('edu_corner');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Reset search term and sorting when tab changes
  useEffect(() => {
    setSearchTerm("");
    setSortField(activeTab === 'edu_corner' ? 'created_at' : 'updated_at');
    setSortOrder('desc');
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const result = await response.json();
      if (result.authenticated) {
        setAuthenticated(true);
        fetchAllData();
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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/all-data");
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        setHistory(result.data.edu_corner || []);
        setCareerExplanations(result.data.career_explanations || []);
        setError("");
      } else {
        setError(result.error || "Gagal mengambil data");
      }
    } catch (err: any) {
      console.error("Error fetching all data:", err);
      const errorMessage = err.message || "Gagal mengambil data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    // Alias untuk kompatibilitas dengan kode yang sudah ada
    await fetchAllData();
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

  const filteredCareerExplanations = careerExplanations.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.cita_cita.toLowerCase().includes(searchLower) ||
      item.explanation.toLowerCase().includes(searchLower)
    );
  });

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order jika field sama
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set field baru dan default ke ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort filtered data
  const getSortedHistory = () => {
    const sorted = [...filteredHistory];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'nama':
          aValue = a.nama.toLowerCase();
          bValue = b.nama.toLowerCase();
          break;
        case 'kelas':
          aValue = (a.kelas || '').toLowerCase();
          bValue = (b.kelas || '').toLowerCase();
          break;
        case 'cita_cita':
          aValue = a.cita_cita.toLowerCase();
          bValue = b.cita_cita.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const getSortedCareerExplanations = () => {
    const sorted = [...filteredCareerExplanations];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'cita_cita':
          aValue = a.cita_cita.toLowerCase();
          bValue = b.cita_cita.toLowerCase();
          break;
        case 'explanation':
          aValue = a.explanation.toLowerCase();
          bValue = b.explanation.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortedHistory = getSortedHistory();
  const sortedCareerExplanations = getSortedCareerExplanations();

  // Helper untuk render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 opacity-30"
        >
          <path
            d="M7 10L12 15L17 10H7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1"
      >
        <path
          d="M7 14L12 9L17 14H7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1"
      >
        <path
          d="M7 10L12 15L17 10H7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
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
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#FFB6C1] via-[#FFC0CB] to-[#FFD4E5] rounded-3xl shadow-2xl p-8 sm:p-10 mb-8 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          
          {/* Animated Sparkles */}
          <div className="absolute top-8 right-32 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute bottom-12 right-64 animate-pulse" style={{ animationDelay: '1s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/30">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#AD1457] drop-shadow-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Admin Dashboard
              </h1>
              <p className="text-[#880E4F] text-sm sm:text-base max-w-2xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                EduCorner: SahabatMimpi - Temukan potensi diri dan wujudkan mimpi langkah demi langkah.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm text-[#AD1457] font-semibold px-5 py-3 rounded-xl transition-all duration-300 border border-white/50 hover:border-white/70 hover:scale-105 shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Beranda</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-white hover:bg-white/95 text-[#C2185B] font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total Siswa */}
          <div className="bg-gradient-to-br from-[#FFE8EC] to-[#FFD4E5] rounded-2xl shadow-md p-6 relative overflow-hidden border border-[#FFB6C1]/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-8 -mt-8"></div>
            <div className="relative text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F06292]">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#AD1457] font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>TOTAL SISWA</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#C2185B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {activeTab === 'edu_corner' ? history.length : careerExplanations.length}
              </p>
            </div>
          </div>

          {/* Hasil Filter */}
          <div className="bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0] rounded-2xl shadow-md p-6 relative overflow-hidden border border-[#F06292]/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-8 -mt-8"></div>
            <div className="relative text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F06292]">
                    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#AD1457] font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>HASIL FILTER</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#C2185B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {activeTab === 'edu_corner' ? sortedHistory.length : sortedCareerExplanations.length}
              </p>
            </div>
          </div>

          {/* Cita-Cita Unik */}
          <div className="bg-gradient-to-br from-[#FFF0F3] to-[#FFE4E9] rounded-2xl shadow-md p-6 relative overflow-hidden border border-[#FFB6C1]/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-8 -mt-8"></div>
            <div className="relative text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F8BBD0]">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#AD1457] font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>CITA-CITA UNIK</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#C2185B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {activeTab === 'edu_corner' 
                  ? new Set(history.map((item) => item.cita_cita)).size
                  : history.length + careerExplanations.length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, cita-cita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-[#2D2D2D] placeholder-gray-400 focus:ring-2 focus:ring-[#FF4D6D] outline-none transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('edu_corner')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'edu_corner'
                  ? 'bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] text-[#AD1457] shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Data Siswa ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('career_explanations')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'career_explanations'
                  ? 'bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] text-[#AD1457] shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Pekerjaan ({careerExplanations.length})
            </button>
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
                onClick={fetchAllData}
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
        ) : (activeTab === 'edu_corner' && filteredHistory.length === 0) || (activeTab === 'career_explanations' && filteredCareerExplanations.length === 0) ? (
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
                : activeTab === 'edu_corner'
                ? "Belum ada hasil tes cita-cita yang tersimpan"
                : "Belum ada penjelasan pekerjaan yang tersimpan"}
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
        ) : activeTab === 'edu_corner' ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-[#F48FB1] to-[#FCE4EC] px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <button
                  onClick={() => handleSort('id')}
                  className="col-span-1 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                >
                  ID{renderSortIcon('id')}
                </button>
                <button
                  onClick={() => handleSort('nama')}
                  className="col-span-2 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                >
                  NAMA{renderSortIcon('nama')}
                </button>
                <button
                  onClick={() => handleSort('kelas')}
                  className="col-span-1 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  KELAS{renderSortIcon('kelas')}
                </button>
                <button
                  onClick={() => handleSort('cita_cita')}
                  className="col-span-3 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  CITA-CITA{renderSortIcon('cita_cita')}
                </button>
                <button
                  onClick={() => handleSort('created_at')}
                  className="col-span-2 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  TANGGAL{renderSortIcon('created_at')}
                </button>
                <div className="col-span-3 text-center">AKSI</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {sortedHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-[#FFF5F7] transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm font-semibold text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.id}
                    </div>
                    <div className="col-span-2 text-sm font-bold text-[#2D2D2D]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.nama}
                    </div>
                    <div className="col-span-1 text-sm font-semibold text-[#4A4A4A] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.kelas || "-"}
                    </div>
                    <div className="col-span-3 text-sm text-center">
                      <span className="inline-block bg-[#FCE4EC] text-[#C2185B] px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.cita_cita}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-[#666666] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="col-span-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleDownloadPDF(item)}
                        disabled={downloadingId === item.id}
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] hover:shadow-lg text-[#AD1457] font-medium px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {downloadingId === item.id ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>PDF</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-[#F06292] hover:bg-[#FCE4EC] disabled:opacity-50 disabled:cursor-not-allowed transition-all p-2 rounded-lg"
                        title="Hapus data"
                      >
                        {deletingId === item.id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Menampilkan 1-{sortedHistory.length} dari {sortedHistory.length} data
              </p>
            </div>
          </div>
        ) : (
          /* Career Explanations Tab */
          <div className="space-y-6">
            {/* Stats Cards untuk Pekerjaan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Total Penjelasan</p>
                <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>{careerExplanations.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Hasil Filter</p>
                <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>{sortedCareerExplanations.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Total Database</p>
                <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>{history.length}</p>
              </div>
            </div>

            {/* Empty State atau Data */}
            {sortedCareerExplanations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
                <div className="w-24 h-24 bg-[#FFB6C1]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#FF6B8A]"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Belum Ada Data
                </h2>
                <p className="text-gray-500 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Belum ada penjelasan pekerjaan yang tersimpan
                </p>
                <button
                  onClick={fetchAllData}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] hover:shadow-lg text-[#AD1457] font-semibold px-8 py-3 rounded-lg transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.28536 17.9845 5.27542C16.8482 4.26548 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7345 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Refresh Data
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-[#F48FB1] to-[#FCE4EC] px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <button
                      onClick={() => handleSort('id')}
                      className="col-span-1 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                    >
                      ID{renderSortIcon('id')}
                    </button>
                    <button
                      onClick={() => handleSort('cita_cita')}
                      className="col-span-2 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                    >
                      Cita-Cita{renderSortIcon('cita_cita')}
                    </button>
                    <button
                      onClick={() => handleSort('explanation')}
                      className="col-span-6 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                    >
                      Penjelasan{renderSortIcon('explanation')}
                    </button>
                    <button
                      onClick={() => handleSort('updated_at')}
                      className="col-span-2 flex items-center hover:opacity-80 transition-opacity cursor-pointer text-left"
                    >
                      Diperbarui{renderSortIcon('updated_at')}
                    </button>
                    <div className="col-span-1 text-center">Aksi</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {sortedCareerExplanations.map((item, index) => (
                    <div
                      key={item.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-1 text-sm font-medium text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.id}
                        </div>
                        <div className="col-span-2">
                          <span className="inline-block bg-[#FCE4EC] text-[#C2185B] px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {item.cita_cita}
                          </span>
                        </div>
                        <div className="col-span-6 text-sm text-[#4A4A4A] line-clamp-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.explanation}
                        </div>
                        <div className="col-span-2 text-xs text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {formatDate(item.updated_at)}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus penjelasan untuk "${item.cita_cita}"?`)) {
                                // TODO: Implement delete for career explanations
                                alert('Fitur hapus penjelasan pekerjaan akan segera tersedia');
                              }
                            }}
                            className="text-[#F06292] hover:bg-[#FCE4EC] transition-all p-2 rounded-lg"
                            title="Hapus penjelasan"
                          >
                            <svg
                              width="18"
                              height="18"
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
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Info */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Menampilkan 1-{sortedCareerExplanations.length} dari {sortedCareerExplanations.length} data
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer dengan Copyright */}
        <div className="mt-8 text-center pb-6">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
          </p>
        </div>
      </div>
    </div>
  );
}
