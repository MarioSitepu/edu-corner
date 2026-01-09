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
      newAnswers.forEach((answerIndex, qIndex) => {
        const citaCita = questions[qIndex].citaCita[answerIndex];
        citaCitaCount[citaCita] = (citaCitaCount[citaCita] || 0) + 1;
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
    answers.forEach((answerIndex, qIndex) => {
      const citaCita = questions[qIndex].citaCita[answerIndex];
      citaCitaCount[citaCita] = (citaCitaCount[citaCita] || 0) + 1;
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
    localStorage.removeItem("quizResult");
  };

  if (showResult) {
    const hasilCitaCita = getResultCitaCita();
    const displayNama = savedResult?.nama || nama;
    const displayKelas = savedResult?.kelas || kelas;

    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-8 animate-fade-in">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-scale-in">
          <div className="mb-6 animate-fade-in">
            <div className="w-20 h-20 bg-[#FFB6C1] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FF69B4]"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2 animate-slide-in-right">Selamat, {displayNama}!</h2>
            <p className="text-lg text-[#4A4A4A] mb-6 animate-slide-in-left">Kelas {displayKelas}</p>
          </div>

          <div className="bg-[#B8E6B8] rounded-xl p-6 mb-6 animate-scale-in hover-lift">
            <p className="text-sm font-semibold text-[#2D2D2D] mb-2 uppercase tracking-wide">Cita-Citamu Adalah</p>
            <p className="text-4xl font-bold text-[#2D2D2D]">{hasilCitaCita}</p>
          </div>

          <p className="text-base text-[#4A4A4A] mb-8">
            Teruslah belajar dan berusaha untuk mencapai cita-citamu! Semangat!
          </p>

          {isSaving && (
            <p className="text-sm text-[#4A4A4A] mb-4">Menyimpan hasil...</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCobaTesLagi}
              className="bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Coba Tes Lagi
            </button>
            <Link
              href="/history"
              className="bg-[#B8E6B8] hover:bg-[#A8D8A8] text-[#2D2D2D] font-semibold px-6 py-3 rounded-lg transition-all text-center"
            >
              Cek Petualanganmu (History)
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-[#2D2D2D] font-semibold px-6 py-3 rounded-lg transition-all text-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full">
          {/* Progress Bar */}
          <div className="mb-6 animate-fade-in">
            <div className="flex justify-between text-sm text-[#4A4A4A] mb-2">
              <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#FF69B4] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div 
            key={currentQuestion}
            className={`bg-white rounded-2xl shadow-xl p-8 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-slide-in-right'
            } transition-all duration-300`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-8 text-center animate-fade-in">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={`${currentQuestion}-${index}`}
                  onClick={() => handleAnswer(index)}
                  className="w-full bg-[#FFF5F5] hover:bg-[#FFB6C1] border-2 border-transparent hover:border-[#FF69B4] text-[#2D2D2D] font-semibold px-6 py-4 rounded-xl text-left transition-all transform hover:scale-[1.02] active:scale-95 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#FF69B4] transition-transform hover:scale-110">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-right">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
            Tes Cita-Cita yang Cocok dengan Kamu
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Isi data dirimu terlebih dahulu untuk memulai kuis
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in hover-lift">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Input */}
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkapmu"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FF69B4] bg-white text-[#2D2D2D] placeholder-gray-400 transition-colors"
                required
              />
            </div>

            {/* Kelas Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                Pilih Kelas
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKelas(k.toString())}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      kelas === k.toString()
                        ? "bg-[#FF69B4] text-white shadow-lg scale-105"
                        : "bg-[#FFF5F5] text-[#2D2D2D] hover:bg-[#FFB6C1]"
                    }`}
                  >
                    Kelas {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!nama.trim() || !kelas}
              className="w-full bg-[#FF69B4] hover:bg-[#FF5BA3] disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none text-lg transform hover:scale-[1.02] active:scale-100 animate-fade-in"
            >
              Mulai Kuis
            </button>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#4A4A4A] hover:text-[#2D2D2D] font-medium transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
