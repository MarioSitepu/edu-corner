import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sahabatmimpi.my.id';

export const metadata: Metadata = {
  title: 'History Cita-Cita - Lihat Riwayat Hasil Tes',
  description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya.',
  keywords: [
    'history cita-cita',
    'riwayat tes',
    'hasil kuis cita-cita',
    'riwayat profesi',
    'dashboard cita-cita',
    'hasil tes sebelumnya'
  ],
  openGraph: {
    title: 'History Cita-Cita - Lihat Riwayat Hasil Tes | EduCorner: SahabatMimpi',
    description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya.',
    url: `${baseUrl}/history`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'History Cita-Cita - EduCorner: SahabatMimpi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'History Cita-Cita - Lihat Riwayat Hasil Tes',
    description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya.',
    images: [`${baseUrl}/logo.webp`],
  },
  alternates: {
    canonical: `${baseUrl}/history`,
  },
  robots: {
    index: false, // History page biasanya tidak perlu di-index
    follow: true,
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
