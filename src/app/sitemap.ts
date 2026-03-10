import type { MetadataRoute } from 'next';

const urls: readonly string[] = ['/', '/conlang-gacha', '/comma'];
const root = 'https://apps.tktb-tess.dev';

const sitemap = (): MetadataRoute.Sitemap => {
  const lastModified = new Date().toISOString();
  return urls.map((url) => {
    return {
      url: new URL(url, root).href,
      lastModified,
      changeFrequency: 'weekly',
      priority: url === '/' ? 1 : 0.8,
    };
  });
};

export default sitemap;
