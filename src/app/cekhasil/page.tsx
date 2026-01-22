"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HistoryItem {
  id: number;
  nama: string;
  karakter?: string;
  mbti_code?: string;
  posisi_1_nama?: string;
  posisi_1_persentase?: number;
  posisi_2_nama?: string;
  posisi_2_persentase?: number;
  posisi_3_nama?: string;
  posisi_3_persentase?: number;
  created_at: string;
}


type SortField = 'id' | 'nama' | 'mbti_code' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function CekHasilPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
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

  // Reset search term and sorting
  useEffect(() => {
    setSearchTerm("");
    setSortField('created_at');
    setSortOrder('desc');
  }, []);

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

  // Database 12 Profesi (sama seperti di kuis/page.tsx)
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

  // Deskripsi MBTI per tipe (sama seperti di kuis/page.tsx)
  const getMBTIDescription = (mbtiCode: string): string => {
    const descriptions: { [key: string]: string } = {
      "ISTJ": "Kamu suka keteraturan dan aturan, sehingga kamu bisa diandalkan untuk menyelesaikan tugas dengan rapi dan tuntas.",
      "ISFJ": "Kamu anak yang perhatian dan suka membantu, membuat orang di sekitarmu merasa aman dan dihargai.",
      "INFJ": "Kamu suka berpikir mendalam dan peduli pada perasaan orang lain, sehingga kamu pandai membawa kebaikan bagi sekitar.",
      "INTJ": "Kamu suka merencanakan sesuatu dengan tenang, dan itu membuatmu pintar menemukan solusi yang cerdas.",
      "ISTP": "Kamu suka mencoba langsung dan belajar dari pengalaman, sehingga kamu cepat tanggap menghadapi hal baru.",
      "ISFP": "Kamu lembut dan menyukai keindahan, sehingga kamu bisa membuat suasana menjadi lebih hangat dan menyenangkan.",
      "INFP": "Kamu punya imajinasi besar dan hati yang baik, membuatmu mampu memahami orang lain dengan cara yang unik.",
      "INTP": "Kamu suka berpikir dan bertanya, sehingga kamu hebat menemukan ide-ide baru dari sudut pandang berbeda.",
      "ESTP": "Kamu aktif dan berani mencoba hal baru, sehingga kamu cepat bertindak dan membawa semangat di sekitarmu.",
      "ESFP": "Kamu ceria dan suka bersama orang lain, sehingga kamu mudah membuat suasana menjadi lebih bahagia.",
      "ENFP": "Kamu penuh semangat dan ide, sehingga kamu bisa menginspirasi teman-teman dengan energi positifmu.",
      "ENTP": "Kamu suka berdiskusi dan berkreasi, membuatmu pandai menemukan banyak ide seru dalam waktu singkat.",
      "ESTJ": "Kamu suka mengatur dan memimpin, sehingga kamu hebat mengajak teman bekerja sama dengan tertib.",
      "ESFJ": "Kamu ramah dan peduli pada orang lain, sehingga kamu kuat dalam menjaga kebersamaan dan persahabatan.",
      "ENFJ": "Kamu suka menyemangati orang lain, sehingga kamu bisa membantu teman menjadi lebih percaya diri.",
      "ENTJ": "Kamu percaya diri dan suka membuat rencana, sehingga kamu hebat mengambil keputusan dan mengajak orang maju bersama."
    };
    return descriptions[mbtiCode] || "Kamu adalah anak yang unik! Kombinasi sifatmu menunjukkan potensi hebat.";
  };

  // Indikator kecocokan (sama seperti di kuis/page.tsx hasil cita-cita)
  const getMatchLabel = (percent: number): { emoji: string; text: string } => {
    if (percent === 100) return { emoji: "🌟", text: "Sangat Cocok" };
    if (percent >= 75) return { emoji: "😊", text: "Cocok" };
    return { emoji: "👍", text: `${percent}% Cocok` };
  };

  const handleDownloadPDF = async (item: HistoryItem) => {
    try {
      setDownloadingId(item.id);
      
      // Ambil data lengkap career dari activities berdasarkan nama posisi
      const getCareerData = (careerName: string) => {
        return activities.find(c => c.name === careerName) || null;
      };

      // Buat array topCareers dengan data lengkap
      const topCareers: any[] = [];
      if (item.posisi_1_nama) {
        const career1 = getCareerData(item.posisi_1_nama);
        if (career1) {
          topCareers.push({
            data: career1,
            score: Math.round((item.posisi_1_persentase || 0) / 25) // Convert persentase ke score (0-4)
          });
        }
      }
      if (item.posisi_2_nama) {
        const career2 = getCareerData(item.posisi_2_nama);
        if (career2) {
          topCareers.push({
            data: career2,
            score: Math.round((item.posisi_2_persentase || 0) / 25)
          });
        }
      }
      if (item.posisi_3_nama) {
        const career3 = getCareerData(item.posisi_3_nama);
        if (career3) {
          topCareers.push({
            data: career3,
            score: Math.round((item.posisi_3_persentase || 0) / 25)
          });
        }
      }

      // Generate PDF menggunakan logika yang sama seperti di kuis/page.tsx
      const { default: jsPDF } = await import('jspdf');
      
      // Helper function untuk clean text (sama seperti di kuis/page.tsx)
      const decodeHtmlEntities = (text: string): string => {
        if (typeof window === 'undefined') return text;
        try {
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          return textarea.value;
        } catch (e) {
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
        let cleaned = decodeHtmlEntities(String(text));
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        cleaned = cleaned.replace(/Ø=[^\s]*/g, '');
        cleaned = cleaned.replace(/[ØÞÜþ•]/g, '');
        cleaned = cleaned.replace(/&[^a-zA-Z0-9#;]/g, '');
        cleaned = cleaned.replace(/[^\x20-\x7E\n\r]/g, ' ');
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        cleaned = cleaned.replace(/0&lt;0/g, '');
        cleaned = cleaned.replace(/0=/g, '');
        cleaned = cleaned.replace(/#\s*0/g, '');
        cleaned = cleaned.replace(/0&lt;/g, '');
        cleaned = cleaned.replace(/&lt;0/g, '');
        cleaned = cleaned.replace(/[^a-zA-Z0-9\s.,!?;:()\-'":]/g, ' ');
        cleaned = cleaned.replace(/\s+/g, ' ');
        cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');
        return cleaned.trim();
      };
      
      const cleanedNama = cleanText(item.nama);
      const mbtiCode = item.mbti_code || '';
      
      const rawQuizDate = item.created_at 
        ? new Date(item.created_at).toLocaleDateString('id-ID', {
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

      // MBTI Code Box - sama seperti hasil kuis (dengan deskripsi MBTI)
      if (mbtiCode) {
        const mbtiDescription = getMBTIDescription(mbtiCode);
        const descriptionLines = pdf.splitTextToSize(mbtiDescription, contentWidth - 10);
        const boxHeight = Math.max(22, 8 + 12 + (descriptionLines.length * 5) + 8); // Label + Code + Description + padding

        pdf.setFillColor(255, 240, 243); // Very light pink
        pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 3, 3, 'F');

        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setLineWidth(0.6);
        pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 3, 3, 'D');

        pdf.setFontSize(10);
        pdf.setTextColor(102, 102, 102);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Kode Kepribadianmu:', margin + 5, yPos + 9);

        pdf.setFontSize(20);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFont('helvetica', 'bold');
        pdf.text(mbtiCode, margin + contentWidth - 5, yPos + 9, { align: 'right' });

        // Deskripsi MBTI
        pdf.setFontSize(9);
        pdf.setTextColor(102, 102, 102);
        pdf.setFont('helvetica', 'normal');
        let descY = yPos + 20;
        descriptionLines.forEach((line: string) => {
          pdf.text(line.trim(), margin + 5, descY);
          descY += 5;
        });

        yPos += boxHeight + 5;
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
        topCareers.forEach((careerItem, index) => {
          const career = careerItem.data;
          // Ambil persentase sesuai dengan posisi
          let matchPercent = 0;
          if (index === 0 && item.posisi_1_persentase) {
            matchPercent = item.posisi_1_persentase;
          } else if (index === 1 && item.posisi_2_persentase) {
            matchPercent = item.posisi_2_persentase;
          } else if (index === 2 && item.posisi_3_persentase) {
            matchPercent = item.posisi_3_persentase;
          } else {
            matchPercent = Math.round((careerItem.score / 4) * 100);
          }
          
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
          // Indikator kecocokan (Sangat Cocok / Cocok / X% Cocok) - sama seperti hasil cita-cita
          const matchLabelPdf = getMatchLabel(matchPercent);
          pdf.text(matchLabelPdf.text, margin + contentWidth - 8, startY, { align: 'right' });

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
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");
      // Tambahkan cache-busting dengan timestamp untuk memastikan data selalu fresh
      const response = await fetch(`/api/admin/all-data?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const result = await response.json();

      console.log('Fetch all data response:', {
        ok: response.ok,
        status: response.status,
        success: result.success,
        edu_corner_count: result.data?.edu_corner?.length || 0,
        career_explanations_count: result.data?.career_explanations?.length || 0
      });

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        const eduCornerData = result.data.edu_corner || [];
        
        console.log('Setting data:', {
          edu_corner: eduCornerData.length
        });
        
        setHistory(eduCornerData);
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
        // Refresh data setelah delete untuk memastikan sinkronisasi dengan database
        await fetchAllData();
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
      (item.karakter && item.karakter.toLowerCase().includes(searchLower)) ||
      (item.mbti_code && item.mbti_code.toLowerCase().includes(searchLower)) ||
      (item.posisi_1_nama && item.posisi_1_nama.toLowerCase().includes(searchLower)) ||
      (item.posisi_2_nama && item.posisi_2_nama.toLowerCase().includes(searchLower)) ||
      (item.posisi_3_nama && item.posisi_3_nama.toLowerCase().includes(searchLower))
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
        case 'mbti_code':
          aValue = (a.mbti_code || '').toLowerCase();
          bValue = (b.mbti_code || '').toLowerCase();
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

  const sortedHistory = getSortedHistory();

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
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm text-[#AD1457] font-semibold px-5 py-3 rounded-xl transition-all duration-300 border border-white/50 hover:border-white/70 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
                title="Refresh Data"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={loading ? "animate-spin" : ""}
                >
                  <path
                    d="M1 4V10H7M23 20V14H17M17 14L21 18M17 14L21 10M7 10L3 14M7 10L3 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">{loading ? 'Memuat...' : 'Refresh'}</span>
              </button>
              <Link
                href="/cekhasil/profile"
                className="inline-flex items-center gap-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm text-[#AD1457] font-semibold px-5 py-3 rounded-xl transition-all duration-300 border border-white/50 hover:border-white/70 hover:scale-105 shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
                title="Profil Admin"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                Profil
              </Link>
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
                {history.length}
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
                {sortedHistory.length}
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
                {new Set([
                  ...history.map((item) => item.posisi_1_nama).filter(Boolean),
                  ...history.map((item) => item.posisi_2_nama).filter(Boolean),
                  ...history.map((item) => item.posisi_3_nama).filter(Boolean)
                ]).size}
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
                placeholder="Cari berdasarkan nama, karakter, MBTI, atau posisi cita-cita..."
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
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FFB6C1] rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] mb-4">
              {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data"}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] mb-6">
              {searchTerm
                ? "Coba gunakan kata kunci lain untuk mencari"
                : "Belum ada hasil tes cita-cita yang tersimpan"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-block bg-[#FF69B4] hover:bg-[#FF5BA3] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-[#F48FB1] to-[#FCE4EC] px-4 sm:px-6 py-4">
              <div className="grid grid-cols-12 gap-2 sm:gap-4 text-white font-bold text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                <div className="col-span-1 text-center hidden sm:block">KARAKTER</div>
                <button
                  onClick={() => handleSort('mbti_code')}
                  className="col-span-1 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  MBTI{renderSortIcon('mbti_code')}
                </button>
                <div className="col-span-5 sm:col-span-4 text-center">3 POSISI CITA-CITA</div>
                <button
                  onClick={() => handleSort('created_at')}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer text-xs"
                >
                  TANGGAL{renderSortIcon('created_at')}
                </button>
                <div className="col-span-1 text-center">AKSI</div>
              </div>
            </div>

            {/* Table Body - Desktop Table View */}
            <div className="hidden md:block divide-y divide-gray-100">
              {sortedHistory.map((item, index) => {
                // Get character emoji based on karakter value
                const getCharacterEmoji = (karakter?: string) => {
                  const charMap: { [key: string]: string } = {
                    'Berani': '😊',
                    'Ceria': '👑',
                    'Pintar': '🦁',
                    'Aktif': '😸',
                    'Kreatif': '🌟'
                  };
                  return charMap[karakter || ''] || '👤';
                };
                const m1 = getMatchLabel(item.posisi_1_persentase || 0);
                const m2 = getMatchLabel(item.posisi_2_persentase || 0);
                const m3 = getMatchLabel(item.posisi_3_persentase || 0);

                return (
                  <div
                    key={item.id}
                    className="px-6 py-4 hover:bg-[#FFF5F7] transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 text-sm font-semibold text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.id}
                      </div>
                      <div className="col-span-2 text-sm font-bold text-[#2D2D2D] truncate" style={{ fontFamily: 'Inter, sans-serif' }} title={item.nama}>
                        {item.nama}
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="text-xl" title={item.karakter || 'Tidak ada'}>{getCharacterEmoji(item.karakter)}</span>
                      </div>
                      <div className="col-span-1 text-sm font-semibold text-[#4A4A4A] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {item.mbti_code || "-"}
                      </div>
                      <div className="col-span-4 text-xs text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <div className="flex flex-col gap-1.5">
                          {item.posisi_1_nama && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-[#AD1457] min-w-[16px] text-xs">1.</span>
                              <span className="text-[#2D2D2D] flex-1 truncate text-sm">{item.posisi_1_nama}</span>
                              <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 inline-flex items-center justify-center gap-1">
                                <span suppressHydrationWarning>{m1.emoji}</span> {m1.text}
                              </span>
                            </div>
                          )}
                          {item.posisi_2_nama && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-[#AD1457] min-w-[16px] text-xs">2.</span>
                              <span className="text-[#2D2D2D] flex-1 truncate text-sm">{item.posisi_2_nama}</span>
                              <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 inline-flex items-center justify-center gap-1">
                                <span suppressHydrationWarning>{m2.emoji}</span> {m2.text}
                              </span>
                            </div>
                          )}
                          {item.posisi_3_nama && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-[#AD1457] min-w-[16px] text-xs">3.</span>
                              <span className="text-[#2D2D2D] flex-1 truncate text-sm">{item.posisi_3_nama}</span>
                              <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 inline-flex items-center justify-center gap-1">
                                <span suppressHydrationWarning>{m3.emoji}</span> {m3.text}
                              </span>
                            </div>
                          )}
                          {!item.posisi_1_nama && !item.posisi_2_nama && !item.posisi_3_nama && (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 text-xs text-[#666666] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="col-span-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          disabled={downloadingId === item.id}
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] hover:shadow-lg text-[#AD1457] font-medium px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {downloadingId === item.id ? (
                            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
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
                );
              })}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 px-4 py-4">
              {sortedHistory.map((item, index) => {
                const getCharacterEmoji = (karakter?: string) => {
                  const charMap: { [key: string]: string } = {
                    'Berani': '😊',
                    'Ceria': '👑',
                    'Pintar': '🦁',
                    'Aktif': '😸',
                    'Kreatif': '🌟'
                  };
                  return charMap[karakter || ''] || '👤';
                };
                const m1 = getMatchLabel(item.posisi_1_persentase || 0);
                const m2 = getMatchLabel(item.posisi_2_persentase || 0);
                const m3 = getMatchLabel(item.posisi_3_persentase || 0);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F8BBD0] to-[#FCE4EC] rounded-lg flex items-center justify-center">
                          <span className="text-xl">{getCharacterEmoji(item.karakter)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#2D2D2D] text-base truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {item.nama}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#666666]">ID: {item.id}</span>
                            {item.mbti_code && (
                              <>
                                <span className="text-[#999]">•</span>
                                <span className="text-xs font-semibold text-[#4A4A4A]">{item.mbti_code}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Posisi Cita-Cita */}
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        3 Posisi Cita-Cita
                      </p>
                      {item.posisi_1_nama && (
                        <div className="flex items-center justify-between bg-[#FFF5F7] rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-bold text-[#AD1457] text-xs">1.</span>
                            <span className="text-sm text-[#2D2D2D] truncate flex-1">{item.posisi_1_nama}</span>
                          </div>
                          <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 ml-2 inline-flex items-center justify-center gap-1">
                            <span suppressHydrationWarning>{m1.emoji}</span> {m1.text}
                          </span>
                        </div>
                      )}
                      {item.posisi_2_nama && (
                        <div className="flex items-center justify-between bg-[#FFF5F7] rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-bold text-[#AD1457] text-xs">2.</span>
                            <span className="text-sm text-[#2D2D2D] truncate flex-1">{item.posisi_2_nama}</span>
                          </div>
                          <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 ml-2 inline-flex items-center justify-center gap-1">
                            <span suppressHydrationWarning>{m2.emoji}</span> {m2.text}
                          </span>
                        </div>
                      )}
                      {item.posisi_3_nama && (
                        <div className="flex items-center justify-between bg-[#FFF5F7] rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-bold text-[#AD1457] text-xs">3.</span>
                            <span className="text-sm text-[#2D2D2D] truncate flex-1">{item.posisi_3_nama}</span>
                          </div>
                          <span className="bg-[#FFE8EC] text-[#C2185B] px-2 py-0.5 rounded-full font-semibold text-xs min-w-[92px] text-center shrink-0 ml-2 inline-flex items-center justify-center gap-1">
                            <span suppressHydrationWarning>{m3.emoji}</span> {m3.text}
                          </span>
                        </div>
                      )}
                      {!item.posisi_1_nama && !item.posisi_2_nama && !item.posisi_3_nama && (
                        <p className="text-gray-400 text-xs text-center py-2">-</p>
                      )}
                    </div>

                    {/* Footer dengan Tanggal dan Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          disabled={downloadingId === item.id}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F8BBD0] to-[#FCE4EC] hover:shadow-md text-[#AD1457] font-medium px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {downloadingId === item.id ? (
                            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-[#666666]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Menampilkan 1-{sortedHistory.length} dari {sortedHistory.length} data
              </p>
            </div>
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
