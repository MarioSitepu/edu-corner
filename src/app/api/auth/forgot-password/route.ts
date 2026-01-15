import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import sql from '@/lib/db';
import { sendEmail, generateResetPasswordEmail } from '@/lib/email';

// Admin email (untuk production, simpan di database atau environment variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

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
          message: 'Jika email terdaftar, link reset password telah dikirim' 
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token berlaku 1 jam

    // Simpan token ke database
    try {
      // Buat tabel jika belum ada
      await sql`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Hapus token lama yang belum digunakan untuk email ini
      await sql`
        UPDATE password_reset_tokens 
        SET used = TRUE 
        WHERE email = ${email.toLowerCase()} AND used = FALSE
      `;

      // Simpan token baru
      await sql`
        INSERT INTO password_reset_tokens (email, token, expires_at)
        VALUES (${email.toLowerCase()}, ${resetToken}, ${expiresAt.toISOString()})
      `;
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      // Jika error, tetap lanjutkan (untuk development)
    }

    // Generate reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get('origin') || 
                    'https://educorner.my.id';
    const resetLink = `${baseUrl}/cekhasil/login/reset-password?token=${resetToken}`;

    // Kirim email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset Password - EduCorner: SahabatMimpi',
      html: generateResetPasswordEmail(resetLink),
    });

    if (!emailSent) {
      console.warn('Email tidak terkirim, tapi token sudah dibuat. Link:', resetLink);
      // Untuk development, kita tetap return success
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Jika email terdaftar, link reset password telah dikirim ke email Anda' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}
