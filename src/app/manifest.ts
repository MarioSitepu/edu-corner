import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';
  
  return {
    name: 'EduCorner: SahabatMimpi - Platform Cita-Cita Siswa Indonesia',
    short_name: 'SahabatMimpi',
    description: 'Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis cita-cita, dashboard cita-cita siswa, dan penjelasan profesi lengkap',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFF5F5',
    theme_color: '#FF4D6D',
    categories: ['education', 'lifestyle', 'productivity'],
    lang: 'id-ID',
    dir: 'ltr',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/logo.webp',
        sizes: '384x384',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/logo.webp',
        sizes: '1200x630',
        type: 'image/webp',
        form_factor: 'wide',
        label: 'EduCorner: SahabatMimpi Homepage',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
