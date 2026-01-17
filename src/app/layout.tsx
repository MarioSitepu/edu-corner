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
    default: "EduCorner - Platform Cita-Cita Siswa Indonesia | EduCorner.my.id",
    template: "%s | EduCorner"
  },
  description: "EduCorner adalah platform interaktif terbaik untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. Kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap. EduCorner gratis dan mudah digunakan untuk siswa SD, SMP, dan SMA di Indonesia. Dapatkan rekomendasi profesi yang sesuai dengan kepribadian dan minat Anda melalui kuis interaktif EduCorner yang menyenangkan.",
  keywords: [
    "edu corner",
    "educorner",
    "edu corner indonesia",
    "edu corner platform",
    "edu corner cita-cita",
    "edu corner siswa",
    "edu corner kuis",
    "edu corner.my.id",
    "EduCorner",
    "EduCorner: SahabatMimpi",
    "cita-cita siswa",
    "dashboard cita-cita",
    "kuis cita-cita",
    "profesi impian",
    "karir siswa",
    "pendidikan Indonesia",
    "SahabatMimpi",
    "KKN Margo Lestari",
    "tes cita-cita",
    "penjelasan profesi",
    "bimbingan karir siswa",
    "platform pendidikan",
    "bimbingan karir online",
    "tes minat bakat siswa",
    "cari tahu cita-cita",
    "karir masa depan",
    "pendidikan karakter",
    "pengembangan diri siswa",
    "bimbingan konseling online"
  ],
  authors: [{ name: "KKN T Margo Lestari", url: baseUrl }],
  creator: "KKN T Margo Lestari",
  publisher: "EduCorner: SahabatMimpi",
  applicationName: "EduCorner: SahabatMimpi",
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.webp', type: 'image/webp', sizes: '512x512' }
    ],
    shortcut: '/logo.svg',
    apple: [
      { url: '/logo.webp', sizes: '180x180', type: 'image/webp' }
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    url: baseUrl,
    siteName: 'EduCorner',
    title: 'EduCorner - Platform Cita-Cita Siswa Indonesia | EduCorner.my.id',
    description: 'EduCorner adalah platform interaktif terbaik untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. Kuis cita-cita EduCorner, dashboard cita-cita siswa, dan penjelasan profesi lengkap. EduCorner gratis dan mudah digunakan.',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'EduCorner: SahabatMimpi Logo - Platform Cita-Cita Siswa',
        type: 'image/webp',
      },
      {
        url: `${baseUrl}/logo.svg`,
        width: 1200,
        height: 630,
        alt: 'EduCorner: SahabatMimpi Logo',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCorner - Platform Cita-Cita Siswa Indonesia | EduCorner.my.id',
    description: 'EduCorner adalah platform interaktif terbaik untuk membantu siswa menemukan dan mengembangkan cita-cita mereka. Kuis cita-cita EduCorner gratis dan penjelasan profesi lengkap.',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        alt: 'EduCorner: SahabatMimpi Logo',
      }
    ],
    creator: '@educorner',
    site: '@educorner',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'id-ID': baseUrl,
      'x-default': baseUrl,
    },
  },
  category: 'education',
  classification: 'Educational Platform',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SahabatMimpi',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#FF4D6D',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" itemScope itemType="https://schema.org/WebSite">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4NHC90DSH0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4NHC90DSH0');
            `,
          }}
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="canonical" href={baseUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={baseUrl} />
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />
        <meta name="theme-color" content="#FF4D6D" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SahabatMimpi" />
        <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION || ''} />
        <meta name="msvalidate.01" content={process.env.BING_VERIFICATION || ''} />
        <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION || ''} />
        <meta name="geo.region" content="ID" />
        <meta name="geo.placename" content="Indonesia" />
        <meta name="language" content="Indonesian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {children}
      </body>
    </html>
  );
}
