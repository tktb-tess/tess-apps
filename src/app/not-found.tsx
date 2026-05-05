import TessIcon from '@/lib/components/tessIcon';
import { env } from '@/lib/mod/decl';
import type { Metadata } from 'next';
import Link from 'next/link';
import style from './not-found.module.css';

const ogDesc = 'お探しのページは見つかりませんでした';
const ogTitle = '404 Not Found';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/',
    siteName: env.SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

const NotFound = () => {
  return (
    <div className={style.notFound}>
      <div className='animate-not-found'>
        <TessIcon />
      </div>
      <h2>Hoppla!</h2>
      <p>
        お探しのページは見つかりませんでした。
        <wbr />
        移動または削除された可能性があります。
      </p>
      <Link href='/' className='btn-theme-1'>
        トップに戻る
      </Link>
    </div>
  );
};

export default NotFound;
