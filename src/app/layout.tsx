import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "EduCorner: SahabatMimpi - Platform Cita-Cita Siswa Indonesia",
    template: "%s | EduCorner: SahabatMimpi"
  },
  description: "Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. Kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap.",
  keywords: [
    "cita-cita siswa",
    "dashboard cita-cita",
    "kuis cita-cita",
    "profesi impian",
    "karir siswa",
    "pendidikan Indonesia",
    "EduCorner",
    "SahabatMimpi",
    "KKN Margo Lestari",
    "tes cita-cita",
    "penjelasan profesi",
    "bimbingan karir siswa"
  ],
  authors: [{ name: "KKN T Margo Lestari" }],
  creator: "KKN T Margo Lestari",
  publisher: "EduCorner: SahabatMimpi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: baseUrl,
    siteName: 'EduCorner: SahabatMimpi',
    title: 'EduCorner: SahabatMimpi - Platform Cita-Cita Siswa Indonesia',
    description: 'Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. Kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap.',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'EduCorner: SahabatMimpi Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCorner: SahabatMimpi - Platform Cita-Cita Siswa',
    description: 'Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka.',
    images: [`${baseUrl}/logo.webp`],
    creator: '@educorner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
