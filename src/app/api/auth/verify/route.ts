import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json(
      { 
        success: true, 
        authenticated: true,
        user: payload 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }
}
