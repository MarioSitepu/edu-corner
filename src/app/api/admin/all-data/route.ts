import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import sql from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Helper untuk verify admin token
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return { authenticated: false, error: 'Unauthorized' };
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { authenticated: true, user: payload };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
}

// GET - Ambil semua data dari semua tabel
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Ambil semua data dari tabel edu_corner
    let eduCornerData = [];
    try {
      eduCornerData = await sql`
        SELECT id, nama, cita_cita, kelas, created_at 
        FROM edu_corner 
        ORDER BY created_at DESC
      `;
    } catch (error: any) {
      console.warn('Error fetching edu_corner data:', error);
      // Jika tabel tidak ada, tetap lanjutkan
    }

    // Ambil semua data dari tabel career_explanations
    let careerExplanationsData = [];
    try {
      careerExplanationsData = await sql`
        SELECT id, cita_cita, explanation, created_at, updated_at 
        FROM career_explanations 
        ORDER BY updated_at DESC
      `;
    } catch (error: any) {
      console.warn('Error fetching career_explanations data:', error);
      // Jika tabel tidak ada, tetap lanjutkan
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          edu_corner: eduCornerData || [],
          career_explanations: careerExplanationsData || [],
        },
        stats: {
          total_edu_corner: eduCornerData.length,
          total_career_explanations: careerExplanationsData.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching all data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data dari database' },
      { status: 500 }
    );
  }
}
