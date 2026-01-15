"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoWebp from "../../../logo.webp";

function ResetPasswordForm() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const router = useRouter();

  // Ambil email dari sessionStorage saat component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = sessionStorage.getItem('reset_password_email');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        // Jika tidak ada email di sessionStorage, redirect ke forgot password
        router.push('/cekhasil/login/forgot-password');
      }
    }
  }, [router]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (result.success) {
        setSessionToken(result.sessionToken);
        setStep("password");
        setError("");
      } else {
        setError(result.error || "OTP tidak valid");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan saat memverifikasi OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!sessionToken) {
      setError("Session tidak valid. Silakan mulai dari awal");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: sessionToken, password }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/cekhasil/login");
        }, 3000);
      } else {
        setError(result.error || "Terjadi kesalahan saat reset password");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan saat reset password");
    } finally {
      setLoading(false);
    }
  };

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
              {step === "otp" ? "Verifikasi OTP" : "Reset Password"}
            </h1>
            <p className="text-[#666666]">
              {step === "otp"
                ? "Masukkan kode OTP yang telah dikirim ke email Anda"
                : "Masukkan password baru Anda"}
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
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
                  <span>Password berhasil direset! Mengarahkan ke halaman login...</span>
                </div>
              </div>
            </div>
          ) : step === "otp" ? (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Tampilkan email yang digunakan (read-only) */}
              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Email:</p>
                  <p className="text-sm text-blue-900 font-medium">{email}</p>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                  Kode OTP (6 digit)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4D6D] bg-[#F9FAFB] text-[#2D2D2D] transition-all text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  required
                  disabled={loading}
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
                <p className="text-xs text-[#666666] mt-2">
                  Masukkan 6 digit kode OTP yang telah dikirim ke email Anda
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] hover:from-[#E91E63] hover:to-[#FF4D6D] text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  "Verifikasi OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4D6D] bg-[#F9FAFB] text-[#2D2D2D] transition-all"
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4D6D] bg-[#F9FAFB] text-[#2D2D2D] transition-all"
                  placeholder="Konfirmasi password baru"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8A] hover:from-[#E91E63] hover:to-[#FF4D6D] text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("otp");
                    setSessionToken(null);
                    setPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="w-full text-[#666666] hover:text-[#2D2D2D] text-sm transition-colors"
                >
                  ← Kembali ke Verifikasi OTP
                </button>
                <Link
                  href="/cekhasil/login/forgot-password"
                  className="w-full text-center text-[#666666] hover:text-[#2D2D2D] text-sm transition-colors"
                >
                  Minta OTP Baru
                </Link>
              </div>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/cekhasil/login"
              className="text-[#666666] hover:text-[#2D2D2D] text-sm transition-colors"
            >
              ← Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F9] to-[#FFF5F5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
          <p className="mt-4 text-[#4A4A4A]">Memuat...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
