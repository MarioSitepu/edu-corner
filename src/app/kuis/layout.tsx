import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export const metadata: Metadata = {
  title: 'Kuis Cita-Cita - Temukan Profesi Impianmu',
  description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu. Dapatkan rekomendasi cita-cita berdasarkan jawabanmu. Gratis dan mudah digunakan untuk siswa SD, SMP, dan SMA.',
  keywords: [
    'kuis cita-cita',
    'tes profesi',
    'tes karir',
    'kuis profesi impian',
    'tes kepribadian karir',
    'rekomendasi profesi',
    'cari cita-cita',
    'tes minat bakat',
    'kuis karir siswa',
    'tes cita-cita online',
    'bimbingan karir siswa',
    'platform pendidikan Indonesia'
  ],
  openGraph: {
    title: 'Kuis Cita-Cita - Temukan Profesi Impianmu | EduCorner: SahabatMimpi',
    description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu. Gratis dan mudah digunakan.',
    url: `${baseUrl}/kuis`,
    type: 'website',
    locale: 'id_ID',
    siteName: 'EduCorner: SahabatMimpi',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'Kuis Cita-Cita - EduCorner: SahabatMimpi',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuis Cita-Cita - Temukan Profesi Impianmu',
    description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu.',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        alt: 'Kuis Cita-Cita - EduCorner: SahabatMimpi',
      }
    ],
    creator: '@educorner',
  },
  alternates: {
    canonical: `${baseUrl}/kuis`,
    languages: {
      'id-ID': `${baseUrl}/kuis`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
};

export default function KuisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
