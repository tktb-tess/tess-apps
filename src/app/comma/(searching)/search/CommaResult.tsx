import type { CommaKind, Match } from '@/lib/mod/decl';
import CommaResultView from './CommaResultView';
import { fetchComma } from './funcs';

interface Props {
  params: {
    query: string;
    query2: string;
    match: Match;
    kind: CommaKind;
  };
}

const CommaResult = async ({ params }: Props) => {
  const { query, query2, match, kind } = params;
  const commaData = await fetchComma(query, query2, kind, match);

  return <CommaResultView commaData={commaData} />;
};

export default CommaResult;
