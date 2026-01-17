"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import StructuredData from "@/components/StructuredData";
import logoWebp from "../logo.webp";

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [pdfError, setPdfError] = useState<string>("");
  
  // Refs untuk cleanup timer (fix race condition)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem("quizResult");
        if (saved) {
          try {
            const result = JSON.parse(saved);
            // Validasi struktur data
            if (result && typeof result === 'object' && result.nama && result.citaCita) {
              setSavedResult(result);
              setShowResult(true);
              setNama(result.nama || "");
              setKelas(result.kelas || "");
            } else {
              // Data tidak valid, hapus dari localStorage
              localStorage.removeItem("quizResult");
            }
          } catch (e) {
            console.error("Error parsing saved result:", e);
            // Hapus data corrupt dari localStorage
            localStorage.removeItem("quizResult");
          }
        }
      }
    } catch (e) {
      // localStorage tidak tersedia atau blocked
      console.warn("localStorage tidak tersedia:", e);
    }
  }, []);

  // Trigger animasi muncul saat pertanyaan baru dimuat (harus di top level)
  // Fix race condition dengan cleanup timer menggunakan useRef
  useEffect(() => {
    if (showQuiz) {
      setOptionsVisible(false);
      
      // Cleanup timer sebelumnya jika ada
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      animationTimerRef.current = setTimeout(() => {
        setOptionsVisible(true);
        animationTimerRef.current = null;
      }, 200);
      
      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
          animationTimerRef.current = null;
        }
      };
    }
  }, [currentQuestion, showQuiz]);

  // Data pertanyaan kuis tentang cita-cita (2 pilihan dengan gambar real)
  const questions = [
    {
      question: "Apa yang paling kamu sukai saat bermain?",
      options: [
        {
          text: "Membantu teman yang sakit",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          emoji: "🏥",
          citaCita: "Dokter"
        },
        {
          text: "Menggambar dan mewarnai",
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
          emoji: "🎨",
          citaCita: "Seniman"
        },
      ],
    },
    {
      question: "Kegiatan apa yang paling menyenangkan bagimu?",
      options: [
        {
          text: "Mengajar teman-teman",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
          emoji: "👨‍🏫",
          citaCita: "Guru"
        },
        {
          text: "Membuat sesuatu dengan tangan",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
          emoji: "✂️",
          citaCita: "Perancang"
        },
      ],
    },
    {
      question: "Apa yang ingin kamu lakukan saat besar nanti?",
      options: [
        {
          text: "Menyembuhkan orang yang sakit",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
          emoji: "💊",
          citaCita: "Dokter"
        },
        {
          text: "Membuat karya seni yang indah",
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
          emoji: "🖼️",
          citaCita: "Seniman"
        },
      ],
    },
    {
      question: "Mata pelajaran apa yang paling kamu sukai?",
      options: [
        {
          text: "IPA (Ilmu Pengetahuan Alam)",
          image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
          emoji: "🔬",
          citaCita: "Ilmuwan"
        },
        {
          text: "Seni dan Keterampilan",
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
          emoji: "🖌️",
          citaCita: "Seniman"
        },
      ],
    },
    {
      question: "Apa yang membuatmu merasa bangga?",
      options: [
        {
          text: "Membantu orang lain",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          emoji: "🤝",
          citaCita: "Dokter"
        },
        {
          text: "Membuat sesuatu yang kreatif",
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
          emoji: "✨",
          citaCita: "Seniman"
        },
      ],
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
      setOptionsVisible(false);
      // Hapus hasil lama dari localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("quizResult");
        }
      } catch (e) {
        console.warn("Gagal menghapus dari localStorage:", e);
      }
      // Trigger animasi muncul untuk pertanyaan pertama
      // Cleanup timer sebelumnya jika ada
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      animationTimerRef.current = setTimeout(() => {
        setOptionsVisible(true);
        animationTimerRef.current = null;
      }, 300);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    setIsTransitioning(true);
    setOptionsVisible(false);

    // Cleanup timer sebelumnya jika ada
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    if (currentQuestion < questions.length - 1) {
      transitionTimerRef.current = setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
        // Trigger animasi muncul untuk pertanyaan baru
        animationTimerRef.current = setTimeout(() => {
          setOptionsVisible(true);
          animationTimerRef.current = null;
        }, 150);
        transitionTimerRef.current = null;
      }, 500);
    } else {
      // Hitung hasil berdasarkan jawaban terbanyak
      const citaCitaCount: { [key: string]: number } = {};
      newAnswers.forEach((answer, qIndex) => {
        if (questions[qIndex] && questions[qIndex].options && questions[qIndex].options[answer]) {
          const citaCita = questions[qIndex].options[answer].citaCita;
          citaCitaCount[citaCita] = (citaCitaCount[citaCita] || 0) + 1;
        }
      });

      const sortedCitaCita = Object.entries(citaCitaCount).sort((a, b) => b[1] - a[1]);
      setScore(sortedCitaCita[0] ? sortedCitaCita[0][1] : 0);
      
      // Simpan hasil ke database dan localStorage
      const hasilCitaCita = sortedCitaCita[0] ? sortedCitaCita[0][0] : "Belum ditentukan";
      saveResult(hasilCitaCita);
      
      // Cleanup timer sebelumnya jika ada
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setShowResult(true);
        transitionTimerRef.current = null;
      }, 800);
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

    // Simpan ke localStorage dengan error handling
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("quizResult", JSON.stringify(result));
        setSavedResult(result);
      } else {
        // Jika localStorage tidak tersedia, tetap set state
        setSavedResult(result);
      }
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
      // Tetap set state meskipun localStorage gagal
      setSavedResult(result);
    }

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
      if (questions[qIndex] && questions[qIndex].options && questions[qIndex].options[answer]) {
        const citaCita = questions[qIndex].options[answer].citaCita;
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
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("quizResult");
      }
    } catch (e) {
      console.warn("Gagal menghapus dari localStorage:", e);
    }
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

      if (result.success && result.explanation) {
        setExplanation(result.explanation);
      } else {
        // Fallback explanation jika API tidak mengembalikan explanation
        const fallbackText = `Menjadi ${citaCita} adalah profesi yang sangat menarik! Untuk mencapai cita-citamu, kamu perlu belajar dengan rajin di sekolah dan selalu semangat. Dengan kerja keras dan tekad yang kuat, kamu pasti bisa menjadi ${citaCita} yang hebat!`;
        setExplanation(fallbackText);
      }
    } catch (error) {
      console.error("Error fetching explanation:", error);
      // Fallback explanation jika terjadi error
      const fallbackCitaCita = citaCita || getResultCitaCita();
      const fallbackText = `Menjadi ${fallbackCitaCita} adalah profesi yang sangat menarik! Untuk mencapai cita-citamu, kamu perlu belajar dengan rajin di sekolah dan selalu semangat. Dengan kerja keras dan tekad yang kuat, kamu pasti bisa menjadi ${fallbackCitaCita} yang hebat!`;
      setExplanation(fallbackText);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Jika explanation belum di-load, fetch dulu
      let finalExplanation = explanation;
      if (!finalExplanation) {
        const hasilCitaCita = getResultCitaCita();
        try {
          const response = await fetch("/api/explain-career", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ citaCita: hasilCitaCita }),
          });
          const result = await response.json();
          if (result.success && result.explanation) {
            finalExplanation = result.explanation;
          }
        } catch (error) {
          console.warn('Gagal fetch explanation untuk PDF:', error);
        }
      }
      
      // Dynamic import untuk jsPDF (kompatibel dengan Next.js)
      const { default: jsPDF } = await import('jspdf');
      
      // Helper function untuk clean text - DEFINISI DI AWAL
      const decodeHtmlEntities = (text: string): string => {
        if (typeof window === 'undefined') return text;
        
        try {
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          return textarea.value;
        } catch (e) {
          // Fallback: manual decode common entities
          return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');
        }
      };
      
      const cleanText = (text: string): string => {
        if (!text) return '';
        
        // Decode HTML entities
        let cleaned = decodeHtmlEntities(String(text));
        // Remove HTML tags jika ada
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        
        // HAPUS KARAKTER ANEH - SANGAT AGRESIF - HANYA ASCII
        // Step 1: Hapus pola spesifik yang bermasalah
        cleaned = cleaned.replace(/Ø=[^\s]*/g, ''); // Hapus Ø= diikuti apapun
        cleaned = cleaned.replace(/[ØÞÜþ•]/g, ''); // Hapus karakter aneh individual
        cleaned = cleaned.replace(/&[^a-zA-Z0-9#;]/g, ''); // Hapus & diikuti karakter aneh
        
        // Step 2: Hanya allow ASCII printable (0x20-0x7E) dan newline/carriage return
        cleaned = cleaned.replace(/[^\x20-\x7E\n\r]/g, ' ');
        
        // Step 3: Remove karakter kontrol dan non-printable
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        
        // Step 4: Hapus pola spesifik yang bermasalah
        cleaned = cleaned.replace(/0&lt;0/g, '');
        cleaned = cleaned.replace(/0=/g, '');
        cleaned = cleaned.replace(/#\s*0/g, '');
        cleaned = cleaned.replace(/0&lt;/g, '');
        cleaned = cleaned.replace(/&lt;0/g, '');
        
        // Step 5: Hanya allow karakter yang benar-benar valid - HANYA ASCII
        cleaned = cleaned.replace(/[^a-zA-Z0-9\s.,!?;:()\-'":]/g, ' ');
        
        // Step 6: Clean up whitespace
        cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces menjadi satu
        cleaned = cleaned.split('\n').map(line => line.trim()).join('\n'); // Trim setiap baris
        cleaned = cleaned.trim(); // Trim akhir
        
        return cleaned;
      };
      
      const hasilCitaCita = getResultCitaCita();
      const displayNama = savedResult?.nama || nama;
      const displayKelas = savedResult?.kelas || kelas;
      
      // CLEAN SEMUA TEKS SEBELUM DIGUNAKAN
      const cleanedCitaCita = cleanText(hasilCitaCita);
      const cleanedNama = cleanText(displayNama);
      const cleanedKelas = cleanText(displayKelas);
      
      // Gunakan explanation yang sudah di-fetch atau fallback - CLEAN DULU
      const rawExplanation = finalExplanation || `Menjadi ${cleanedCitaCita} adalah profesi yang sangat menarik! Untuk mencapai cita-citamu, kamu perlu belajar dengan rajin di sekolah dan selalu semangat.`;
      const displayExplanation = cleanText(rawExplanation);
      
      // Ambil tanggal kuis dari timestamp - CLEAN DULU
      const rawQuizDate = savedResult?.timestamp 
        ? new Date(savedResult.timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
      const quizDate = cleanText(rawQuizDate);

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
        
        for (const [key, value] of Object.entries(subjectMap)) {
          if (citaCita.includes(key)) {
            return value;
          }
        }
        return "Berbagai Bidang";
      };

      const relatedSubject = cleanText(getRelatedSubject(cleanedCitaCita));
      const char = getCharacter(cleanedKelas);

      // Mapping ikon untuk setiap profesi/cita-cita
      const getCareerIcon = (citaCita: string): string => {
        const iconMap: { [key: string]: string } = {
          "Dokter": "👨‍⚕️",
          "Seniman": "🎨",
          "Guru": "👨‍🏫",
          "Ilmuwan": "🔬",
          "Penulis": "✍️",
          "Perancang": "✂️",
          "Jurnalis": "📰",
          "Peneliti": "🔍",
          "Matematikawan": "📐",
        };
        
        // Cari ikon yang cocok (case-insensitive)
        const normalizedCitaCita = citaCita.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
          if (normalizedCitaCita.includes(key.toLowerCase())) {
            return icon;
          }
        }
        return "💼"; // Default icon
      };

      const careerIcon = getCareerIcon(cleanedCitaCita);

      // Buat PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      const footerHeight = 20;

      // Warna
      const primaryColor = [255, 77, 109]; // #FF4D6D
      const secondaryColor = [167, 209, 41]; // #A7C957
      const textColor = [45, 45, 45]; // #2D2D2D
      const lightGray = [230, 230, 230];

      // Helper function untuk add footer di setiap halaman
      const addFooter = (pageNum: number, totalPages: number) => {
        const footerY = pageHeight - 10;
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        pdf.text('© 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi', pageWidth / 2, footerY, { align: 'center' });
        
        const date = new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        pdf.text(`Dibuat pada: ${date}`, pageWidth / 2, footerY + 5, { align: 'center' });
        
        // Page number
        pdf.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth / 2, footerY + 10, { align: 'center' });
      };

      // Header dengan gradient effect
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      // Title (tanpa logo)
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('EduCorner: SahabatMimpi', margin, 28);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('KKN T Margo Lestari', margin, 35);

      let yPos = 65;

      // Card Background dengan shadow effect
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos - 5, contentWidth, 70, 3, 3, 'FD');

      // Title "Hore! Kamu cocok menjadi..." - clean text (tanpa avatar dan ikon)
      pdf.setFontSize(11);
      pdf.setTextColor(233, 30, 99); // #E91E63
      pdf.setFont('helvetica', 'bold');
      const titleText = cleanText('Hore! Kamu cocok menjadi...');
      pdf.text(titleText, margin + 5, yPos + 6);

      // Cita-cita besar (dengan text wrapping jika terlalu panjang) - sudah di-clean (tanpa ikon)
      pdf.setFontSize(22);
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setFont('helvetica', 'bold');
      const citaCitaText = cleanedCitaCita.toUpperCase();
      const citaCitaLines = pdf.splitTextToSize(citaCitaText, contentWidth - 10);
      pdf.text(citaCitaLines, margin + 5, yPos + 20);

      // Info Box - Nama, Kelas, dan Tanggal Kuis
      yPos += 52;
      pdf.setFillColor(245, 249, 240); // Light green background
      pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
      
      // Border untuk info box
      pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'D');
      
      pdf.setFontSize(10);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Nama:`, margin + 5, yPos + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(cleanedNama, margin + 25, yPos + 8);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Kelas:`, margin + contentWidth / 2, yPos + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(cleanedKelas, margin + contentWidth / 2 + 20, yPos + 8);
      
      // Tanggal Kuis (sudah di-clean di atas)
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Tanggal Kuis: ${quizDate}`, margin + 5, yPos + 18);

      yPos += 35;

      // Penjelasan Section Header (tanpa ikon profesi)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const sectionTitle = `Mengenal ${cleanedCitaCita} Hebat`;
      pdf.text(sectionTitle, margin, yPos);

      yPos += 8;

      // Semua teks sudah di-clean di awal, langsung gunakan

      // Explanation text dengan paragraph handling yang lebih baik
      pdf.setFontSize(10);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont('helvetica', 'normal');
      
      // Split explanation into paragraphs (sudah di-clean di atas)
      const paragraphs = displayExplanation.split('\n').filter(p => p.trim());
      let currentY = yPos;
      let pageNum = 1;
      
      paragraphs.forEach((paragraph, paraIndex) => {
        if (currentY > pageHeight - footerHeight - 10) {
          addFooter(pageNum, 0); // Temporary, will update later
          pdf.addPage();
          pageNum++;
          currentY = margin + 5;
        }
        
        // Split paragraph into lines dengan line height yang lebih baik
        const lines = pdf.splitTextToSize(paragraph.trim(), contentWidth - 10);
        lines.forEach((line: string) => {
          if (currentY > pageHeight - footerHeight - 10) {
            addFooter(pageNum, 0);
            pdf.addPage();
            pageNum++;
            currentY = margin + 5;
          }
          // Line sudah di-clean dari paragraph yang sudah di-clean
          if (line.trim()) {
            pdf.text(line.trim(), margin + 5, currentY);
            currentY += 6; // Line height yang lebih baik
          }
        });
        
        // Add spacing between paragraphs
        if (paraIndex < paragraphs.length - 1) {
          currentY += 4;
        }
      });

      // Subject Info Box
      currentY += 10;
      if (currentY > pageHeight - footerHeight - 25) {
        addFooter(pageNum, 0);
        pdf.addPage();
        pageNum++;
        currentY = margin + 5;
      }

      pdf.setFillColor(250, 240, 245); // Light pink background
      pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
      
      // Border untuk subject box
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'D');
      
      // Mata pelajaran (tanpa ikon buku)
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Mata Pelajaran yang Relevan', margin + 5, currentY + 8);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(relatedSubject, margin + 5, currentY + 15);

      // Add footer to all pages
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
      }

      // Download PDF
      const sanitizedName = displayNama.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-').substring(0, 50);
      const fileName = `Hasil-Kuis-Educorner-${sanitizedName}.pdf`;
      pdf.save(fileName);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      const errorMessage = error?.message || 'Terjadi kesalahan saat membuat PDF';
      setPdfError(errorMessage);
      
      // Tampilkan error message ke user dengan cara yang lebih baik
      setTimeout(() => {
        alert(`Terjadi kesalahan saat membuat PDF: ${errorMessage}\n\nSilakan coba lagi atau refresh halaman.`);
        setPdfError("");
      }, 100);
    } finally {
      setIsGeneratingPDF(false);
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

    const breadcrumbStructuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Beranda",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kuis Cita-Cita",
          "item": `${baseUrl}/kuis`
        }
      ]
    };

    const quizStructuredData = {
      "@context": "https://schema.org",
      "@type": "Quiz",
      "name": "Kuis Cita-Cita - Temukan Profesi Impianmu",
      "description": "Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu. Dapatkan rekomendasi cita-cita berdasarkan jawabanmu.",
      "url": `${baseUrl}/kuis`,
      "educationalUse": "assessment",
      "learningResourceType": "Quiz",
      "inLanguage": "id-ID",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "Student"
      },
      "about": {
        "@type": "Thing",
        "name": "Career Guidance",
        "description": "Bimbingan karir untuk siswa"
      },
      "teaches": "Career exploration and self-discovery",
      "timeRequired": "PT10M",
      "educationalLevel": {
        "@type": "DefinedTerm",
        "name": "Elementary, Middle School, High School"
      },
      "provider": {
        "@type": "Organization",
        "name": "EduCorner",
        "alternateName": "edu corner",
        "url": baseUrl
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "50",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    return (
      <>
        <StructuredData data={breadcrumbStructuredData} />
        <StructuredData data={quizStructuredData} />
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
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-6 md:px-10 lg:px-16 py-2 md:py-3 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-lg transition-all duration-300" 
              style={{ 
                boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
              }}
            >
              <Image
                src={logoWebp}
                alt="Logo EduCorner: SahabatMimpi"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                EduCorner: SahabatMimpi
              </h1>
              <p className="text-xs sm:text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Temukan potensi diri dan wujudkan mimpi langkah demi langkah.
              </p>
            </div>
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
                      <Image
                        src={logoWebp}
                        alt="Logo EduCorner"
                        width={64}
                        height={64}
                        className="w-16 h-16"
                      />
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
                  <Image
                    src={logoWebp}
                    alt="Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
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
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-gradient-to-r from-[#E91E63] to-[#F06292] hover:from-[#C2185B] hover:to-[#E91E63] disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Membuat PDF...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg" suppressHydrationWarning>📥</span>
                      <span>Unduh PDF</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    try {
                      if (typeof window !== 'undefined' && window.localStorage) {
                        localStorage.removeItem("quizResult");
                      }
                    } catch (e) {
                      console.warn("Gagal menghapus dari localStorage:", e);
                    }
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
                  try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                      localStorage.removeItem("quizResult");
                    }
                  } catch (e) {
                    console.warn("Gagal menghapus dari localStorage:", e);
                  }
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
          className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-10 backdrop-blur-sm bg-white/80"
          style={{
            borderColor: 'rgba(243, 244, 246, 0.5)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <p 
            className="text-xs sm:text-sm text-[#666666] font-medium" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
          </p>
        </footer>
      </div>
      </>
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
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-6 md:px-10 lg:px-16 py-2 md:py-3 shadow-sm relative">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-lg transition-all duration-300" 
              style={{ 
                boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
              }}
            >
              <Image
                src={logoWebp}
                alt="Logo EduCorner: SahabatMimpi"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                EduCorner: SahabatMimpi
              </h1>
              <p className="text-xs sm:text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Temukan potensi diri dan wujudkan mimpi langkah demi langkah.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 max-w-4xl relative z-10">
          {/* Progress Bar dengan Counter */}
          <div className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  Pertanyaan {currentQuestion + 1} dari {questions.length}
                </div>
                <span className="text-sm font-semibold text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>Progres Kuis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#FF4D6D]" style={{ fontFamily: 'Inter, sans-serif' }}>{Math.round(progress)}%</span>
                <div className="w-3 h-3 bg-[#FF4D6D] rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#FF4D6D] via-[#FF6B8A] to-[#FF8FA3] h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Loading Overlay saat Transisi */}
          {isTransitioning && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#FF4D6D] font-semibold text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Memuat pertanyaan berikutnya...
                </p>
              </div>
            </div>
          )}

          {/* Question Card */}
          <div 
            key={currentQuestion}
            className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8 relative overflow-hidden ${
              isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
            } transition-all duration-500 ease-out`}
          >
            {/* Decorative Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFE4E9]/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#FFF0F3]/30 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-[#FF4D6D]/10 to-[#FF6B8A]/10 px-6 py-2 rounded-full border border-[#FF4D6D]/20">
                  <span className="text-sm font-semibold text-[#FF4D6D]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Pilih salah satu yang paling sesuai denganmu
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2D2D] mb-12 text-center leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                {question.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {question.options.map((option: any, index: number) => (
                  <button
                    key={`${currentQuestion}-${index}`}
                    onClick={() => handleAnswer(index)}
                    className={`relative w-full bg-gradient-to-br from-white to-[#FFF8F9] hover:from-[#FFF0F3] hover:to-[#FFE4E9] border-2 border-gray-200 hover:border-[#FF4D6D] text-[#2D2D2D] font-medium px-6 py-8 rounded-3xl text-center transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] shadow-md hover:shadow-2xl group flex flex-col items-center justify-center gap-5 min-h-[380px] md:min-h-[420px] overflow-hidden ${
                      !optionsVisible ? 'opacity-0' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animation: optionsVisible && !isTransitioning 
                        ? (index === 0 
                           ? 'slideInFromLeft 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
                           : 'slideInFromRight 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards')
                        : 'none'
                    }}
                  >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D6D]/0 via-[#FF6B8A]/0 to-[#FF8FA3]/0 group-hover:from-[#FF4D6D]/5 group-hover:via-[#FF6B8A]/5 group-hover:to-[#FF8FA3]/5 transition-all duration-300 rounded-3xl"></div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D6D]/20 via-transparent to-[#FF6B8A]/20 blur-xl rounded-3xl"></div>
                    </div>

                    {/* Badge Label */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-[#FFE4E9] to-[#FFB6C1] group-hover:from-[#FF4D6D] group-hover:to-[#FF6B8A] rounded-full flex items-center justify-center font-bold text-sm text-[#FF4D6D] group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Gambar Real dengan Container */}
                    <div className="relative z-10 w-full" style={{
                      animationDelay: `${index * 200 + 150}ms`,
                      animation: optionsVisible && !isTransitioning ? 'scaleInBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                      opacity: optionsVisible ? 1 : 0
                    }}>
                      <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFE4E9] to-[#FFF0F3] group-hover:from-[#FF4D6D]/10 group-hover:to-[#FF6B8A]/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl mb-4 shadow-lg">
                        {/* Gambar Real */}
                        <div className="relative w-full h-full">
                          <Image
                            src={option.image}
                            alt={option.text}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            unoptimized
                            onError={(e) => {
                              // Fallback ke emoji jika gambar gagal dimuat
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.image-fallback');
                              if (fallback) {
                                (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          {/* Fallback emoji jika gambar gagal dimuat */}
                          <div className="image-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFE4E9] to-[#FFF0F3] hidden">
                            <span className="text-6xl md:text-7xl" suppressHydrationWarning>{option.emoji}</span>
                          </div>
                        </div>
                        {/* Overlay gradient untuk efek lebih menarik */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Teks Pilihan */}
                    <div className="relative z-10 w-full" style={{
                      animationDelay: `${index * 200 + 200}ms`,
                      animation: optionsVisible && !isTransitioning ? 'fadeInRotate 0.6s ease-out forwards' : 'none',
                      opacity: optionsVisible ? 1 : 0
                    }}>
                      <span className="text-base md:text-lg lg:text-xl leading-relaxed font-bold text-[#2D2D2D] group-hover:text-[#FF4D6D] transition-colors duration-300 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {option.text}
                      </span>
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-8 rounded-full bg-[#FF4D6D] flex items-center justify-center text-white shadow-lg">
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info dengan Animasi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E9] px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF4D6D] to-[#FF6B8A] shadow-lg animate-bounce-slow">
                <span className="text-xl" suppressHydrationWarning>💪</span>
              </div>
              <span className="text-sm font-bold text-[#FF4D6D] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Kamu Pasti Bisa</span>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#A7C957] to-[#6A994E] shadow-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <span className="text-xl" suppressHydrationWarning>🌟</span>
              </div>
              <span className="text-sm font-bold text-[#6A994E] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Raih Mimpimu</span>
            </div>
          </div>
        </main>

        {/* Footer - sama seperti page.tsx */}
        <footer 
          className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-10 backdrop-blur-sm bg-white/80"
          style={{
            borderColor: 'rgba(243, 244, 246, 0.5)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <p 
            className="text-xs sm:text-sm text-[#666666] font-medium" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-custom border-b border-[#FCE7F3]/50 px-4 sm:px-6 md:px-10 lg:px-16 py-2 md:py-3 shadow-sm relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            className="p-1.5 sm:p-2 rounded-lg transition-all duration-300" 
            style={{ 
              boxShadow: '0px 4px 30px -4px rgba(255, 77, 109, 0.2), 0px 0px 20px rgba(255, 77, 109, 0.1)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 240, 243, 0.9) 100%)'
            }}
          >
            <Image
              src={logoWebp}
              alt="Logo EduCorner: SahabatMimpi"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] bg-clip-text text-transparent leading-[1.42] tracking-[-0.02em]" 
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              EduCorner: SahabatMimpi
            </h1>
            <p className="text-xs sm:text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Temukan potensi diri dan wujudkan mimpi langkah demi langkah.
            </p>
          </div>
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Validasi panjang maksimal di frontend
                  if (value.length <= 255) {
                    setNama(value);
                  }
                }}
                placeholder="Ketik namamu di sini..."
                maxLength={255}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-400 bg-[#F9FAFB] text-[#2D2D2D] placeholder-gray-400 transition-all text-center text-base md:text-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
                required
              />
              {nama.length > 200 && (
                <p className="text-xs text-amber-600 text-center mt-1">
                  Sisa karakter: {255 - nama.length}
                </p>
              )}
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
        className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-10 backdrop-blur-sm bg-white/80"
        style={{
          borderColor: 'rgba(243, 244, 246, 0.5)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <p 
          className="text-xs sm:text-sm text-[#666666] font-medium" 
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          © 2026 KKN T31 MARGO LESTARI. EduCorner:SahabatMimpi
        </p>
      </footer>
    </div>
  );
}