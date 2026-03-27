import type { CommaKind, Match } from '@/lib/mod/decl';
import CommaResultView from './CommaResultView';
import { fetchComma } from './funcs';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    query: string;
    query2: string;
    match: Match;
    kind: CommaKind;
  }>;
}

const CommaResult = async ({ params }: Props) => {
  const { query, query2, match, kind } = await params;

  if (kind === 'cent' || kind === 'monzo') {
    if (!query && !query2) {
      redirect('/comma');
    }
  } else {
    if (!query) {
      redirect('/comma');
    }
  }

  const commaData = await fetchComma(query, query2, kind, match);

  return <CommaResultView commaData={commaData} />;
};

export default CommaResult;
