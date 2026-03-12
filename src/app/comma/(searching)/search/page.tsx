import { CommaKind, Match } from '@/lib/mod/decl';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import { Comma } from '@tktb-tess/my-zod-schema';
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

const fetchComma = async () => {
  const resp = await fetch(env.COMMAS_URL);

  if (!resp.ok) {
    throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
  }

  const o = await resp.json();
  return Comma.commaDataSchema.parse(o).commas;
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

  const commas = await fetchComma();

  return <CommaResult params={await searchParams} commas={commas} />;
};

export default Page;
