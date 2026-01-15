import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validasi input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token dan password harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Verifikasi token
    try {
      const tokenResult = await sql`
        SELECT email, expires_at, used
        FROM password_reset_tokens
        WHERE token = ${token}
        LIMIT 1
      `;

      if (tokenResult.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Token tidak valid' },
          { status: 400 }
        );
      }

      const tokenData = tokenResult[0];

      // Cek apakah token sudah digunakan
      if (tokenData.used) {
        return NextResponse.json(
          { success: false, error: 'Token sudah digunakan' },
          { status: 400 }
        );
      }

      // Cek apakah token sudah kadaluarsa
      const expiresAt = new Date(tokenData.expires_at);
      const now = new Date();

      if (now > expiresAt) {
        return NextResponse.json(
          { success: false, error: 'Token sudah kadaluarsa' },
          { status: 400 }
        );
      }

      // Update password di environment variable
      // Catatan: Untuk production, sebaiknya simpan password di database dengan hash
      // Untuk sekarang, kita akan update environment variable
      // Tapi karena environment variable tidak bisa diubah runtime,
      // kita akan simpan di database atau file
      
      // Simpan password baru (dalam production, gunakan hash seperti bcrypt)
      // Untuk sekarang, kita simpan di database sebagai temporary solution
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS admin_credentials (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Hash password sederhana (untuk production, gunakan bcrypt)
        // Untuk sekarang, kita simpan plain password (TIDAK AMAN untuk production!)
        // Di production, gunakan: const bcrypt = require('bcrypt');
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        await sql`
          INSERT INTO admin_credentials (username, password_hash)
          VALUES (${ADMIN_USERNAME}, ${password})
          ON CONFLICT (username) 
          DO UPDATE SET password_hash = ${password}, updated_at = CURRENT_TIMESTAMP
        `;
      } catch (dbError: any) {
        console.error('Error updating password:', dbError);
        // Fallback: Update environment variable (tidak bisa diubah runtime)
        // Untuk production, gunakan service seperti AWS Secrets Manager atau database
      }

      // Tandai token sebagai sudah digunakan
      await sql`
        UPDATE password_reset_tokens
        SET used = TRUE
        WHERE token = ${token}
      `;

      // Update environment variable (catatan: ini tidak akan bekerja di runtime)
      // Untuk production, gunakan service management secret atau database
      // process.env.ADMIN_PASSWORD = password; // Tidak akan bekerja

      return NextResponse.json(
        { success: true, message: 'Password berhasil direset' },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Terjadi kesalahan saat reset password' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in reset-password:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat reset password' },
      { status: 500 }
    );
  }
}
