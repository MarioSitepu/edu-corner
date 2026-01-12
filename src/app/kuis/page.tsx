"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface QuizResult {
  nama: string;
  kelas: string;
  citaCita: string;
  timestamp: string;
}

export default function KuisPage() {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [savedResult, setSavedResult] = useState<QuizResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  // Data karakter
  const characters = [
    { emoji: "😊", label: "Berani", color: "from-blue-400 to-blue-500", bgColor: "from-blue-100 to-blue-200", ringColor: "ring-blue-400" },
    { emoji: "👑", label: "Ceria", color: "from-pink-400 to-pink-500", bgColor: "from-pink-100 to-pink-200", ringColor: "ring-pink-400" },
    { emoji: "🦁", label: "Pintar", color: "from-orange-400 to-orange-500", bgColor: "from-orange-100 to-orange-200", ringColor: "ring-orange-400" },
    { emoji: "😸", label: "Aktif", color: "from-green-400 to-green-500", bgColor: "from-green-100 to-green-200", ringColor: "ring-green-400" },
    { emoji: "🌟", label: "Kreatif", color: "from-purple-400 to-purple-500", bgColor: "from-purple-100 to-purple-200", ringColor: "ring-purple-400" }
  ];

  const getCharacter = (kelasValue: string) => {
    const index = parseInt(kelasValue) - 1;
    return characters[index] || characters[0];
  };

  // Cek localStorage saat component mount
  useEffect(() => {
    const saved = localStorage.getItem("quizResult");
    if (saved) {
      try {
        const result = JSON.parse(saved);
        setSavedResult(result);
        setShowResult(true);
        setNama(result.nama);
        setKelas(result.kelas);
      } catch (e) {
        console.error("Error parsing saved result:", e);
      }
    }
  }, []);

  // Data pertanyaan kuis tentang cita-cita
  const questions = [
    {
      question: "Apa yang paling kamu sukai saat bermain?",
      options: [
        "Membantu teman yang sakit",
        "Menggambar dan mewarnai",
        "Membaca buku cerita",
        "Bermain dengan angka dan hitungan",
      ],
      citaCita: ["Dokter", "Seniman", "Penulis", "Ilmuwan"],
    },
    {
      question: "Kegiatan apa yang paling menyenangkan bagimu?",
      options: [
        "Mengajar teman-teman",
        "Membuat sesuatu dengan tangan",
        "Menulis cerita atau puisi",
        "Menyelesaikan puzzle atau teka-teki",
      ],
      citaCita: ["Guru", "Perancang", "Penulis", "Peneliti"],
    },
    {
      question: "Apa yang ingin kamu lakukan saat besar nanti?",
      options: [
        "Menyembuhkan orang yang sakit",
        "Membuat karya seni yang indah",
        "Membuat cerita yang menarik",
        "Menemukan hal-hal baru",
      ],
      citaCita: ["Dokter", "Seniman", "Penulis", "Ilmuwan"],
    },
    {
      question: "Mata pelajaran apa yang paling kamu sukai?",
      options: [
        "IPA (Ilmu Pengetahuan Alam)",
        "Seni dan Keterampilan",
        "Bahasa Indonesia",
        "Matematika",
      ],
      citaCita: ["Dokter/Ilmuwan", "Seniman/Perancang", "Penulis/Jurnalis", "Ilmuwan/Matematikawan"],
    },
    {
      question: "Apa yang membuatmu merasa bangga?",
      options: [
        "Membantu orang lain",
        "Membuat sesuatu yang kreatif",
        "Menceritakan ide-ideku",
        "Memecahkan masalah yang sulit",
      ],
      citaCita: ["Dokter/Guru", "Seniman/Perancang", "Penulis", "Ilmuwan"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nama.trim() && kelas) {
      // Reset state untuk kuis baru
      setShowResult(false);
      setSavedResult(null);
      setAnswers([]);
      setCurrentQuestion(0);
      setShowQuiz(true);
      // Hapus hasil lama dari localStorage
      localStorage.removeItem("quizResult");
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    setIsTransitioning(true);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Hitung hasil berdasarkan jawaban terbanyak
      const citaCitaCount: { [key: string]: number } = {};
      newAnswers.forEach((answer, qIndex) => {
        if (questions[qIndex] && questions[qIndex].citaCita && questions[qIndex].citaCita[answer]) {
          const citaCita = questions[qIndex].citaCita[answer];
          citaCitaCount[citaCita] = (citaCitaCount[citaCita] || 0) + 1;
        }
      });

      const sortedCitaCita = Object.entries(citaCitaCount).sort((a, b) => b[1] - a[1]);
      setScore(sortedCitaCita[0][1]);
      
      // Simpan hasil ke database dan localStorage
      const hasilCitaCita = sortedCitaCita[0] ? sortedCitaCita[0][0] : "Belum ditentukan";
      saveResult(hasilCitaCita);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setShowResult(true);
      }, 500);
    }
  };

  const saveResult = async (hasilCitaCita: string) => {
    setIsSaving(true);
    const result: QuizResult = {
      nama: nama.trim(),
      kelas: kelas,
      citaCita: hasilCitaCita,
      timestamp: new Date().toISOString(),
    };

    // Simpan ke localStorage
    localStorage.setItem("quizResult", JSON.stringify(result));
    setSavedResult(result);

    // Simpan ke database
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: result.nama,
          citaCita: result.citaCita,
          kelas: result.kelas,
        }),
      });
    } catch (error) {
      console.error("Error saving to database:", error);
      // Tetap lanjutkan meskipun gagal save ke database
    } finally {
      setIsSaving(false);
    }
  };

  const getResultCitaCita = () => {
    if (savedResult) {
      return savedResult.citaCita;
    }

    const citaCitaCount: { [key: string]: number } = {};
    answers.forEach((answer, qIndex) => {
      if (questions[qIndex] && questions[qIndex].citaCita && questions[qIndex].citaCita[answer]) {
        const citaCita = questions[qIndex].citaCita[answer];
        citaCitaCount[citaCita] = (citaCitaCount[citaCita] || 0) + 1;
      }
    });

    const sortedCitaCita = Object.entries(citaCitaCount).sort((a, b) => b[1] - a[1]);
    return sortedCitaCita[0] ? sortedCitaCita[0][0] : "Belum ditentukan";
  };

  const handleCobaTesLagi = () => {
    setShowResult(false);
    setShowQuiz(false);
    setSavedResult(null);
    setAnswers([]);
    setCurrentQuestion(0);
    setNama("");
    setKelas("");
    setIsExpanded(false);
    setExplanation("");
    localStorage.removeItem("quizResult");
  };

  const handleToggleExpand = async () => {
    if (!isExpanded && !explanation) {
      // Fetch explanation jika belum ada
      const citaCita = getResultCitaCita();
      await fetchExplanation(citaCita);
    }
    setIsExpanded(!isExpanded);
  };

  const fetchExplanation = async (citaCita: string) => {
    setIsLoadingExplanation(true);
    try {
      const response = await fetch("/api/explain-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ citaCita }),
      });

      const result = await response.json();

      if (result.success) {
        setExplanation(result.explanation);
      } else {
        setExplanation("Maaf, terjadi kesalahan saat mengambil penjelasan. Silakan coba lagi nanti.");
      }
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setExplanation("Maaf, terjadi kesalahan saat mengambil penjelasan. Silakan coba lagi nanti.");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  if (showResult) {
    const hasilCitaCita = getResultCitaCita();
    const displayNama = savedResult?.nama || nama;
    const displayKelas = savedResult?.kelas || kelas;

    // Mapping cita-cita dengan mata pelajaran yang relevan
    const getRelatedSubject = (citaCita: string) => {
      const subjectMap: { [key: string]: string } = {
        "Seniman": "Seni Budaya",
        "Perancang": "Seni Budaya",
        "Penulis": "Bahasa Indonesia",
        "Jurnalis": "Bahasa Indonesia",
        "Dokter": "IPA (Ilmu Pengetahuan Alam)",
        "Ilmuwan": "IPA (Ilmu Pengetahuan Alam)",
        "Guru": "Pendidikan",
        "Peneliti": "Sains",
        "Matematikawan": "Matematika",
      };
      
      // Cek apakah citaCita mengandung salah satu kata kunci
      for (const [key, value] of Object.entries(subjectMap)) {
        if (citaCita.includes(key)) {
          return value;
        }
      }
      return "Berbagai Bidang";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE8EC] via-[#FFF5F7] to-[#FFE8EC] flex flex-col relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#FFD4E5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          
          {/* Floating decorations */}
          <div className="absolute top-20 right-20 text-6xl opacity-10 animate-pulse" style={{ animationDuration: '3s' }} suppressHydrationWarning>✨</div>
          <div className="absolute bottom-32 left-16 text-5xl opacity-10 animate-bounce" style={{ animationDuration: '4s' }} suppressHydrationWarning>🌸</div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-8 md:px-16 lg:px-28 py-4 md:py-5 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div 
              className="p-2 sm:p-2.5 rounded-xl transition-all duration-300" 
              style={{ 
                boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
              }}
            >
              <span className="text-2xl sm:text-3xl">📚</span>
            </div>
            <h1 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              KKN T Margo Lestari
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in relative z-10">
          {/* Header dengan Avatar */}
          <div className="bg-gradient-to-br from-[#FFE8EC] to-[#FFF0F3] px-8 py-10 text-center relative">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-4xl opacity-30 animate-pulse" suppressHydrationWarning>🎨</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }} suppressHydrationWarning>⭐</div>
            
            {/* Avatar dengan border dekoratif */}
            <div className="relative inline-block mb-4">
              {(() => {
                const char = getCharacter(displayKelas);
                return (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A7C957] to-[#6A994E] rounded-full blur-md opacity-30 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-[#A7C957] to-[#6A994E] rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                      <span className="text-6xl" suppressHydrationWarning>{char.emoji}</span>
                      {/* Badge indicator */}
                      <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        <span className="text-xl" suppressHydrationWarning>🎯</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Title dengan animasi */}
            <div className="space-y-2 animate-fade-in">
              <p className="text-[#E91E63] text-lg font-bold italic flex items-center justify-center gap-2">
                <span suppressHydrationWarning>🎉</span>
                <span>Hore! Kamu cocok menjadi...</span>
              </p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-[#A7C957] to-[#6A994E] bg-clip-text tracking-tight">
                {hasilCitaCita.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8 space-y-6">
            {/* Info Section dengan Icon */}
            <div className="bg-gradient-to-r from-[#F5F9F0] to-[#F0F7E8] rounded-2xl p-6 border-l-4 border-[#A7C957]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A7C957] to-[#6A994E] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-2xl" suppressHydrationWarning>💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">
                    Mengenal {hasilCitaCita} Hebat
                  </h3>
                  {!isExpanded && (
                    <button
                      onClick={handleToggleExpand}
                      disabled={isLoadingExplanation}
                      className="text-[#A7C957] hover:text-[#6A994E] font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isLoadingExplanation ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Memuat penjelasan...</span>
                        </>
                      ) : (
                        <>
                          <span>Lihat penjelasan lengkap</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Expandable Explanation */}
              {isExpanded && explanation && (
                <div className="mt-4 pt-4 border-t border-[#D4E5C0] animate-fade-in">
                  <div className="text-[#4A4A4A] space-y-3 leading-relaxed">
                    {explanation.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-sm">
                          {paragraph.trim()}
                        </p>
                      )
                    ))}
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="mt-4 text-[#A7C957] hover:text-[#6A994E] font-semibold text-sm flex items-center gap-2 transition-all"
                  >
                    <span>Sembunyikan</span>
                    <span>↑</span>
                  </button>
                </div>
              )}
            </div>

            {/* Subject Info */}
            <div className="bg-gradient-to-r from-[#E91E63]/5 to-[#F06292]/5 rounded-2xl p-5 border border-[#E91E63]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#E91E63] to-[#F06292] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-xl" suppressHydrationWarning>📚</span>
                </div>
                <div>
                  <p className="text-xs text-[#666666] font-medium">Mata Pelajaran yang Relevan</p>
                  <p className="text-lg font-bold text-[#2D2D2D]">{getRelatedSubject(hasilCitaCita)}</p>
                </div>
              </div>
            </div>

            {isSaving && (
              <div className="text-center py-2">
                <p className="text-sm text-[#666666] flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan hasil...</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              {/* Row 1: Unduh PDF dan Coba Tes Lagi */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    // Download PDF functionality (placeholder)
                    alert("Fitur unduh PDF akan segera hadir!");
                  }}
                  className="bg-gradient-to-r from-[#E91E63] to-[#F06292] hover:from-[#C2185B] hover:to-[#E91E63] text-white font-bold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  <span className="text-lg" suppressHydrationWarning>📥</span>
                  <span>Unduh PDF</span>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem("quizResult");
                    handleCobaTesLagi();
                  }}
                  className="bg-gradient-to-r from-[#A7C957] to-[#6A994E] hover:from-[#8FB84E] hover:to-[#588B3B] text-white font-bold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  <span className="text-lg" suppressHydrationWarning>🔄</span>
                  <span>Coba Lagi</span>
                </button>
              </div>

              {/* Row 2: Kembali ke Beranda */}
              <button
                onClick={() => {
                  localStorage.removeItem("quizResult");
                  window.location.href = "/";
                }}
                className="w-full bg-gradient-to-r from-[#FFE8EC] to-[#FFD4E5] hover:from-[#FFB6C1] hover:to-[#FFE8EC] text-[#E91E63] hover:text-[#C2185B] border-2 border-[#FFD4E5] hover:border-[#FFB6C1] font-bold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform" suppressHydrationWarning>←</span>
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Footer */}
        <footer 
          className="text-center py-6 sm:py-8 border-t px-4 relative z-10 backdrop-blur-sm bg-white/30"
          style={{
            borderColor: 'rgba(243, 244, 246, 0.5)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <p 
            className="text-sm sm:text-base md:text-lg text-[#666666] font-medium" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © 2024 KKN T Margo Lestari. Dashboard Cita-Cita Siswa.
          </p>
        </footer>
      </div>
    );
  }

  if (showQuiz) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-hidden">
        {/* Decorative Background Elements - sama seperti page.tsx */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[#FFE4E9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          {/* Fun Floating Shapes */}
          <div className="absolute top-[15%] right-[20%] text-4xl opacity-20 animate-pulse" style={{ animationDuration: '2s' }} suppressHydrationWarning>⭐</div>
          <div className="absolute bottom-[20%] right-[15%] text-3xl opacity-20 animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.5s' }} suppressHydrationWarning>😊</div>
          <div className="absolute top-[45%] left-[8%] text-3xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} suppressHydrationWarning>💚</div>
          <div className="absolute bottom-[25%] left-[12%] text-4xl opacity-20 animate-pulse" style={{ animationDuration: '3s' }} suppressHydrationWarning>✏️</div>
        </div>

        {/* Header - sama seperti page.tsx */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-8 md:px-16 lg:px-28 py-4 md:py-5 shadow-sm relative">
          <div className="flex items-center gap-3 sm:gap-4">
            <div 
              className="p-2 sm:p-2.5 rounded-xl transition-all duration-300" 
              style={{ 
                boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
              }}
            >
              <span className="text-2xl sm:text-3xl">📚</span>
            </div>
            <h1 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              KKN T Margo Lestari
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 max-w-4xl relative z-10">
          {/* Progress Bar */}
          <div className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>Progres Kuis</span>
              <span className="text-sm font-bold text-[#FF4D6D]" style={{ fontFamily: 'Inter, sans-serif' }}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div 
            key={currentQuestion}
            className={`bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 mb-8 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            } transition-all duration-300`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-10 text-center leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={`${currentQuestion}-${index}`}
                  onClick={() => handleAnswer(index)}
                  className="w-full bg-white hover:bg-[#FFF0F3] border-2 border-gray-200 hover:border-[#FF4D6D] text-[#2D2D2D] font-medium px-6 py-5 rounded-2xl text-left transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFE4E9] to-[#FFB6C1] group-hover:from-[#FF4D6D] group-hover:to-[#FF6B8A] rounded-full flex items-center justify-center font-bold text-[#FF4D6D] group-hover:text-white transition-all flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 77, 109, 0.15)' }}>
                <span className="text-xl" suppressHydrationWarning>💪</span>
              </div>
              <span className="text-sm font-bold text-[#FF4D6D] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Kamu Pasti Bisa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(167, 209, 41, 0.15)' }}>
                <span className="text-xl" suppressHydrationWarning>🌟</span>
              </div>
              <span className="text-sm font-bold text-[#A7D129] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Raih Mimpimu</span>
            </div>
          </div>
        </main>

        {/* Footer - sama seperti page.tsx */}
        <footer 
          className="text-center py-6 sm:py-8 border-t px-4 relative z-10 backdrop-blur-sm bg-white/30"
          style={{
            borderColor: 'rgba(243, 244, 246, 0.5)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <p 
            className="text-sm sm:text-base md:text-lg text-[#666666] font-medium" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © 2024 KKN T Margo Lestari.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-hidden">
      {/* Decorative Background Elements - sama seperti page.tsx */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[#FFE4E9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Fun Floating Shapes */}
        <div className="absolute top-[10%] left-[8%] text-5xl opacity-30 animate-pulse" style={{ animationDuration: '2s' }} suppressHydrationWarning>⭐</div>
        <div className="absolute top-[15%] right-[12%] text-5xl opacity-30 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} suppressHydrationWarning>🚀</div>
        <div className="absolute bottom-[20%] left-[10%] text-5xl opacity-30 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }} suppressHydrationWarning>🚙</div>
        <div className="absolute bottom-[15%] right-[15%] text-5xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }} suppressHydrationWarning>✏️</div>
      </div>

      {/* Header - sama seperti page.tsx */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-8 md:px-16 lg:px-28 py-4 md:py-5 shadow-sm relative">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="p-2 sm:p-2.5 rounded-xl transition-all duration-300" 
            style={{ 
              boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
            }}
          >
            <span className="text-2xl sm:text-3xl">📚</span>
          </div>
          <h1 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            KKN T Margo Lestari
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 max-w-3xl relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Siap Temukan <span className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent">Cita-Citamu?</span>
          </h2>
          <p className="text-base md:text-lg text-[#666666] font-medium flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span>Pilih karakter kerenmu dan ketik namamu untuk menyapa mereka!</span>
            <span className="text-2xl" suppressHydrationWarning>✋</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pilih Karakter Kamu */}
            <div>
              <h3 className="text-center text-base md:text-lg font-bold text-[#2D2D2D] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Pilih Karakter Kamu
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-items-center">
                {characters.map((char, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setKelas(((index % 6) + 1).toString())}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      kelas === ((index % 6) + 1).toString() 
                        ? "scale-110" 
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${char.bgColor} flex items-center justify-center text-3xl md:text-4xl shadow-md transition-all ${
                      kelas === ((index % 6) + 1).toString() ? `ring-4 ${char.ringColor} shadow-lg` : ""
                    }`}>
                      <span suppressHydrationWarning>{char.emoji}</span>
                    </div>
                    <span className={`text-xs md:text-sm font-semibold mt-2 ${
                      kelas === ((index % 6) + 1).toString() ? "text-[#FF4D6D]" : "text-[#666666]"
                    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {char.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Input */}
            <div>
              <h3 className="text-center text-base md:text-lg font-bold text-[#2D2D2D] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Siapa Nama Lengkapmu?
              </h3>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Ketik namamu di sini..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-400 bg-[#F9FAFB] text-[#2D2D2D] placeholder-gray-400 transition-all text-center text-base md:text-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
                required
              />
              <p className="text-xs md:text-sm text-[#999999] text-center mt-3 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                Karaktermu akan melambai jika kamu mulai mengetes!
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!nama.trim() || !kelas}
              className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-md disabled:cursor-not-allowed disabled:shadow-none text-base md:text-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="uppercase tracking-wide">Mulai Kuis Sekarang</span>
              <span className="text-xl" suppressHydrationWarning>🚀</span>
            </button>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFE8EC] to-[#FFD4E5] hover:from-[#FFB6C1] hover:to-[#FFE8EC] text-[#FF4D6D] hover:text-[#E91E63] font-semibold text-sm transition-all px-5 py-2.5 rounded-xl border-2 border-[#FFD4E5] hover:border-[#FFB6C1] shadow-sm hover:shadow-md transform hover:scale-105"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>

      {/* Footer - sama seperti page.tsx */}
      <footer 
        className="text-center py-6 sm:py-8 border-t px-4 relative z-10 backdrop-blur-sm bg-white/30"
        style={{
          borderColor: 'rgba(243, 244, 246, 0.5)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <p 
          className="text-xs sm:text-sm text-[#999999] font-medium" 
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          © 2024 DASHBOARD CITA-CITA SISWA • TIM KKN T MARGO LESTARI
        </p>
      </footer>
    </div>
  );
}
