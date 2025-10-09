import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sonoaactv.live';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic show pages (will be populated when anime is uploaded)
  const shows: Array<{ id: string; lastModified: string }> = [];
  
  const showPages = shows.map((show) => ({
    url: `${baseUrl}/show/${show.id}`,
    lastModified: show.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic episode pages (will be populated when anime is uploaded)
  const episodePages = shows.flatMap((show) =>
    [1, 2, 3, 4, 5].map(() => ({
      url: `${baseUrl}/watch/${show.id}`,
      lastModified: show.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...showPages, ...episodePages];
}
