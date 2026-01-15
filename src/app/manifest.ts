import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduCorner: SahabatMimpi',
    short_name: 'SahabatMimpi',
    description: 'Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF5F5',
    theme_color: '#FF4D6D',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
