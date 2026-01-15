import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import sql from '@/lib/db';

// Admin credentials (untuk production, simpan di environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah password ada di database (jika sudah direset)
    let validPassword = ADMIN_PASSWORD;
    try {
      const dbResult = await sql`
        SELECT password_hash
        FROM admin_credentials
        WHERE username = ${username}
        LIMIT 1
      `;
      
      if (dbResult.length > 0) {
        validPassword = dbResult[0].password_hash;
      }
    } catch (dbError: any) {
      // Jika tabel belum ada atau error, gunakan password dari env
      console.log('Using default password from environment');
    }

    // Cek credentials
    if (username === ADMIN_USERNAME && password === validPassword) {
      // Buat JWT token
      const token = await new SignJWT({ username, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      // Set cookie
      const response = NextResponse.json(
        { success: true, message: 'Login berhasil' },
        { status: 200 }
      );

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 jam
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Username atau password salah' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
