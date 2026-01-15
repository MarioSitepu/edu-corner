import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'educorner.my.id@gmail.com';
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validasi input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email dan OTP harus diisi' },
        { status: 400 }
      );
    }

    // Validasi format OTP (6 digit)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Format OTP tidak valid. OTP harus 6 digit angka' },
        { status: 400 }
      );
    }

    // Cek OTP di database
    try {
      const result = await sql`
        SELECT id, otp, expires_at, used, attempts
        FROM password_reset_otps
        WHERE email = ${email.toLowerCase()}
        AND used = FALSE
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, error: 'OTP tidak ditemukan atau sudah digunakan' },
          { status: 400 }
        );
      }

      const otpData = result[0];

      // Cek apakah sudah mencapai maksimal attempts
      if (otpData.attempts >= MAX_ATTEMPTS) {
        // Tandai OTP sebagai used jika sudah terlalu banyak attempts
        await sql`
          UPDATE password_reset_otps
          SET used = TRUE
          WHERE id = ${otpData.id}
        `;
        return NextResponse.json(
          { success: false, error: 'Terlalu banyak percobaan. Silakan minta OTP baru' },
          { status: 400 }
        );
      }

      // Cek apakah OTP sudah kadaluarsa
      const expiresAt = new Date(otpData.expires_at);
      const now = new Date();

      if (now > expiresAt) {
        // Tandai OTP sebagai used jika sudah kadaluarsa
        await sql`
          UPDATE password_reset_otps
          SET used = TRUE
          WHERE id = ${otpData.id}
        `;
        return NextResponse.json(
          { success: false, error: 'OTP sudah kadaluarsa. Silakan minta OTP baru' },
          { status: 400 }
        );
      }

      // Cek apakah OTP cocok
      if (otpData.otp !== otp) {
        // Increment attempts
        await sql`
          UPDATE password_reset_otps
          SET attempts = attempts + 1
          WHERE id = ${otpData.id}
        `;
        
        const remainingAttempts = MAX_ATTEMPTS - (otpData.attempts + 1);
        return NextResponse.json(
          { 
            success: false, 
            error: `OTP tidak valid. Sisa percobaan: ${remainingAttempts}` 
          },
          { status: 400 }
        );
      }

      // OTP valid - tandai sebagai used dan generate session token untuk reset password
      await sql`
        UPDATE password_reset_otps
        SET used = TRUE
        WHERE id = ${otpData.id}
      `;

      // Generate session token untuk reset password (valid 15 menit)
      const { randomBytes } = await import('crypto');
      const sessionToken = randomBytes(32).toString('hex');
      const sessionExpiresAt = new Date();
      sessionExpiresAt.setMinutes(sessionExpiresAt.getMinutes() + 15);

      // Simpan session token
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS password_reset_sessions (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            session_token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        await sql`
          INSERT INTO password_reset_sessions (email, session_token, expires_at)
          VALUES (${email.toLowerCase()}, ${sessionToken}, ${sessionExpiresAt.toISOString()})
        `;
      } catch (dbError: any) {
        console.error('Error creating session:', dbError);
      }

      return NextResponse.json(
        { 
          success: true, 
          sessionToken: sessionToken,
          message: 'OTP berhasil diverifikasi. Anda dapat mengatur password baru.' 
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Terjadi kesalahan saat memverifikasi OTP' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memverifikasi OTP' },
      { status: 500 }
    );
  }
}
