import { Commas } from '@/lib/mod/decl';
import { getCents, getMonzoVector } from '@/lib/mod/xen-calc';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ogTitle = 'コンマ検索';
const ogDesc = 'コンマの検索';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/comma/search',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

export default async function Page({ searchParams }: Props) {
  const { query } = await searchParams;
  if (query === undefined || query === '') {
    redirect('/comma');
  }
  if (typeof query !== 'string') {
    throw Error('invalid query');
  }
  const { commas }: Commas = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then((r) => r.json());

  const resultCommas = commas.filter(({ name }) => {
    for (const n of name) {
      const n1 = n.slice(0, query.length).toLowerCase();
      const q1 = query.toLowerCase();
      if (n1 === q1) {
        return true;
      }
    }
    return false;
  });

  const resultData = resultCommas.map(
    (comma): [string, string[], string, string] | undefined => {
      switch (comma.commaType) {
        case 'rational': {
          const { id, name, monzo } = comma;
          const monzoStr = getMonzoVector(monzo);
          const cents = getCents(monzo);
          const centsStr =
            (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

          return [encodeURIComponent(id), name, monzoStr, centsStr];
        }
        case 'irrational': {
          return undefined;
        }
      }
    }
  );

  return (
    <>
      <h2 className='text-center'>– 検索結果 –</h2>
      {resultData.length > 0 ? (
        <div className='table-container'>
          <table className='grid-cols-auto-3 mx-auto md:place-content-center gap-x-8 gap-y-3'>
            <thead>
              <tr>
                <th>名前</th>
                <th>モンゾ または 比率</th>
                <th>セント</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((res) => {
                if (!res) {
                  return undefined;
                }
                const [id, name, ramon, cents] = res;
                return (
                  <tr key={id}>
                    <td>
                      <Link href={`/comma/detail/${id}`}>
                        {name.map((n, i) => <p key={`${id}-${i}`}>{n}</p>)}
                      </Link>
                    </td>
                    <td>{ramon}</td>
                    <td>{cents}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-center'>検索結果がありません。</p>
      )}
    </>
  );
}
