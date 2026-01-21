import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan - 404',
  description: 'Halaman yang Anda cari tidak ditemukan. Kembali ke beranda EduCorner untuk melanjutkan perjalanan menemukan cita-cita Anda.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/logo.svg" 
            alt="EduCorner Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">EduCorner</h1>
          <p className="text-sm text-gray-600">SahabatMimpi</p>
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-pink-500 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Halaman Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman tersebut telah dipindahkan atau tidak ada lagi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            🏠 Kembali ke Beranda
          </Link>
          
          <Link 
            href="/kuis"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            🎯 Mulai Kuis Cita-Cita
          </Link>
          
          <Link 
            href="/history"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            📚 Lihat Riwayat
          </Link>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Butuh bantuan? 
            <Link 
              href="/"
              className="text-pink-500 hover:text-pink-600 font-semibold ml-1"
            >
              Hubungi kami
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-5 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}