import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

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

// GET - Ambil profil admin
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
    const username = (auth.user as any)?.username || process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'educorner.my.id@gmail.com';

    return NextResponse.json(
      {
        success: true,
        data: {
          username,
          email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil profil admin' },
      { status: 500 }
    );
  }
}
