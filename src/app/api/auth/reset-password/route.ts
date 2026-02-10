import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { jwtVerify } from 'jose';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_secret_here');

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

    let email: string;

    // Verifikasi JWT token (stateless)
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Validasi purpose token
      if (payload.purpose !== 'password_reset') {
        throw new Error('Invalid token purpose');
      }

      email = payload.email as string;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid atau sudah kadaluarsa. Silakan request link baru.' },
        { status: 400 }
      );
    }

    try {
      // Pastikan tabel credential ada
      await sql`
        CREATE TABLE IF NOT EXISTS admin_credentials (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Update password
      // Note: Di production HARUS menggunakan hashing (bcrypt/argon2).
      // Di sini kita simpan plain text sesuai implementasi sebelumnya utk sementara.
      await sql`
        INSERT INTO admin_credentials (username, password_hash)
        VALUES (${ADMIN_USERNAME}, ${password})
        ON CONFLICT (username) 
        DO UPDATE SET password_hash = ${password}, updated_at = CURRENT_TIMESTAMP
      `;

      return NextResponse.json(
        { success: true, message: 'Password berhasil direset' },
        { status: 200 }
      );

    } catch (dbError: any) {
      console.error('Database error during password update:', dbError);
      return NextResponse.json(
        { success: false, error: 'Terjadi kesalahan database saat reset password' },
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
