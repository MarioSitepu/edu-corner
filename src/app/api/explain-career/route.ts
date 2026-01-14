import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Fallback explanations untuk berbagai profesi
const getFallbackExplanation = (citaCita: string): string => {
  const explanations: { [key: string]: string } = {
    'Dokter': `Menjadi dokter adalah profesi yang sangat mulia! Dokter adalah orang yang membantu menyembuhkan orang yang sakit.

Sebagai dokter, kamu akan belajar banyak tentang tubuh manusia, penyakit, dan cara mengobatinya. Dokter bekerja di rumah sakit, klinik, atau bahkan bisa mengunjungi pasien di rumah mereka.

Untuk menjadi dokter, kamu perlu belajar dengan rajin, terutama pelajaran IPA (Ilmu Pengetahuan Alam) dan Matematika. Kamu juga harus memiliki hati yang baik dan sabar untuk membantu orang lain.

Profesi dokter sangat penting karena mereka membantu menjaga kesehatan semua orang. Jika kamu ingin menjadi dokter, mulailah dengan belajar rajin di sekolah dan selalu membantu teman-teman yang membutuhkan!`,

    'Seniman': `Menjadi seniman adalah profesi yang sangat kreatif dan menyenangkan! Seniman adalah orang yang membuat karya seni yang indah seperti lukisan, patung, atau gambar.

Sebagai seniman, kamu bisa mengekspresikan ide dan perasaanmu melalui karya seni. Seniman bisa bekerja di studio, galeri seni, atau bahkan di rumah sendiri.

Untuk menjadi seniman, kamu perlu banyak berlatih menggambar, mewarnai, dan membuat karya seni. Pelajaran Seni Budaya akan sangat membantu! Yang terpenting adalah memiliki imajinasi yang kuat dan tidak takut untuk mencoba hal-hal baru.

Profesi seniman penting karena mereka membuat dunia menjadi lebih indah dengan karya-karya mereka. Jika kamu ingin menjadi seniman, mulailah dengan sering menggambar dan membuat karya seni!`,

    'Guru': `Menjadi guru adalah profesi yang sangat mulia! Guru adalah orang yang mengajar dan membimbing murid-murid untuk menjadi pintar dan baik.

Sebagai guru, kamu akan mengajar berbagai mata pelajaran kepada murid-murid. Guru bekerja di sekolah dan membantu murid belajar hal-hal baru setiap hari.

Untuk menjadi guru, kamu perlu belajar dengan rajin dan memahami berbagai mata pelajaran. Kamu juga harus sabar, baik hati, dan suka membantu orang lain belajar.

Profesi guru sangat penting karena mereka membantu semua orang menjadi pintar dan berpengetahuan. Jika kamu ingin menjadi guru, mulailah dengan membantu teman-teman belajar dan selalu rajin belajar di sekolah!`,

    'Ilmuwan': `Menjadi ilmuwan adalah profesi yang sangat menarik! Ilmuwan adalah orang yang melakukan penelitian untuk menemukan hal-hal baru tentang dunia.

Sebagai ilmuwan, kamu akan melakukan eksperimen dan penelitian untuk menemukan jawaban dari berbagai pertanyaan. Ilmuwan bekerja di laboratorium atau di tempat penelitian.

Untuk menjadi ilmuwan, kamu perlu belajar dengan rajin, terutama pelajaran IPA dan Matematika. Kamu juga harus memiliki rasa ingin tahu yang besar dan tidak mudah menyerah saat menghadapi masalah.

Profesi ilmuwan sangat penting karena mereka menemukan hal-hal baru yang membantu kehidupan manusia. Jika kamu ingin menjadi ilmuwan, mulailah dengan banyak bertanya dan melakukan eksperimen sederhana!`,

    'Penulis': `Menjadi penulis adalah profesi yang sangat kreatif! Penulis adalah orang yang membuat cerita, buku, atau artikel yang menarik untuk dibaca orang lain.

Sebagai penulis, kamu akan menulis berbagai cerita dan ide-idemu. Penulis bisa bekerja di rumah, di kantor penerbit, atau di mana saja yang nyaman untuk menulis.

Untuk menjadi penulis, kamu perlu banyak membaca dan berlatih menulis. Pelajaran Bahasa Indonesia akan sangat membantu! Yang terpenting adalah memiliki imajinasi yang kuat dan bisa menceritakan ide-ide dengan baik.

Profesi penulis penting karena mereka membuat cerita-cerita yang menghibur dan mengedukasi banyak orang. Jika kamu ingin menjadi penulis, mulailah dengan sering membaca buku dan menulis cerita pendek!`,

    'Perancang': `Menjadi perancang adalah profesi yang sangat kreatif! Perancang adalah orang yang membuat desain untuk berbagai hal seperti pakaian, rumah, atau produk lainnya.

Sebagai perancang, kamu akan membuat desain yang indah dan fungsional. Perancang bisa bekerja di perusahaan, studio desain, atau bahkan memiliki bisnis sendiri.

Untuk menjadi perancang, kamu perlu belajar tentang seni, warna, dan bentuk. Pelajaran Seni Budaya dan Matematika akan sangat membantu! Yang terpenting adalah memiliki kreativitas dan bisa memikirkan ide-ide baru.

Profesi perancang penting karena mereka membuat berbagai produk menjadi lebih indah dan berguna. Jika kamu ingin menjadi perancang, mulailah dengan sering menggambar dan membuat desain sederhana!`
  };

  // Cari penjelasan yang cocok (case-insensitive)
  const normalizedCitaCita = citaCita.toLowerCase();
  for (const [key, value] of Object.entries(explanations)) {
    if (normalizedCitaCita.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default explanation jika tidak ditemukan
  return `Menjadi ${citaCita} adalah profesi yang sangat menarik! 

Untuk menjadi ${citaCita}, kamu perlu belajar dengan rajin di sekolah. Pelajari semua mata pelajaran dengan baik, terutama yang berkaitan dengan cita-citamu.

Selalu semangat belajar dan jangan mudah menyerah. Dengan kerja keras dan tekad yang kuat, kamu pasti bisa mencapai cita-citamu menjadi ${citaCita}!

Ingat, setiap profesi itu penting dan mulia. Yang terpenting adalah kamu melakukan pekerjaan dengan baik dan membantu orang lain.`;
};

export async function POST(request: NextRequest) {
  let citaCita: string = '';
  
  try {
    const body = await request.json();
    citaCita = body.citaCita || '';

    if (!citaCita) {
      return NextResponse.json(
        { success: false, error: 'Cita-cita tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cek apakah API key tersedia dan valid
    const apiKey = process.env.GROQ_API_KEY;
    const isApiKeyValid = apiKey && 
                          apiKey !== 'gsk_your_api_key_here' && 
                          apiKey.length >= 20 &&
                          apiKey.startsWith('gsk_');

    // Jika API key tidak valid, gunakan fallback explanation
    if (!isApiKeyValid) {
      console.log('Using fallback explanation for:', citaCita);
      const fallbackExplanation = getFallbackExplanation(citaCita);
      return NextResponse.json(
        { 
          success: true, 
          explanation: fallbackExplanation,
          source: 'fallback'
        },
        { status: 200 }
      );
    }

    // Inisialisasi Groq client
    const groq = new Groq({
      apiKey: apiKey,
    });

    // Generate penjelasan tentang pekerjaan/cita-cita
    const prompt = `Jelaskan tentang profesi ${citaCita} dengan bahasa yang mudah dipahami untuk anak SD. Jelaskan:
1. Apa itu ${citaCita}?
2. Apa saja tugas dan tanggung jawab seorang ${citaCita}?
3. Keahlian apa saja yang diperlukan untuk menjadi ${citaCita}?
4. Mengapa profesi ini penting?
5. Bagaimana cara mempersiapkan diri untuk menjadi ${citaCita}?

Buat penjelasan dalam 4-6 paragraf dengan bahasa yang ramah dan menarik untuk anak-anak.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Anda adalah asisten yang membantu menjelaskan berbagai profesi kepada anak-anak dengan bahasa yang mudah dipahami dan menarik.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const explanation = completion.choices[0]?.message?.content || getFallbackExplanation(citaCita);

    return NextResponse.json(
      { 
        success: true, 
        explanation,
        source: 'groq'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error calling Groq API:', error);
    
    // Jika terjadi error, gunakan fallback explanation
    // Jika citaCita tidak tersedia, gunakan default
    const targetCitaCita = citaCita || 'Profesi Impian';
    const fallbackExplanation = getFallbackExplanation(targetCitaCita);
    
    // Log error untuk debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        stack: error?.stack
      });
    }
    
    // Tetap return success dengan fallback explanation
    return NextResponse.json(
      {
        success: true,
        explanation: fallbackExplanation,
        source: 'fallback',
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 200 }
    );
  }
}
