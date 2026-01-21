"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StructuredData from "@/components/StructuredData";
import logoWebp from "../logo.webp";

interface QuizResult {
  nama: string;
  karakter: string;
  citaCita: string;
  timestamp: string;
}

export default function KuisPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [karakter, setKarakter] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  });
  const [mbtiCode, setMbtiCode] = useState<string>("");
  const [topCareers, setTopCareers] = useState<any[]>([]);
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

  const getCharacter = (karakterValue: string) => {
    const index = characters.findIndex(char => char.label === karakterValue);
    return characters[index] || characters[0];
  };

  // Load progress kuis dari localStorage saat component mount (hanya jika kuis masih berjalan)
  // Dan cek apakah hasil sudah siap untuk auto-reset
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && window.sessionStorage) {
        // Cek apakah hasil sudah siap (dari sessionStorage)
        const hasResultReady = sessionStorage.getItem("quizResultReady");
        
        // Cek progress kuis yang sedang berjalan
        const savedProgress = localStorage.getItem("quizProgress");
        
        if (hasResultReady === "true" && !savedProgress) {
          // Hasil sudah siap dan tidak ada progress kuis yang sedang berjalan
          // Reset semua dan mulai kuis baru
          sessionStorage.removeItem("quizResultReady");
          setShowResult(false);
          setShowQuiz(false);
          setSavedResult(null);
          setAnswers([]);
          setCurrentQuestion(0);
          setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
          setMbtiCode("");
          setTopCareers([]);
          setNama("");
          setKarakter("");
          setIsExpanded(false);
          setExplanation("");
          setOptionsVisible(false);
          return;
        }
        
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            // Validasi struktur data dan pastikan kuis masih berjalan (belum selesai)
            if (progress && typeof progress === 'object' && progress.nama && progress.karakter) {
              const savedAnswers = progress.answers || [];
              const savedScores = progress.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
              
              // Cari soal yang paling awal yang belum dijawab
              let firstUnansweredQuestion = 0;
              for (let i = 0; i < questions.length; i++) {
                if (savedAnswers[i] === undefined || savedAnswers[i] === null) {
                  firstUnansweredQuestion = i;
                  break;
                }
              }
              
              // Jika semua soal sudah dijawab, reset (hasil sudah siap)
              if (savedAnswers.length >= questions.length) {
                // Semua soal sudah dijawab, hapus progress dan set flag untuk reset
                localStorage.removeItem("quizProgress");
                try {
                  if (typeof window !== 'undefined' && window.sessionStorage) {
                    sessionStorage.setItem("quizResultReady", "true");
                  }
                } catch (e) {
                  console.warn("Gagal menyimpan flag hasil ke sessionStorage:", e);
                }
                // Reset semua state
                setShowResult(false);
                setShowQuiz(false);
                setSavedResult(null);
                setAnswers([]);
                setCurrentQuestion(0);
                setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
                setMbtiCode("");
                setTopCareers([]);
                setNama("");
                setKarakter("");
                setIsExpanded(false);
                setExplanation("");
                setOptionsVisible(false);
                return;
              }
              
              setNama(progress.nama || "");
              setKarakter(progress.karakter || "");
              setCurrentQuestion(firstUnansweredQuestion); // Kembali ke soal yang belum dijawab paling awal
              setAnswers(savedAnswers);
              setScores(savedScores);
              setShowQuiz(true);
              setShowResult(false); // Pastikan tidak menampilkan hasil
              setOptionsVisible(false);
              // Trigger animasi muncul untuk pertanyaan yang sedang dikerjakan
              setTimeout(() => {
                setOptionsVisible(true);
              }, 200);
            } else {
              // Data tidak valid atau kuis sudah selesai, hapus dari localStorage
              localStorage.removeItem("quizProgress");
            }
          } catch (e) {
            console.error("Error parsing saved progress:", e);
            // Hapus data corrupt dari localStorage
            localStorage.removeItem("quizProgress");
          }
        }
      }
    } catch (e) {
      // localStorage tidak tersedia atau blocked
      console.warn("localStorage tidak tersedia:", e);
    }
  }, []);

  // Simpan progress kuis ke localStorage setiap kali ada perubahan (hanya jika kuis masih berjalan)
  useEffect(() => {
    if (showQuiz && nama && karakter && !showResult && currentQuestion < questions.length) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const progress = {
            nama: nama,
            karakter: karakter,
            currentQuestion: currentQuestion,
            answers: answers,
            scores: scores
          };
          localStorage.setItem("quizProgress", JSON.stringify(progress));
        }
      } catch (e) {
        console.warn("Gagal menyimpan progress ke localStorage:", e);
      }
    }
  }, [showQuiz, nama, karakter, currentQuestion, answers, scores, showResult]);

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

  // Database 32 Soal MBTI (dari Python)
  const questions = [
    // === E vs I (8 soal) ===
    {
      question: "Saat jam istirahat di sekolah, kamu biasanya...",
      options: [
        { text: "Main rame-rame sama banyak teman", emoji: "🏃", traits: { E: 1 } },
        { text: "Main sama satu atau dua teman dekat saja", emoji: "👫", traits: { I: 1 } }
      ],
    },
    {
      question: "Kalau hari ulang tahunmu, kamu lebih suka...",
      options: [
        { text: "Ngundang banyak teman buat kumpul", emoji: "🎉", traits: { E: 1 } },
        { text: "Rayain sederhana sama keluarga", emoji: "🎂", traits: { I: 1 } }
      ],
    },
    {
      question: "Setelah pulang sekolah, kamu biasanya...",
      options: [
        { text: "Main dulu sama teman di sekitar rumah", emoji: "⚽", traits: { E: 1 } },
        { text: "Langsung istirahat atau main sendiri di rumah", emoji: "🏠", traits: { I: 1 } }
      ],
    },
    {
      question: "Kalau ada tugas kelompok dari guru, kamu lebih suka...",
      options: [
        { text: "Diskusi bareng-bareng sama teman", emoji: "👥", traits: { E: 1 } },
        { text: "Ngerjain pelan-pelan sendiri", emoji: "✏️", traits: { I: 1 } }
      ],
    },
    {
      question: "Kalau ada acara di sekolah (lomba, pentas, atau upacara besar)...",
      options: [
        { text: "Aku senang ikut kumpul dan ngobrol", emoji: "🗣️", traits: { E: 1 } },
        { text: "Aku lebih nyaman bareng teman dekat saja", emoji: "🙂", traits: { I: 1 } }
      ],
    },
    {
      question: "Saat main bareng teman, kamu biasanya...",
      options: [
        { text: "Banyak cerita dan bercanda", emoji: "😆", traits: { E: 1 } },
        { text: "Lebih sering dengerin dan sedikit bicara", emoji: "🤫", traits: { I: 1 } }
      ],
    },
    {
      question: "Kalau ada lomba 17-an di desa, kamu...",
      options: [
        { text: "Ikut ramai-ramai dan kenalan sama banyak teman", emoji: "🎈", traits: { E: 1 } },
        { text: "Ikut lomba bareng teman yang sudah dekat", emoji: "🪁", traits: { I: 1 } }
      ],
    },
    {
      question: "Setelah main lama dengan banyak teman, kamu merasa...",
      options: [
        { text: "Senang dan makin semangat", emoji: "⚡", traits: { E: 1 } },
        { text: "Capek dan ingin sendirian dulu", emoji: "😌", traits: { I: 1 } }
      ],
    },
    // === S vs N (8 soal) ===
    {
      question: "Kalau guru jelasin pelajaran, kamu lebih cepat paham kalau...",
      options: [
        { text: "Ada contoh yang bisa dilihat langsung", emoji: "👀", traits: { S: 1 } },
        { text: "Diceritain dulu maksud dari pelajarannya", emoji: "🌈", traits: { N: 1 } }
      ],
    },
    {
      question: "Kalau dengar cerita, kamu lebih suka cerita tentang...",
      options: [
        { text: "Kehidupan nyata sehari-hari", emoji: "🏠", traits: { S: 1 } },
        { text: "Cerita khayalan atau dongeng", emoji: "🐉", traits: { N: 1 } }
      ],
    },
    {
      question: "Kalau main balok atau lego, kamu biasanya...",
      options: [
        { text: "Menyusun pelan-pelan sesuai contoh", emoji: "📋", traits: { S: 1 } },
        { text: "Bikin bentuk sesuai ide sendiri", emoji: "✨", traits: { N: 1 } }
      ],
    },
    {
      question: "Pelajaran yang paling kamu nikmati biasanya...",
      options: [
        { text: "Yang ada praktiknya", emoji: "🔧", traits: { S: 1 } },
        { text: "Yang bisa pakai imajinasi", emoji: "💭", traits: { N: 1 } }
      ],
    },
    {
      question: "Kalau diminta menggambar, kamu lebih sering menggambar...",
      options: [
        { text: "Hal-hal yang sering kamu lihat", emoji: "🌾", traits: { S: 1 } },
        { text: "Hal-hal dari bayangan di kepala", emoji: "🌟", traits: { N: 1 } }
      ],
    },
    {
      question: "Saat mendengar cerita yang panjang, kamu biasanya...",
      options: [
        { text: "Suka mengingat semua nama-nama tokoh di ceritanya", emoji: "📝", traits: { S: 1 } },
        { text: "Ingat dan paham keseluruhan ceritanya saja", emoji: "💡", traits: { N: 1 } }
      ],
    },
    {
      question: "Kalau belajar atau bermain, kamu lebih suka...",
      options: [
        { text: "Fokus dan mendalami satu hal", emoji: "🎯", traits: { S: 1 } },
        { text: "Mencoba banyak hal baru", emoji: "🎈", traits: { N: 1 } }
      ],
    },
    {
      question: "Kalau main puzzle biasanya kamu...",
      options: [
        { text: "Langsung pasang kepingan yang cocok satu-satu", emoji: "🧩", traits: { S: 1 } },
        { text: "Membayangkan dulu gambar apa yang akan terbentuk", emoji: "🖼️", traits: { N: 1 } }
      ],
    },
    // === T vs F (8 soal) ===
    {
      question: "Kalau ada teman yang sedang sedih atau menangis, kamu biasanya...",
      options: [
        { text: "Tanya kenapanya dan coba bantu cari jalan keluar", emoji: "🤔", traits: { T: 1 } },
        { text: "Menemani dan menghiburnya dulu", emoji: "🤗", traits: { F: 1 } }
      ],
    },
    {
      question: "Saat mengerjakan soal atau tugas, kamu merasa senang kalau...",
      options: [
        { text: "Jawabannya jelas dan masuk akal", emoji: "✅", traits: { T: 1 } },
        { text: "Semua teman bisa bekerja dengan nyaman", emoji: "😊", traits: { F: 1 } }
      ],
    },
    {
      question: "Kalau main permainan bareng teman, kamu lebih senang kalau...",
      options: [
        { text: "Permainannya rapi dan aturannya jelas", emoji: "📏", traits: { T: 1 } },
        { text: "Semua teman bisa ikut dan senang", emoji: "🎮", traits: { F: 1 } }
      ],
    },
    {
      question: "Kalau ada teman melakukan kesalahan, kamu biasanya...",
      options: [
        { text: "Menjelaskan apa yang seharusnya dilakukan", emoji: "📘", traits: { T: 1 } },
        { text: "Menegur dengan kata-kata yang lembut", emoji: "💝", traits: { F: 1 } }
      ],
    },
    {
      question: "Saat harus memilih sesuatu bersama-sama, kamu lebih sering...",
      options: [
        { text: "Memikirkan mana yang paling masuk akal", emoji: "⚖️", traits: { T: 1 } },
        { text: "Memikirkan agar tidak ada yang tersinggung", emoji: "❤️", traits: { F: 1 } }
      ],
    },
    {
      question: "Kalau menonton cerita atau film yang sedih, kamu biasanya...",
      options: [
        { text: "Berpikir kenapa cerita itu bisa terjadi", emoji: "🧠", traits: { T: 1 } },
        { text: "Ikut merasakan sedihnya", emoji: "😢", traits: { F: 1 } }
      ],
    },
    {
      question: "Hal yang membuat kamu merasa bangga adalah...",
      options: [
        { text: "Bisa menyelesaikan masalah dengan baik", emoji: "💪", traits: { T: 1 } },
        { text: "Bisa membantu dan membuat orang lain senang", emoji: "🌟", traits: { F: 1 } }
      ],
    },
    {
      question: "Kalau ada teman yang sedang bertengkar, kamu cenderung...",
      options: [
        { text: "Mencari tahu masalahnya supaya selesai", emoji: "🔍", traits: { T: 1 } },
        { text: "Menenangkan dan mendamaikan mereka", emoji: "☮️", traits: { F: 1 } }
      ],
    },
    // === J vs P (8 soal) ===
    {
      question: "Kondisi kamarmu biasanya...",
      options: [
        { text: "Rapi dan barangnya tersusun", emoji: "🛏️", traits: { J: 1 } },
        { text: "Tidak selalu rapi, tapi aku tahu barangku di mana", emoji: "🎨", traits: { P: 1 } }
      ],
    },
    {
      question: "Kalau dapat PR dari guru, kamu biasanya...",
      options: [
        { text: "Langsung kerjakan saat pulang sekolah", emoji: "✍️", traits: { J: 1 } },
        { text: "Mengerjakannya setelah tidur siang atau main", emoji: "⏰", traits: { P: 1 } }
      ],
    },
    {
      question: "Dalam kegiatan sehari-hari, kamu lebih suka...",
      options: [
        { text: "Tahu rencana dari awal", emoji: "📅", traits: { J: 1 } },
        { text: "Melihat situasi dulu baru menentukan", emoji: "🌊", traits: { P: 1 } }
      ],
    },
    {
      question: "Kalau mau bermain bersama teman, kamu biasanya...",
      options: [
        { text: "Sepakati aturan main dulu", emoji: "📜", traits: { J: 1 } },
        { text: "Main dulu, aturannya sambil jalan", emoji: "🎲", traits: { P: 1 } }
      ],
    },
    {
      question: "Kamu lebih suka permainan yang...",
      options: [
        { text: "Ada aturan dan urutan bermainnya", emoji: "🗓️", traits: { J: 1 } },
        { text: "Tidak banyak aturan, yang penting asik", emoji: "🎭", traits: { P: 1 } }
      ],
    },
    {
      question: "Kalau rencana berubah tiba-tiba, kamu biasanya...",
      options: [
        { text: "Perlu waktu sebentar buat menyesuaikan", emoji: "🙂", traits: { J: 1 } },
        { text: "Bisa langsung menyesuaikan", emoji: "😎", traits: { P: 1 } }
      ],
    },
    {
      question: "Saat mengerjakan tugas atau pekerjaan, kamu lebih sering...",
      options: [
        { text: "Menyelesaikannya sampai selesai", emoji: "✔️", traits: { J: 1 } },
        { text: "Mengerjakannya bertahap", emoji: "⏸️", traits: { P: 1 } }
      ],
    },
    {
      question: "Kondisi tas sekolahmu biasanya...",
      options: [
        { text: "Buku dan alat tulis tertata rapi", emoji: "🎒", traits: { J: 1 } },
        { text: "Isinya kadang rapi, kadang campur", emoji: "👜", traits: { P: 1 } }
      ],
    },
  ];

  // Database 12 Profesi (dari Python)
  const activities = [
    {
      name: "Ahli Robotik & Komputer",
      desc: "Kamu punya otak yang suka berpikir dan memecahkan masalah! Kamu senang mencari tahu \"kenapa\" dan \"bagaimana\". Anak seperti kamu bisa membuat mesin jadi pintar, membuat komputer bisa membantu manusia, bahkan menciptakan teknologi masa depan. Kalau kamu rajin belajar dan terus mencoba, suatu hari kamu bisa bikin robot, game, atau aplikasi yang dipakai banyak orang!\n• Pembuat robot\n• Pembuat game\n• Programmer komputer\n• Teknisi komputer\n• Ahli IT",
      rolemodel: "Marc Raibert, Dr. Eng. Eniya Listiani Dewi, Alan Turing",
      traits: ["I", "N", "T", "P"],
      subjects: ["Matematika", "Komputer"],
      icon: "🤖"
    },
    {
      name: "Penemu & Ilmuwan",
      desc: "Kamu adalah anak yang penuh rasa ingin tahu! Kamu suka bertanya, mencoba, dan mencari jawaban dari hal-hal di sekitarmu. Anak seperti kamu bisa menemukan hal baru yang membuat hidup manusia lebih baik. Siapa tahu, suatu hari nanti kamu menemukan obat, alat, atau pengetahuan baru yang membuat dunia bangga padamu!\n• Ilmuwan sains\n• Peneliti\n• Penemu alat\n• Ahli IPA\n• Dosen atau guru sains",
      rolemodel: "Albert Einstein, Marie Curie, Dr. Jonas Salk",
      traits: ["I", "N", "T", "J"],
      subjects: ["IPA", "Matematika"],
      icon: "🔬"
    },
    {
      name: "Arsitek & Pembangun",
      desc: "Kamu punya kemampuan membuat sesuatu jadi nyata! Kamu bisa membayangkan bentuk, menghitung dengan teliti, dan membuat bangunan berdiri kuat dan indah. Anak seperti kamu bisa membangun rumah, jembatan, atau gedung yang dipakai banyak orang. Karyamu bisa dilihat, disentuh, dan dirasakan oleh semua orang!\n• Arsitek\n• Insinyur bangunan\n• Tukang ahli\n• Perencana bangunan\n• Desainer konstruksi",
      rolemodel: "Zaha Hadid, Ridwan Kamil, Gustave Eiffel",
      traits: ["I", "S", "T", "P"],
      subjects: ["Matematika", "Seni Budaya"],
      icon: "🏗️"
    },
    {
      name: "Dokter & Tenaga Medis",
      desc: "Kamu punya hati yang baik dan suka menolong orang lain. Kamu peduli saat melihat orang sakit dan ingin membuat mereka kembali sehat. Anak seperti kamu bisa menjadi pahlawan yang membantu banyak orang setiap hari. Dengan belajar sungguh-sungguh, suatu hari kamu bisa merawat, menyembuhkan, dan memberi harapan bagi banyak keluarga!\n• Dokter\n• Perawat\n• Bidan\n• Petugas kesehatan\n• Relawan medis",
      rolemodel: "Dr. Terawan, Dr. Ben Carson, Dr. Elizabeth Blackwell",
      traits: ["E", "S", "F", "J"],
      subjects: ["IPA", "PJOK", "Biologi", "Kesehatan"],
      icon: "👨‍⚕️"
    },
    {
      name: "Psikolog & Konselor",
      desc: "Kamu adalah anak yang tenang, sabar, dan pintar mendengarkan. Kamu bisa membuat orang lain merasa dimengerti dan tidak sendirian. Anak seperti kamu sangat dibutuhkan untuk membantu teman-teman yang sedang sedih atau bingung. Suatu hari nanti, kamu bisa menjadi orang yang memberi semangat dan membantu banyak orang menemukan kebahagiaan mereka.\n• Psikolog\n• Konselor sekolah\n• Guru BK\n• Pendamping anak\n• Pekerja sosial",
      rolemodel: "Seto Mulyadi (Kak Seto), Viktor Frankl, Carl Jung",
      traits: ["I", "N", "F", "J"],
      subjects: ["IPS", "Bahasa Indonesia", "PPKn"],
      icon: "🧠"
    },
    {
      name: "Penulis & Pembuat Cerita",
      desc: "Kamu punya imajinasi yang luas dan suka bercerita. Ide-ide di kepalamu bisa menjadi kisah seru yang membuat orang tertawa, terharu, atau berani bermimpi. Anak seperti kamu bisa membuat cerita yang dibaca banyak orang dan dikenang lama. Dengan rajin membaca dan menulis, kamu bisa menciptakan dunia buatanmu sendiri lewat kata-kata!\n• Penulis buku cerita\n• Penulis komik\n• Penulis cerita anak\n• Penulis film\n• Jurnalis",
      rolemodel: "JK Rowling, Andrea Hirata, George Lucas, Mario Vargas Llosa",
      traits: ["I", "N", "F", "P"],
      subjects: ["Bahasa Indonesia", "Seni Budaya", "Sastra"],
      icon: "✍️"
    },
    {
      name: "Seniman & Desainer",
      desc: "Kamu bisa melihat keindahan dari hal-hal sederhana. Kamu suka menggambar, mewarnai, dan mengekspresikan perasaan lewat karya. Anak seperti kamu bisa menciptakan gambar dan desain yang membuat orang kagum. Karyamu bisa menghiasi buku, baju, poster, atau bahkan bangunan!\n• Pelukis\n• Desainer gambar\n• Ilustrator\n• Pembuat poster\n• Perajin seni",
      rolemodel: "Raden Saleh, Affandi, Nyoman Nuarta",
      traits: ["I", "S", "F", "P"],
      subjects: ["Seni Budaya"],
      icon: "🎨"
    },
    {
      name: "Aktor & Penghibur",
      desc: "Kamu berani tampil dan suka menghibur orang lain. Kamu bisa membuat orang tertawa, tersenyum, atau terharu lewat peran yang kamu mainkan. Anak seperti kamu bisa tampil di panggung, film, atau pertunjukan. Dengan latihan dan percaya diri, kamu bisa menjadi penghibur yang disukai banyak orang!\n• Aktor film\n• Pemeran teater\n• Pengisi acara\n• Komedian\n• Presenter",
      rolemodel: "Reza Rahadian, Raffi Ahmad, Christine Hakim",
      traits: ["E", "S", "F", "P"],
      subjects: ["Teater", "Bahasa"],
      icon: "🎭"
    },
    {
      name: "Pemimpin (CEO) & Manajer",
      desc: "Kamu punya keberanian untuk memimpin dan mengambil keputusan. Kamu suka mengatur, mengajak teman bekerja sama, dan membuat rencana agar semuanya berjalan baik. Anak seperti kamu bisa menjadi pemimpin yang adil dan bertanggung jawab. Suatu hari nanti, kamu bisa memimpin sebuah tim besar dan membuat banyak orang bekerja bersama untuk tujuan yang baik!\n• Pemimpin tim\n• Manajer\n• Ketua organisasi\n• Kepala proyek\n• Direktur perusahaan",
      rolemodel: "Bill Gates, Elon Musk, Nadiem Makarim",
      traits: ["E", "N", "T", "J"],
      subjects: ["Organisasi", "IPS"],
      icon: "👔"
    },
    {
      name: "Pengusaha & Pedagang",
      desc: "Kamu berani mencoba hal baru dan tidak mudah menyerah. Kamu pandai melihat kesempatan dan suka mencari cara agar sesuatu bisa berjalan lebih baik. Anak seperti kamu bisa membangun usaha sendiri dan menciptakan lapangan kerja untuk orang lain. Dengan belajar berhitung, merencanakan, dan berusaha, kamu bisa mewujudkan ide-idemu menjadi sesuatu yang nyata!\n• Pemilik usaha\n• Pedagang\n• Wirausaha\n• Pembuat produk\n• Pengelola bisnis",
      rolemodel: "Jack Ma, Warren Buffett, Bob Sadino",
      traits: ["E", "S", "T", "P"],
      subjects: ["Matematika", "IPS"],
      icon: "💼"
    },
    {
      name: "Polisi, TNI & Penegak Hukum",
      desc: "Kamu punya keberanian dan rasa tanggung jawab yang besar. Kamu suka aturan, keadilan, dan ingin melindungi orang lain. Anak seperti kamu bisa menjadi penjaga keamanan dan pembela kebenaran. Dengan disiplin dan latihan, kamu bisa menjaga ketertiban dan membuat lingkungan jadi aman dan damai.\n• Polisi\n• Tentara (TNI)\n• Penjaga keamanan\n• Petugas hukum\n• Aparat negara",
      rolemodel: "Eliot Ness, Alexander the Great, Jenderal Hoegeng Iman Santoso",
      traits: ["I", "S", "T", "J"],
      subjects: ["PJOK", "PPKn"],
      icon: "👮"
    },
    {
      name: "Diplomat & Juru Bicara",
      desc: "Kamu pandai berbicara dan bisa menyampaikan pendapat dengan baik. Kamu juga mampu mendengarkan dan menyatukan banyak orang yang berbeda. Anak seperti kamu bisa menjadi penyampai pesan yang membawa kedamaian dan pengertian. Suaramu bisa membuat orang lain saling memahami dan bekerja sama.\n• Diplomat\n• Juru bicara\n• Pembawa acara\n• Duta\n• Negosiator",
      rolemodel: "Najwa Shihab, Angelina Jolie",
      traits: ["E", "N", "F", "J"],
      subjects: ["Bahasa Indonesia", "Bahasa Inggris", "PPKn", "IPS"],
      icon: "🎤"
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nama.trim() && karakter) {
      // Reset state untuk kuis baru
      setShowResult(false);
      setSavedResult(null);
      setAnswers([]);
      setCurrentQuestion(0);
      setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
      setMbtiCode("");
      setTopCareers([]);
      setShowQuiz(true);
      setOptionsVisible(false);
      // Hapus progress lama dari localStorage dan flag hasil dari sessionStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("quizProgress");
        }
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem("quizResultReady");
        }
      } catch (e) {
        console.warn("Gagal menghapus progress dari localStorage:", e);
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
    
    // Update scores berdasarkan traits dari jawaban
    const question = questions[currentQuestion];
    const selectedOption = question.options[answerIndex];
    const newScores = { ...scores };
    
    if (selectedOption.traits) {
      const traitsObj = selectedOption.traits as unknown as Record<string, number>;
      Object.keys(traitsObj).forEach((trait) => {
        const traitKey = trait as keyof typeof newScores;
        if (traitKey in newScores && trait in traitsObj) {
          const traitValue = traitsObj[trait];
          if (typeof traitValue === 'number') {
            newScores[traitKey] = (newScores[traitKey] || 0) + traitValue;
          }
        }
      });
    }
    setScores(newScores);
    
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
      // Hitung Kode Kepribadian MBTI (E/I, S/N, T/F, J/P)
      const myCode = 
        (newScores.E >= newScores.I ? "E" : "I") +
        (newScores.S >= newScores.N ? "S" : "N") +
        (newScores.T >= newScores.F ? "T" : "F") +
        (newScores.J >= newScores.P ? "J" : "P");
      
      setMbtiCode(myCode);
      
      // Algoritma Pencocokan dengan Profesi
      const matches = activities.map((career) => {
        // Hitung berapa banyak huruf yang cocok (0 sampai 4)
        let matchPoints = 0;
        career.traits.forEach((trait) => {
          if (myCode.includes(trait)) {
            matchPoints += 1;
          }
        });
        
        return {
          data: career,
          score: matchPoints
        };
      });
      
      // Urutkan dari poin tertinggi dan ambil top 3
      matches.sort((a, b) => b.score - a.score);
      const top3 = matches.slice(0, 3);
      setTopCareers(top3);
      
      // Simpan hasil ke database dengan data lengkap
      const hasilCitaCita = top3[0] ? top3[0].data.name : "Belum ditentukan";
      saveResult(hasilCitaCita, myCode, top3);
      
      // Hapus progress dari localStorage karena kuis sudah selesai
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("quizProgress");
        }
      } catch (e) {
        console.warn("Gagal menghapus progress dari localStorage:", e);
      }
      
      // Cleanup timer sebelumnya jika ada
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setShowResult(true);
        // Simpan flag bahwa hasil sudah siap (untuk auto-reset saat refresh)
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem("quizResultReady", "true");
          }
        } catch (e) {
          console.warn("Gagal menyimpan flag hasil ke sessionStorage:", e);
        }
        transitionTimerRef.current = null;
      }, 800);
    }
  };

  const saveResult = async (hasilCitaCita: string, mbtiCodeValue: string, topCareersData: any[]) => {
    setIsSaving(true);
    
    // Validasi karakter sebelum menyimpan
    if (!karakter || karakter.trim() === '') {
      console.error('Karakter tidak terisi!', { karakter });
      setIsSaving(false);
      return;
    }
    
    const result: QuizResult = {
      nama: nama.trim(),
      karakter: karakter,
      citaCita: hasilCitaCita,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Menyimpan hasil kuis:', result);

    // Set state saja, tidak simpan ke localStorage
    setSavedResult(result);

    // Simpan ke database dengan data lengkap
    try {
      // Format topCareers untuk disimpan ke database - hanya 3 posisi cita-cita dengan kecocokan
      const topCareersFormatted = topCareersData.map((item, index) => ({
        position: index + 1, // Posisi 1, 2, 3
        name: item.data.name,
        matchPercent: Math.round((item.score / 4) * 100),
        score: item.score
      }));

      // Log data yang akan dikirim
      const dataToSend = {
        nama: result.nama,
        karakter: result.karakter,
        mbtiCode: mbtiCodeValue,
        topCareers: topCareersFormatted,
      };
      
      console.log('Mengirim data ke database:', dataToSend);
      
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const responseData = await response.json();
          errorMessage = responseData.error || responseData.message || errorMessage;
          console.error("Error saving to database:", {
            status: response.status,
            statusText: response.statusText,
            error: responseData.error,
            message: responseData.message,
            fullResponse: responseData
          });
        } catch (parseError) {
          const textResponse = await response.text();
          console.error("Error saving to database (non-JSON response):", {
            status: response.status,
            statusText: response.statusText,
            body: textResponse
          });
          errorMessage = textResponse || errorMessage;
        }
        console.error("Response status:", response.status);
        // Tetap lanjutkan meskipun gagal save ke database
      } else {
        const responseData = await response.json();
        console.log("Data berhasil disimpan ke database:", responseData);
      }
    } catch (error: any) {
      // Tangani berbagai jenis error dengan lebih baik
      const errorDetails = {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Error',
        stack: error?.stack,
        cause: error?.cause,
        toString: error?.toString()
      };
      console.error("Error saving to database:", errorDetails);
      console.error("Full error object:", error);
      // Tetap lanjutkan meskipun gagal save ke database
    } finally {
      setIsSaving(false);
    }
  };

  const getResultCitaCita = () => {
    if (savedResult) {
      return savedResult.citaCita;
    }
    // Gunakan profesi teratas dari topCareers jika ada
    if (topCareers.length > 0) {
      return topCareers[0].data.name;
    }
    return "Belum ditentukan";
  };

  const handleCobaTesLagi = () => {
    setShowResult(false);
    setShowQuiz(false);
    setSavedResult(null);
    setAnswers([]);
    setCurrentQuestion(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setMbtiCode("");
    setTopCareers([]);
    setNama("");
    setKarakter("");
    setIsExpanded(false);
    setExplanation("");
    // Hapus progress dari localStorage dan flag hasil dari sessionStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("quizProgress");
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem("quizResultReady");
      }
    } catch (e) {
      console.warn("Gagal menghapus progress dari localStorage:", e);
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
      
      const displayNama = savedResult?.nama || nama;
      const displayKarakter = savedResult?.karakter || karakter;
      
      // CLEAN SEMUA TEKS SEBELUM DIGUNAKAN
      const cleanedNama = cleanText(displayNama);
      const cleanedKarakter = cleanText(displayKarakter);
      
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

      // Helper function untuk check dan add page jika perlu
      const checkAndAddPage = (currentY: number, pageNum: number, minSpace: number = 20): number => {
        if (currentY + minSpace > pageHeight - footerHeight) {
          addFooter(pageNum, 0);
          pdf.addPage();
          return pageNum + 1;
        }
        return pageNum;
      };

      // Header dengan gradient effect - format lebih bagus
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 55, 'F');
      
      // Title dengan spacing lebih baik
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('EduCorner: SahabatMimpi', margin, 35);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 255, 255);
      pdf.text('KKN T Margo Lestari', margin, 44);

      let yPos = 70;
      let pageNum = 1;

      // Title Section - Hasil Analisis Misi dengan format lebih bagus
      pdf.setFontSize(18);
      pdf.setTextColor(233, 30, 99); // #E91E63
      pdf.setFont('helvetica', 'bold');
      pdf.text('Hasil Analisis Misi', margin, yPos);
      yPos += 12;

      // MBTI Code Box - format lebih bagus
      if (mbtiCode) {
        pdf.setFillColor(255, 240, 243); // Very light pink
        pdf.roundedRect(margin, yPos, contentWidth, 22, 3, 3, 'F');
        
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setLineWidth(0.6);
        pdf.roundedRect(margin, yPos, contentWidth, 22, 3, 3, 'D');
        
        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Kode Kepribadianmu:', margin + 5, yPos + 9);
        
        pdf.setFontSize(20);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFont('helvetica', 'bold');
        pdf.text(mbtiCode, margin + contentWidth - 5, yPos + 16, { align: 'right' });
        yPos += 28;
      }

      // Info Box - Nama dan Tanggal Kuis (format lebih bagus)
      pdf.setFillColor(245, 249, 240); // Light green background
      pdf.roundedRect(margin, yPos, contentWidth, 24, 3, 3, 'F');
      
      // Border untuk info box
      pdf.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, yPos, contentWidth, 24, 3, 3, 'D');
      
      // Nama dengan format lebih bagus
      pdf.setFontSize(11);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Nama:`, margin + 5, yPos + 9);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(cleanedNama, margin + 32, yPos + 9);
      
      // Tanggal Kuis dengan format lebih bagus
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Tanggal Kuis: ${quizDate}`, margin + 5, yPos + 17);
      yPos += 30;

      // Section Title - Pekerjaan Masa Depan yang Cocok - format lebih bagus
      pdf.setFontSize(15);
      pdf.setTextColor(233, 30, 99); // #E91E63
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pekerjaan Masa Depan yang Cocok:', margin, yPos);
      yPos += 15;

      // Top 3 Careers Section
      if (topCareers.length > 0) {
        topCareers.forEach((item, index) => {
          const career = item.data;
          const matchPercent = Math.round((item.score / 4) * 100);
          
          // Check jika perlu page baru sebelum mulai card baru
          pageNum = checkAndAddPage(yPos, pageNum, 100);
          if (yPos + 100 > pageHeight - footerHeight) {
            yPos = margin + 5;
          }

          // Career Card - Outer Border
          const cardStartY = yPos;

          // Hitung tinggi header berdasarkan panjang career name
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          const careerName = cleanText(career.name);
          // Career name width: contentWidth - badge area (28mm) - match percent area (45mm) - padding (10mm)
          const careerNameWidth = contentWidth - 28 - 45 - 10;
          const careerNameLines = pdf.splitTextToSize(careerName, careerNameWidth);
          const headerHeight = Math.max(26, 8 + (careerNameLines.length * 7) + 4); // Minimum 26mm, dinamis berdasarkan jumlah baris

          // Header Card dengan background - format lebih bagus
          pdf.setFillColor(255, 228, 233); // Light pink
          pdf.roundedRect(margin, yPos, contentWidth, headerHeight, 4, 4, 'F');
          
          // Border untuk header - lebih tebal untuk lebih jelas
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(0.7);
          pdf.roundedRect(margin, yPos, contentWidth, headerHeight, 4, 4, 'D');

          // Badge untuk posisi dengan background lebih besar
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.circle(margin + 14, yPos + headerHeight / 2, 10, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}`, margin + 14, yPos + headerHeight / 2 + 2.5, { align: 'center' });

          // Career Name - posisi dinamis berdasarkan tinggi header, tidak overlap dengan badge dan match percent
          pdf.setFontSize(15);
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.setFont('helvetica', 'bold');
          const startY = yPos + 9;
          careerNameLines.forEach((line: string, idx: number) => {
            pdf.text(line.trim(), margin + 30, startY + (idx * 7.5));
          });
          
          // Match Percent di kanan - posisi dinamis, tidak overlap dengan career name
          pdf.setFontSize(13);
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${matchPercent}%`, margin + contentWidth - 8, startY, { align: 'right' });
          
          pdf.setFontSize(9);
          pdf.setTextColor(102, 102, 102);
          pdf.setFont('helvetica', 'normal');
          pdf.text('Kecocokan', margin + contentWidth - 8, startY + 7, { align: 'right' });

          yPos += headerHeight + 8;

          // Deskripsi Career dengan spacing lebih baik - format lebih bagus
          pdf.setFontSize(10.5);
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.setFont('helvetica', 'normal');
          const careerDesc = cleanText(career.desc);
          const descLines = pdf.splitTextToSize(careerDesc, contentWidth - 10);
          
          descLines.forEach((line: string) => {
            pageNum = checkAndAddPage(yPos, pageNum, 7);
            if (yPos + 7 > pageHeight - footerHeight) {
              yPos = margin + 5;
            }
            if (line.trim()) {
              pdf.text(line.trim(), margin + 5, yPos);
              yPos += 7;
            }
          });
          yPos += 10;

          // Role Model Box - hitung tinggi dinamis dengan spacing lebih baik
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          const roleModel = cleanText(career.rolemodel);
          // Width untuk konten: contentWidth - margin kiri (5) - margin kanan (5) = contentWidth - 10
          const roleModelLines = pdf.splitTextToSize(roleModel, contentWidth - 10);
          // Tinggi = label (7mm) + spacing setelah label (3mm) + (jumlah baris * 7mm) + padding bottom (12mm)
          const roleModelBoxHeight = Math.max(26, 7 + 3 + (roleModelLines.length * 7) + 12);
          
          pageNum = checkAndAddPage(yPos, pageNum, roleModelBoxHeight + 3);
          if (yPos + roleModelBoxHeight > pageHeight - footerHeight) {
            yPos = margin + 5;
          }
          
          pdf.setFillColor(255, 240, 243); // Very light pink
          pdf.roundedRect(margin, yPos, contentWidth, roleModelBoxHeight, 3, 3, 'F');
          
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(0.3);
          pdf.roundedRect(margin, yPos, contentWidth, roleModelBoxHeight, 3, 3, 'D');
          
          // Label "Tokoh Hebat:"
          pdf.setFontSize(9);
          pdf.setTextColor(102, 102, 102);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Tokoh Hebat:', margin + 5, yPos + 7);
          
          // Konten Role Model - mulai dari bawah label dengan spacing yang cukup
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          const roleModelStartY = yPos + 10; // Mulai dari bawah label dengan spacing 3mm
          roleModelLines.forEach((line: string, idx: number) => {
            if (line.trim()) {
              pdf.text(line.trim(), margin + 5, roleModelStartY + (idx * 7));
            }
          });
          yPos += roleModelBoxHeight + 25; // Spacing ke bawah ditambah menjadi 25mm

          // Subjects Box - hitung tinggi dinamis dengan spacing lebih baik
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          const subjects = Array.isArray(career.subjects) ? career.subjects.join(', ') : career.subjects;
          const subjectsText = cleanText(subjects);
          // Width untuk konten: contentWidth - margin kiri (5) - margin kanan (5) = contentWidth - 10
          const subjectsLines = pdf.splitTextToSize(subjectsText, contentWidth - 10);
          // Tinggi = label (7mm) + spacing setelah label (3mm) + (jumlah baris * 7mm) + padding bottom (12mm)
          const subjectsBoxHeight = Math.max(26, 7 + 3 + (subjectsLines.length * 7) + 12);
          
          pageNum = checkAndAddPage(yPos, pageNum, subjectsBoxHeight + 3);
          if (yPos + subjectsBoxHeight > pageHeight - footerHeight) {
            yPos = margin + 5;
          }
          
          pdf.setFillColor(225, 245, 254); // Light blue
          pdf.roundedRect(margin, yPos, contentWidth, subjectsBoxHeight, 3, 3, 'F');
          
          pdf.setDrawColor(2, 119, 189); // Blue
          pdf.setLineWidth(0.3);
          pdf.roundedRect(margin, yPos, contentWidth, subjectsBoxHeight, 3, 3, 'D');
          
          // Label "Pelajaran Favorit:"
          pdf.setFontSize(9);
          pdf.setTextColor(102, 102, 102);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Pelajaran Favorit:', margin + 5, yPos + 7);
          
          // Konten Subjects - mulai dari bawah label dengan spacing yang cukup
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(1, 87, 155); // Dark blue
          const subjectsStartY = yPos + 10; // Mulai dari bawah label dengan spacing 3mm
          subjectsLines.forEach((line: string, idx: number) => {
            if (line.trim()) {
              pdf.text(line.trim(), margin + 5, subjectsStartY + (idx * 7));
            }
          });
          yPos += subjectsBoxHeight + 25; // Spacing ke bawah ditambah menjadi 25mm

          // Draw card border setelah semua konten selesai
          const cardEndY = yPos;
          const cardHeight = cardEndY - cardStartY;
          pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
          pdf.setLineWidth(0.5);
          pdf.roundedRect(margin, cardStartY, contentWidth, cardHeight, 3, 3, 'D');

          // Spacing antar career
          yPos += 12;
        });
      }

      // Add footer to all pages
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
      }

      // Generate filename dengan tanggal dan jam
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      // Format: Hasil-Kuis-Educorner-YYYYMMDD-HHMMSS.pdf
      const fileName = `Hasil-Kuis-Educorner-${year}${month}${day}-${hours}${minutes}${seconds}.pdf`;
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
    const displayKarakter = savedResult?.karakter || karakter;


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
        <div className="min-h-screen bg-gradient-to-br from-[#FFE8EC] via-[#FFF5F7] to-[#FFE8EC] flex flex-col relative overflow-x-hidden">
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
        <div className="flex-1 flex items-center justify-center px-4 py-8 pb-24">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in relative z-10">
          {/* Header dengan Avatar */}
          <div className="bg-gradient-to-br from-[#FFE8EC] to-[#FFF0F3] px-8 py-10 text-center relative">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-4xl opacity-30 animate-pulse" suppressHydrationWarning>🎨</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }} suppressHydrationWarning>⭐</div>
            
            {/* Avatar dengan border dekoratif */}
            <div className="relative inline-block mb-4">
              {(() => {
                const char = getCharacter(displayKarakter);
                // Map warna gradient berdasarkan karakter
                const gradientColors: { [key: string]: string } = {
                  'Berani': 'from-blue-400 to-blue-600',
                  'Ceria': 'from-pink-400 to-pink-600',
                  'Pintar': 'from-orange-400 to-orange-600',
                  'Aktif': 'from-green-400 to-green-600',
                  'Kreatif': 'from-purple-400 to-purple-600'
                };
                const badgeColors: { [key: string]: string } = {
                  'Berani': 'from-blue-300 to-blue-500',
                  'Ceria': 'from-pink-300 to-pink-500',
                  'Pintar': 'from-orange-300 to-orange-500',
                  'Aktif': 'from-green-300 to-green-500',
                  'Kreatif': 'from-purple-300 to-purple-500'
                };
                const gradientColor = gradientColors[displayKarakter] || 'from-[#A7C957] to-[#6A994E]';
                const badgeColor = badgeColors[displayKarakter] || 'from-yellow-400 to-orange-400';
                
                return (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} rounded-full blur-md opacity-30 animate-pulse`}></div>
                    <div className={`relative w-32 h-32 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl`}>
                      <span className="text-6xl" suppressHydrationWarning>{char.emoji}</span>
                      {/* Badge indicator dengan emoji karakter */}
                      <div className={`absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br ${badgeColor} rounded-full flex items-center justify-center border-2 border-white animate-bounce`}>
                        <span className="text-xl" suppressHydrationWarning>{char.emoji}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Title dengan animasi */}
            <div className="space-y-3 animate-fade-in">
              <p className="text-[#E91E63] text-lg font-bold italic flex items-center justify-center gap-2">
                <span suppressHydrationWarning>🎉</span>
                <span>{displayNama}, Ini Hasil Kuis Kamu!</span>
              </p>
              
              {/* MBTI Code */}
              {mbtiCode && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-4 border-2 border-[#FF4D6D]">
                  <p className="text-sm text-[#666666] mb-1">Kode Kepribadianmu:</p>
                  <p className="text-3xl font-bold text-[#FF4D6D]">{mbtiCode}</p>
                  <p className="text-xs text-[#999999] mt-2">Kamu adalah anak yang unik! Kombinasi sifatmu menunjukkan potensi hebat.</p>
                </div>
              )}
              
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
                🌟 Pekerjaan Masa Depan yang Cocok: 🌟
              </h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8 space-y-6">
            {/* Top 3 Profesi */}
            {topCareers.length > 0 ? (
              topCareers.map((item, index) => {
                const career = item.data;
                const matchPercent = Math.round((item.score / 4) * 100);
                
                return (
                  <div key={index} className="bg-gradient-to-br from-white to-[#FFF8F9] rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-[#FFE4E9] to-[#FFD4E5] rounded-xl p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl" suppressHydrationWarning>{career.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-[#2D2D2D]">{career.name}</h3>
                          <p className="text-sm text-[#666666]">Posisi #{index + 1}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-full px-4 py-2 border-2 border-[#FF4D6D]">
                        <p className="text-sm font-bold text-[#FF4D6D]">Kecocokan: {matchPercent}%</p>
                      </div>
                    </div>
                    
                    {/* Deskripsi */}
                    <div className="mb-4">
                      <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-line">
                        {career.desc}
                      </p>
                    </div>
                    
                    {/* Role Model */}
                    <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FFE8EC] rounded-xl p-3 mb-3">
                      <p className="text-sm font-semibold text-[#666666] mb-1">🦸 Tokoh Hebat:</p>
                      <p className="text-sm text-[#2D2D2D] font-medium">{career.rolemodel}</p>
                    </div>
                    
                    {/* Subjects */}
                    <div className="bg-gradient-to-r from-[#E1F5FE] to-[#B3E5FC] rounded-xl p-3">
                      <p className="text-sm font-semibold text-[#0277BD] mb-1">📚 Pelajaran Favorit:</p>
                      <p className="text-sm font-bold text-[#01579B]">{career.subjects.join(", ")}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-gradient-to-r from-[#F5F9F0] to-[#F0F7E8] rounded-2xl p-6 border-l-4 border-[#A7C957]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A7C957] to-[#6A994E] rounded-full flex items-center justify-center shrink-0 shadow-lg">
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
            )}


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
                  router.push("/");
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
          className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-50 backdrop-blur-sm bg-white/80"
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
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F3] via-[#FFF5F7] to-[#FFF0F3] relative overflow-x-hidden overflow-y-auto">
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
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 max-w-4xl relative z-10 pb-20">
          {/* Progress Bar dengan Counter */}
          <div className="mb-4 sm:mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg">
                  Pertanyaan {currentQuestion + 1} dari {questions.length}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#666666] hidden sm:inline" style={{ fontFamily: 'Inter, sans-serif' }}>Progres Kuis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#FF4D6D]" style={{ fontFamily: 'Inter, sans-serif' }}>{Math.round(progress)}%</span>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#FF4D6D] rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#FF4D6D] via-[#FF6B8A] to-[#FF8FA3] h-2 sm:h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
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
            className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 relative overflow-hidden ${
              isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
            } transition-all duration-500 ease-out`}
          >
            {/* Decorative Background Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#FFE4E9]/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-[#FFF0F3]/30 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-[#FF4D6D]/10 to-[#FF6B8A]/10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#FF4D6D]/20">
                  <span className="text-xs sm:text-sm font-semibold text-[#FF4D6D]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Pilih salah satu yang paling sesuai denganmu
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4 sm:mb-6 md:mb-8 text-center leading-tight px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {question.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {question.options.map((option: any, index: number) => (
                  <button
                    key={`${currentQuestion}-${index}`}
                    onClick={() => handleAnswer(index)}
                    className={`relative w-full bg-gradient-to-br from-white to-[#FFF8F9] hover:from-[#FFF0F3] hover:to-[#FFE4E9] border-2 border-gray-200 hover:border-[#FF4D6D] text-[#2D2D2D] font-medium px-4 sm:px-6 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl text-center transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-md hover:shadow-xl group flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 min-h-[240px] sm:min-h-[280px] md:min-h-[320px] overflow-hidden ${
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

                    {/* Emoji dan Text */}
                    <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 md:gap-4 w-full" style={{
                      animationDelay: `${index * 200 + 150}ms`,
                      animation: optionsVisible && !isTransitioning ? 'scaleInBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                      opacity: optionsVisible ? 1 : 0
                    }}>
                      <div className="text-4xl sm:text-5xl md:text-6xl">
                        <span suppressHydrationWarning>{option.emoji}</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-center px-2 sm:px-4 leading-relaxed">
                        {option.text}
                      </p>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E9] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF4D6D] to-[#FF6B8A] shadow-lg animate-bounce-slow">
                <span className="text-lg sm:text-xl" suppressHydrationWarning>💪</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Kamu Pasti Bisa</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#A7C957] to-[#6A994E] shadow-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <span className="text-lg sm:text-xl" suppressHydrationWarning>🌟</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#6A994E] uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Raih Mimpimu</span>
            </div>
          </div>
        </main>

        {/* Footer - sama seperti page.tsx */}
        <footer 
          className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-50 backdrop-blur-sm bg-white/80"
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
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 pb-24 max-w-3xl relative z-10">
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
                    onClick={() => setKarakter(char.label)}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      karakter === char.label 
                        ? "scale-110" 
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${char.bgColor} flex items-center justify-center text-3xl md:text-4xl shadow-md transition-all ${
                      karakter === char.label ? `ring-4 ${char.ringColor} shadow-lg` : ""
                    }`}>
                      <span suppressHydrationWarning>{char.emoji}</span>
                    </div>
                    <span className={`text-xs md:text-sm font-semibold mt-2 ${
                      karakter === char.label ? "text-[#FF4D6D]" : "text-[#666666]"
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
              disabled={!nama.trim() || !karakter}
              className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-md disabled:cursor-not-allowed disabled:shadow-none text-base md:text-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="uppercase tracking-wide">Mulai Kuis Sekarang</span>
              <span className="text-xl" suppressHydrationWarning>🚀</span>
            </button>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-8 mb-20 text-center relative" style={{ position: 'relative', zIndex: 100 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFE8EC] to-[#FFD4E5] hover:from-[#FFB6C1] hover:to-[#FFE8EC] text-[#FF4D6D] hover:text-[#E91E63] font-semibold text-sm transition-all px-5 py-2.5 rounded-xl border-2 border-[#FFD4E5] hover:border-[#FFB6C1] shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              position: 'relative',
              zIndex: 100,
              pointerEvents: 'auto',
              display: 'inline-flex'
            }}
          >
            <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>

      {/* Footer - sama seperti page.tsx */}
      <footer 
        className="fixed bottom-0 left-0 right-0 text-center py-3 sm:py-4 border-t px-4 z-50 backdrop-blur-sm bg-white/80"
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