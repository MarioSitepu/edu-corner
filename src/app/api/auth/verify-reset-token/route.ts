import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cek token di database
    try {
      const result = await sql`
        SELECT email, expires_at, used
        FROM password_reset_tokens
        WHERE token = ${token}
        LIMIT 1
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Token tidak valid' },
          { status: 400 }
        );
      }

      const tokenData = result[0];

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

      return NextResponse.json(
        { success: true, email: tokenData.email },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Terjadi kesalahan saat memverifikasi token' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in verify-reset-token:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memverifikasi token' },
      { status: 500 }
    );
  }
}
