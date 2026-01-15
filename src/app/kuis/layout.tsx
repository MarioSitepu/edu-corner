import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sahabatmimpi.my.id';

export const metadata: Metadata = {
  title: 'Kuis Cita-Cita - Temukan Profesi Impianmu',
  description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu. Dapatkan rekomendasi cita-cita berdasarkan jawabanmu.',
  keywords: [
    'kuis cita-cita',
    'tes profesi',
    'tes karir',
    'kuis profesi impian',
    'tes kepribadian karir',
    'rekomendasi profesi',
    'cari cita-cita',
    'tes minat bakat'
  ],
  openGraph: {
    title: 'Kuis Cita-Cita - Temukan Profesi Impianmu | EduCorner: SahabatMimpi',
    description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu.',
    url: `${baseUrl}/kuis`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'Kuis Cita-Cita - EduCorner: SahabatMimpi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuis Cita-Cita - Temukan Profesi Impianmu',
    description: 'Ikuti kuis interaktif untuk menemukan profesi yang cocok dengan kepribadian dan minatmu.',
    images: [`${baseUrl}/logo.webp`],
  },
  alternates: {
    canonical: `${baseUrl}/kuis`,
  },
};

export default function KuisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
