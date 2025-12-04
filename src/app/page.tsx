import { Metadata } from 'next';
import Link from 'next/link';
import { EB_Garamond } from 'next/font/google';
import { env } from '@/lib/mod/decl';

const ogDesc = '作ったアプリたち';

export const metadata: Metadata = {
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    siteName: env.SITE_NAME,
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
  style: 'italic',
});

export default function Home() {
  return (
    <>
      <header>
        <div className='my-7 overflow-clip flex flex-col items-center'>
          <h1
            className={`${ebGaramond.className} text-center m-0 py-3 border-white/40 text-4xl lg:text-5xl xl:text-6xl animate-[slide-in_3s_cubic-bezier(0,.8,.2,1)]`}
          >
            {env.SITE_NAME}
          </h1>
          <div className='w-50 lg:w-70 xl:w-90'>
            <hr className='border-white/40 w-0 invisible animate-[thread_3s_cubic-bezier(.6,0,.4,1)]' />
          </div>
        </div>
      </header>
      <main>
        <div className='flex flex-col justify-center items-center min-h-[70vh] *:max-w-full gap-5'>
          <Link
            href='/conlang-gacha'
            className='no-underline bg-linear-to-b from-sky-300 to-sky-400 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow'
          >
            <p className='text-3xl'>人工言語ガチャ</p>
          </Link>
          <Link
            href='/comma'
            className='no-underline bg-linear-to-b from-violet-300 to-violet-400 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow'
          >
            <p className='text-3xl'>コンマ検索</p>
          </Link>
        </div>
      </main>
    </>
  );
}
