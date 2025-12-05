import type { MetadataRoute } from 'next';

const urls: readonly string[] = ['/', '/conlang-gacha', '/comma'];
const root = 'https://apps.tktb-tess.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  return urls.map((url) => {
    return {
      url: new URL(url, root).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: url === '/' ? 1 : 0.8,
    };
  });
}
