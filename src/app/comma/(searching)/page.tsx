import { env } from '@/lib/mod/decl';
import { Metadata } from 'next';

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
  return (
    <>
      <div className='flex flex-col items-center *:max-w-full'>
        <p>コンマを検索できます。</p>
        <p>名前、モンゾ、セント値、命名者による検索ができます。</p>
      </div>
      <section
        aria-labelledby='about-monzo'
        className='flex flex-col items-center *:max-w-full'
      >
        <h2 id='about-monzo'>– 「モンゾ」検索について –</h2>
        <p>
          検索欄に “基底1:指数1,基底2:指数2,基底3:指数3...”
          という形式で入力してください。(例: 2:-4,3:4,5:-1 Syntonic comma)
        </p>
        <p>
          基底を省略し “指数1,指数2,指数3...”
          と書くこともできます。その場合、基底として小さい順に素数が充てられます。(例:
          -4,4,-1 = 2:-4,3:4,5:-1)
        </p>
      </section>
      <div className='h-20'></div>
    </>
  );
}
