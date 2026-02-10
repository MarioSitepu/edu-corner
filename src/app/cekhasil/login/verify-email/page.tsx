"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoWebp from "../../../logo.webp";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Memverifikasi link email...");
    const router = useRouter();

    useEffect(() => {
        const handleEmailLink = async () => {
            try {
                // Check if the current URL is a valid email link
                if (!isSignInWithEmailLink(auth, window.location.href)) {
                    setStatus("error");
                    setMessage("Link tidak valid atau sudah kadaluarsa");
                    return;
                }

                // Get the email from localStorage
                let email = window.localStorage.getItem('emailForSignIn');

                if (!email) {
                    // If email is not found, prompt the user
                    email = window.prompt('Silakan masukkan email Anda untuk verifikasi:');
                }

                if (!email) {
                    setStatus("error");
                    setMessage("Email diperlukan untuk verifikasi");
                    return;
                }

                setMessage("Memverifikasi email...");

                // Sign in with the email link
                const result = await signInWithEmailLink(auth, email, window.location.href);

                // Clear the email from storage
                window.localStorage.removeItem('emailForSignIn');

                setMessage("Verifikasi berhasil! Mengarahkan ke halaman reset password...");
                setStatus("success");

                // Get the ID token
                const idToken = await result.user.getIdToken();

                // Send token to backend for verification
                const response = await fetch('/api/auth/verify-email-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firebaseToken: idToken, email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to verify with backend');
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Verification failed');
                }

                // Save session token to sessionStorage
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('reset_password_token', data.sessionToken);
                    sessionStorage.setItem('reset_password_email', email);
                }

                // Redirect to reset password page
                setTimeout(() => {
                    router.push('/cekhasil/login/reset-password');
                }, 1500);

            } catch (error: any) {
                console.error('Error verifying email link:', error);
                setStatus("error");

                // Handle specific Firebase errors
                if (error.code === 'auth/invalid-action-code') {
                    setMessage('Link sudah tidak valid atau sudah digunakan. Silakan request link baru.');
                } else if (error.code === 'auth/expired-action-code') {
                    setMessage('Link sudah kadaluarsa. Silakan request link baru.');
                } else if (error.code === 'auth/invalid-email') {
                    setMessage('Email tidak valid');
                } else {
                    setMessage(error.message || 'Terjadi kesalahan saat memverifikasi link');
                }
            }
        };

        handleEmailLink();
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F9] to-[#FFF5F5] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-scale-in">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FF4D6D] to-[#FF6B8A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Image
                                src={logoWebp}
                                alt="Logo EduCorner: SahabatMimpi"
                                width={48}
                                height={48}
                                className="w-12 h-12"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
                            Verifikasi Email
                        </h1>
                    </div>

                    {/* Status Display */}
                    <div className="space-y-6">
                        {status === "loading" && (
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4D6D] mb-4"></div>
                                <p className="text-[#666666]">{message}</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                <div className="flex items-center gap-2">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <>
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {message}
                                </div>
                                <button
                                    onClick={() => router.push('/cekhasil/login/forgot-password')}
                                    className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] hover:from-[#E91E63] hover:to-[#FF4D6D] text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    Request Link Baru
                                </button>
                                <button
                                    onClick={() => router.push('/cekhasil/login')}
                                    className="w-full text-[#666666] hover:text-[#2D2D2D] text-sm transition-colors"
                                >
                                    ← Kembali ke Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
