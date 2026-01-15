// Utility function untuk generate PDF (bisa digunakan di berbagai tempat)
export async function generatePDFFromData(data: {
  nama: string;
  kelas: string;
  citaCita: string;
  explanation: string;
  timestamp?: string;
}) {
  const { default: jsPDF } = await import('jspdf');
  
  // Helper function untuk clean text
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

  const cleanedCitaCita = cleanText(data.citaCita);
  const cleanedNama = cleanText(data.nama);
  const cleanedKelas = cleanText(data.kelas);
  const displayExplanation = cleanText(data.explanation || `Menjadi ${cleanedCitaCita} adalah profesi yang sangat menarik!`);
  
  const quizDate = data.timestamp 
    ? cleanText(new Date(data.timestamp).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))
    : cleanText(new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));

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

  const primaryColor = [255, 77, 109];
  const secondaryColor = [167, 209, 41];
  const textColor = [45, 45, 45];
  const lightGray = [230, 230, 230];

  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'normal');
    pdf.text('© 2024 EduCorner: SahabatMimpi. KKN T Margo Lestari.', pageWidth / 2, footerY, { align: 'center' });
    
    const date = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Dibuat pada: ${date}`, pageWidth / 2, footerY + 5, { align: 'center' });
    pdf.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth / 2, footerY + 10, { align: 'center' });
  };

  // Header
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('EduCorner: SahabatMimpi', margin, 28);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('KKN T Margo Lestari', margin, 35);

  let yPos = 65;

  // Card Background
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, yPos - 5, contentWidth, 70, 3, 3, 'FD');

  // Title
  pdf.setFontSize(11);
  pdf.setTextColor(233, 30, 99);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hore! Kamu cocok menjadi...', margin + 5, yPos + 6);

  // Cita-cita
  pdf.setFontSize(22);
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.setFont('helvetica', 'bold');
  const citaCitaText = cleanedCitaCita.toUpperCase();
  const citaCitaLines = pdf.splitTextToSize(citaCitaText, contentWidth - 10);
  pdf.text(citaCitaLines, margin + 5, yPos + 20);

  // Info Box
  yPos += 52;
  pdf.setFillColor(245, 249, 240);
  pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
  
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
  
  pdf.setFontSize(9);
  pdf.setTextColor(102, 102, 102);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Tanggal Kuis: ${quizDate}`, margin + 5, yPos + 18);

  yPos += 35;

  // Section Header
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text(`Mengenal ${cleanedCitaCita} Hebat`, margin, yPos);

  yPos += 8;

  // Explanation
  pdf.setFontSize(10);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFont('helvetica', 'normal');
  
  const paragraphs = displayExplanation.split('\n').filter(p => p.trim());
  let currentY = yPos;
  let pageNum = 1;
  
  paragraphs.forEach((paragraph, paraIndex) => {
    if (currentY > pageHeight - footerHeight - 10) {
      addFooter(pageNum, 0);
      pdf.addPage();
      pageNum++;
      currentY = margin + 5;
    }
    
    const lines = pdf.splitTextToSize(paragraph.trim(), contentWidth - 10);
    lines.forEach((line: string) => {
      if (currentY > pageHeight - footerHeight - 10) {
        addFooter(pageNum, 0);
        pdf.addPage();
        pageNum++;
        currentY = margin + 5;
      }
      if (line.trim()) {
        pdf.text(line.trim(), margin + 5, currentY);
        currentY += 6;
      }
    });
    
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

  pdf.setFillColor(250, 240, 245);
  pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
  
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'D');
  
  pdf.setFontSize(9);
  pdf.setTextColor(102, 102, 102);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Mata Pelajaran yang Relevan', margin + 5, currentY + 8);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text(relatedSubject, margin + 5, currentY + 15);

  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(i, totalPages);
  }

  // Download PDF
  const sanitizedName = cleanedNama.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-').substring(0, 50);
  const fileName = `Hasil-Kuis-Educorner-${sanitizedName}.pdf`;
  pdf.save(fileName);
}
