import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { citaCita } = await request.json();

    if (!citaCita) {
      return NextResponse.json(
        { success: false, error: 'Cita-cita tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cek apakah API key tersedia
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GROQ_API_KEY tidak ditemukan di environment variables' },
        { status: 500 }
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

    const explanation = completion.choices[0]?.message?.content || 'Maaf, tidak dapat menghasilkan penjelasan saat ini.';

    return NextResponse.json(
      { success: true, explanation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Terjadi kesalahan saat memanggil API',
      },
      { status: 500 }
    );
  }
}
