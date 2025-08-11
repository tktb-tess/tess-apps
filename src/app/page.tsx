import { Metadata } from 'next';
import Link from 'next/link';
import { EB_Garamond } from 'next/font/google';

const ogDesc = '作ったアプリたち';

export const metadata: Metadata = {
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    url: '/',
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

const ebGaramond = EB_Garamond({
  weight: '400',
  subsets: ['greek', 'greek-ext'],
});

export default function Home() {
  return (
    <>
      <header>
        <h1 className={`${ebGaramond.className} text-center my-10`}>
          {process.env.NEXT_PUBLIC_SITE_NAME}
        </h1>
      </header>
      <main>
        <div className='flex flex-col justify-center items-center min-h-[70vh] *:max-w-full gap-5'>
          <Link
            href='/conlang-gacha'
            className='no-underline bg-gradient-to-b from-sky-300 to-sky-400 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow'
          >
            <p className='text-3xl'>人工言語ガチャ</p>
          </Link>
          <Link
            href='/comma'
            className='no-underline bg-gradient-to-b from-violet-300 to-violet-400 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow'
          >
            <p className='text-3xl'>コンマ検索</p>
          </Link>
        </div>
      </main>
    </>
  );
};

