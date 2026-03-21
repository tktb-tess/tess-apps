import { CommaKind, Match } from '@/lib/mod/decl';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import CommaResult from './CommaResult';

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

const Page = async ({ searchParams }: Props) => {
  const { query, kind, query2 } = await searchParams;
  if (kind === 'cent' || kind === 'monzo') {
    if (!query && !query2) {
      redirect('/comma');
    }
  } else {
    if (!query) {
      redirect('/comma');
    }
  }

  return <CommaResult params={await searchParams} />;
};

export default Page;
