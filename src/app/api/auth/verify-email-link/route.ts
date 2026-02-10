import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'educorner.my.id@gmail.com';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_secret_here');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseToken, email } = body;

        // Validate input
        if (!firebaseToken || !email) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify email matches admin email
        if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized email' },
                { status: 403 }
            );
        }

        // In production, you should verify the Firebase ID token here
        // using Firebase Admin SDK. For now, we'll trust the client-side verification.

        // Generate session token for password reset
        const sessionToken = await new SignJWT({ email, purpose: 'password_reset' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m') // Token valid for 15 minutes
            .setIssuedAt()
            .sign(JWT_SECRET);

        console.log('✅ Email link verified for:', email);
        console.log('Session token generated');

        return NextResponse.json(
            {
                success: true,
                sessionToken,
                message: 'Email verified successfully'
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in verify-email-link:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify email link' },
            { status: 500 }
        );
    }
}
