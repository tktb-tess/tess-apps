import { Metadata } from 'next';
import Link from 'next/link';
import { EB_Garamond } from 'next/font/google';

const ogTitle = 'τά συστήματα';
const ogDesc = '作ったアプリたち';

export const metadata: Metadata = {
  metadataBase: new URL(`https://apps.tktb-tess.dev`),
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: 'https://apps.tktb-tess.dev',
    siteName: ogTitle,
    images: '/link-card.png'
  },
};

const ebGaramond = EB_Garamond({
  weight: 'variable',
  subsets: ['greek', 'greek-ext'],
});

const Home = () => {
  return (
    <>
      <h1 className={`${ebGaramond.className} text-center my-10`}>{ogTitle}</h1>
      <div className='flex flex-col justify-center items-center min-h-[70vh] *:max-w-full gap-5'>
        <Link
          href='/conlang-gacha'
          className='no-underline bg-gradient-to-b from-sky-300 to-sky-400 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow'
        >
          <p className='text-3xl'>人工言語ガチャ</p>
        </Link>
      </div>
    </>
  );
};

export default Home;
