import { Metadata } from 'next';
import { EB_Garamond } from 'next/font/google';
import { env } from '@/lib/mod/decl';
import LinkBtns from '@/lib/components/LinkBtns';
import style from './page.module.css';

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

const Home = () => {
  return (
    <>
      <div>
        <h1 aria-hidden='true' className={`${ebGaramond.className} ${style.mainTitle}`}>
          {[...env.SITE_NAME].map((s, i) => (
            <span key={`title-${i}`}>{s}</span>
          ))}
        </h1>
        <h1 className='sr-only'>{env.SITE_NAME}</h1>
      </div>
      <LinkBtns
        data={[
          { url: '/conlang-gacha', text: '人工言語ガチャ' },
          // { url: '/comma', text: 'コンマ検索' },
        ]}
      />
      
    </>
  );
};

export default Home;
