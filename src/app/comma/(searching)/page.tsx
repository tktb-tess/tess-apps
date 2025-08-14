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
    <>
      <div className='flex flex-col items-center *:max-w-full'>
        <p>コンマを検索できます。</p>
        <p>名前、モンゾ、セント値、命名者による検索ができます。</p>
      </div>
      <section aria-labelledby='about-monzo' className='flex flex-col items-center *:max-w-full'>
        <h2 id='about-monzo'>– 「モンゾ」検索について –</h2>
        <p>「基底」に素数基底の値を、「指数」にモンゾの値を、コンマ区切りで入力してください。</p>
        <p>「基底」を省略した場合、基底として小さい順に素数が充てられます。</p>
        <p>コンマの中を空にした場合、0として扱われます。</p>
      </section>
      <div className='h-20'></div>
    </>
  );
}
