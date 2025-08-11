import type { MetadataRoute } from "next";

const urls: readonly string[] = [
    '/',
    '/conlang-gacha',
    '/comma',
];

export default function sitemap(): MetadataRoute.Sitemap {
    

    return urls.map((url) => {
        return {
            url,
            lastModified: new Date(),
        }
    });
}