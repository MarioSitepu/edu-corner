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

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tidak ditemukan' },
        { status: 400 }
      );
    }

    // Ambil data dari database
    const result = await sql`
      SELECT id, nama, cita_cita, kelas, created_at 
      FROM edu_corner 
      WHERE id = ${id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    const data = result[0];

    // Ambil penjelasan dari database atau generate
    let explanation = '';
    try {
      const explanationResult = await sql`
        SELECT explanation 
        FROM career_explanations 
        WHERE LOWER(cita_cita) = LOWER(${data.cita_cita})
        LIMIT 1
      `;
      
      if (explanationResult.length > 0) {
        explanation = explanationResult[0].explanation;
      } else {
        // Fetch dari API explain-career
        const explainResponse = await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/explain-career`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ citaCita: data.cita_cita }),
        });
        
        if (explainResponse.ok) {
          const explainResult = await explainResponse.json();
          explanation = explainResult.explanation || '';
        }
      }
    } catch (err) {
      console.warn('Failed to fetch explanation:', err);
    }

    // Return data untuk generate PDF di client side
    return NextResponse.json(
      {
        success: true,
        data: {
          ...data,
          explanation: explanation,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error generating PDF data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data untuk PDF' },
      { status: 500 }
    );
  }
}
