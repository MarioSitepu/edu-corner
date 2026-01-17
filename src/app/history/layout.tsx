import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export const metadata: Metadata = {
  title: 'History Cita-Cita - Lihat Riwayat Hasil Tes',
  description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya. Dashboard lengkap untuk melacak perkembangan cita-cita Anda.',
  keywords: [
    'history cita-cita',
    'riwayat tes',
    'hasil kuis cita-cita',
    'riwayat profesi',
    'dashboard cita-cita',
    'hasil tes sebelumnya',
    'tracking cita-cita',
    'riwayat karir siswa'
  ],
  openGraph: {
    title: 'History Cita-Cita - Lihat Riwayat Hasil Tes | EduCorner: SahabatMimpi',
    description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya.',
    url: `${baseUrl}/history`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'EduCorner: SahabatMimpi',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'History Cita-Cita - EduCorner: SahabatMimpi',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'History Cita-Cita - Lihat Riwayat Hasil Tes',
    description: 'Lihat riwayat hasil tes cita-cita Anda. Akses kembali hasil kuis dan penjelasan profesi yang telah Anda ikuti sebelumnya.',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        alt: 'History Cita-Cita - EduCorner: SahabatMimpi',
      }
    ],
    creator: '@educorner',
  },
  alternates: {
    canonical: `${baseUrl}/history`,
    languages: {
      'id-ID': `${baseUrl}/history`,
    },
  },
  robots: {
    index: false, // History page biasanya tidak perlu di-index karena berisi data personal
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  category: 'education',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
