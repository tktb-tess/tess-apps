import { Metadata } from 'next';

const ogTitle = 'コンマ検索';
const ogDesc = 'コンマの検索';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/comma',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

export default async function Page() {

  return (
    <div className='flex flex-col items-center gap-4'>
      <p>コンマを検索できます。</p>
      <p>現在名前前方一致限定です。今後機能を拡充していく予定です。</p>
    </div>
  );
}
