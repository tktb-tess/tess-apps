import { CommaKind, Match } from '@/lib/mod/decl';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { env } from '@/lib/mod/decl';
import CommaResult from './CommaResult';
import LoadingText from '@/lib/components/LoadingText';
import style from './page.module.css';

const ogTitle = 'コンマ検索';
const ogDesc = 'コンマの検索';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/comma/search',
    siteName: env.SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

interface Props {
  searchParams: Promise<{
    query: string;
    query2: string;
    match: Match;
    kind: CommaKind;
  }>;
}

const Loading = () => {
  return (
    <div className={style.loadingWr}>
      <LoadingText />
    </div>
  );
};

const Page = async ({ searchParams }: Props) => {
  return (
    <Suspense fallback={<Loading />}>
      <CommaResult params={searchParams} />
    </Suspense>
  );
};

export default Page;
