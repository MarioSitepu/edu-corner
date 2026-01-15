import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { sendEmail, generateOTPEmail } from '@/lib/email';

// Admin email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'educorner.my.id@gmail.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

// Generate 6 digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validasi input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email harus diisi' },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah email sesuai dengan admin email
    // Untuk keamanan, kita selalu return success meskipun email tidak cocok
    // Ini mencegah user enumeration attack
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      // Simulasi delay untuk mencegah timing attack
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { 
          success: true, 
          message: 'Jika email terdaftar, kode OTP telah dikirim ke email Anda' 
        },
        { status: 200 }
      );
    }

    // Generate OTP 6 digit
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP berlaku 10 menit

    // Simpan OTP ke database
    try {
      // Buat tabel jika belum ada
      await sql`
        CREATE TABLE IF NOT EXISTS password_reset_otps (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          attempts INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Hapus OTP lama yang belum digunakan untuk email ini
      await sql`
        UPDATE password_reset_otps 
        SET used = TRUE 
        WHERE email = ${email.toLowerCase()} AND used = FALSE
      `;

      // Simpan OTP baru
      await sql`
        INSERT INTO password_reset_otps (email, otp, expires_at)
        VALUES (${email.toLowerCase()}, ${otp}, ${expiresAt.toISOString()})
      `;
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      // Jika error, tetap lanjutkan (untuk development)
    }

    // Kirim email dengan OTP
    const emailSent = await sendEmail({
      to: email,
      subject: 'Kode OTP Reset Password - EduCorner: SahabatMimpi',
      html: generateOTPEmail(otp),
    });

    if (!emailSent) {
      console.warn('Email tidak terkirim, tapi OTP sudah dibuat. OTP:', otp);
      // Untuk development, kita tetap return success
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Jika email terdaftar, kode OTP telah dikirim ke email Anda. Kode berlaku selama 10 menit.' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in generate-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}
