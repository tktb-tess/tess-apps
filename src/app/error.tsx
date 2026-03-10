'use client';
import TessIcon from '@/lib/components/tessIcon';
import { env } from '@/lib/mod/decl';
import { Metadata } from 'next';
import { useEffect } from 'react';
import style from './not-found.module.css';

const ogDesc = 'Something went wrong';
const ogTitle = 'Error';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: env.BASE_URL,
    siteName: env.SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={style.notFound}>
      <div className='animate-not-found'>
        <TessIcon />
      </div>
      <h2>Hoppla!</h2>
      <p>問題が発生しました。</p>
      <button onClick={() => reset()} className='btn-theme-1'>
        再読み込み
      </button>
    </div>
  );
};

export default Error;
