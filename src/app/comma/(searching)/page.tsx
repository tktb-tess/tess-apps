import { env } from '@/lib/mod/decl';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const ogTitle = 'コンマ検索';
const ogDesc = 'コンマの検索';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/comma',
    siteName: env.SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

export default async function Page() {
  notFound();
}
