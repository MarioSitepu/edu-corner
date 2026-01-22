import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import sql from '@/lib/db';

// Force dynamic rendering untuk menghindari caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

interface EduCornerItem {
  id: number;
  nama: string;
  karakter?: string;
  mbti_code?: string;
  posisi_1_nama?: string;
  posisi_1_persentase?: number;
  posisi_2_nama?: string;
  posisi_2_persentase?: number;
  posisi_3_nama?: string;
  posisi_3_persentase?: number;
  created_at: string;
}


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
    let eduCornerData: EduCornerItem[] = [];
    try {
      eduCornerData = await sql`
        SELECT id, nama, karakter, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at 
        FROM edu_corner 
        ORDER BY created_at DESC
      ` as EduCornerItem[];
      console.log(`Fetched ${eduCornerData.length} records from edu_corner`);
    } catch (error: any) {
      console.error('Error fetching edu_corner data:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        detail: error?.detail
      });
      // Fallback: jika kolom baru belum ada (schema lama), coba SELECT minimal (id, nama, created_at)
      try {
        const minimal = await sql`
          SELECT id, nama, created_at FROM edu_corner ORDER BY created_at DESC
        ` as { id: number; nama: string; created_at: string }[];
        eduCornerData = minimal.map((r) => ({
          id: r.id,
          nama: r.nama,
          created_at: r.created_at,
          karakter: undefined,
          mbti_code: undefined,
          posisi_1_nama: undefined,
          posisi_1_persentase: undefined,
          posisi_2_nama: undefined,
          posisi_2_persentase: undefined,
          posisi_3_nama: undefined,
          posisi_3_persentase: undefined,
        }));
        console.log(`Fallback: Fetched ${eduCornerData.length} records (minimal columns). Jalankan migrasi: scripts/migrate-to-new-structure.sql`);
      } catch (fallbackError: any) {
        console.error('Fallback fetch failed:', fallbackError);
        eduCornerData = [];
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          edu_corner: eduCornerData || [],
        },
        stats: {
          total_edu_corner: eduCornerData.length,
        },
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching all data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data dari database' },
      { status: 500 }
    );
  }
}
