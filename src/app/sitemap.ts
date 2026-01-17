import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://educorner.my.id';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'id-ID': baseUrl,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/kuis`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'id-ID': `${baseUrl}/kuis`,
          'x-default': `${baseUrl}/kuis`,
        },
      },
    },
    {
      url: `${baseUrl}/history`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          'id-ID': `${baseUrl}/history`,
          'x-default': `${baseUrl}/history`,
        },
      },
    },
  ];
}
