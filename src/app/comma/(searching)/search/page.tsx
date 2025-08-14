import {
  CommaData,
  CommaKind,
  Commas,
  Correspondence,
  Monzo,
} from '@/lib/mod/decl';
import {
  getCents,
  getMonzoVector,
  getPrime,
  isEqualMonzo,
} from '@/lib/mod/xen-calc';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{
    query: string;
    query2: string;
    corre: Correspondence;
    kind: CommaKind;
  }>;
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
  const { query, kind, corre, query2 } = await searchParams;
  if (kind === 'cent' || kind === 'monzo') {
    if (!query && !query2) {
      redirect('/comma');
    }
  } else {
    if (!query) {
      redirect('/comma');
    }
  }


  const results: CommaData[] = [];

  const { commas } = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then<Commas>((r) => r.json());

  switch (kind) {
    case 'name': {
      const filtered = commas.filter(({ name }) => {
        const cNames = name.map((s) => s.toLowerCase());
        const qName = query.toLowerCase();
        return cNames.some((cName) => {
          switch (corre) {
            case 'exact': {
              return cName === qName;
            }
            case 'forward': {
              return cName.slice(0, qName.length) === qName;
            }
            case 'backward': {
              return cName.slice(-qName.length) === qName;
            }
            case 'partial': {
              return cName.includes(qName);
            }
          }
        });
      });
      results.push(...filtered);
      break;
    }
    case 'monzo': {
      const values = query2.split(',').map((v) => {
        const value = Number.parseInt(v);
        return Number.isNaN(value) ? 0 : value;
      });
      const bases = query.split(',').map((b, i) => {
        const basis = Number.parseInt(b);
        return Number.isNaN(basis) ? getPrime(i) : basis;
      });

      const iMonzo: Monzo = values
        .map((value, i) => {
          return [bases.at(i) ?? getPrime(i), value] as const;
        })
        .toSorted(([a], [b]) => a - b);

      const filtered = commas.filter((comma) => {
        if (comma.commaType === 'irrational') {
          return false;
        }
        const { monzo } = comma;
        switch (corre) {
          case 'exact': {
            return isEqualMonzo(iMonzo, monzo);
          }
          case 'forward': {
            if (monzo.length < iMonzo.length) {
              return false;
            }

            const sliced = monzo.slice(0, iMonzo.length);
            return isEqualMonzo(iMonzo, sliced);
          }
          case 'backward': {
            if (monzo.length < iMonzo.length) {
              return false;
            }

            const sliced = monzo.slice(-iMonzo.length);
            return isEqualMonzo(iMonzo, sliced);
          }
          case 'partial': {
            if (monzo.length < iMonzo.length) {
              return false;
            }
            const sliced = monzo.filter(([b]) => {
              return iMonzo.some(([ib]) => ib === b);
            });

            return isEqualMonzo(iMonzo, sliced);
          }
        }
      });
      results.push(...filtered);
      break;
    }
    case 'cent': {
      const lower = (() => {
        const l = Number.parseFloat(query);
        return Number.isNaN(l) ? 0 : l;
      })();
      const upper = (() => {
        const l = Number.parseFloat(query2);
        return Number.isNaN(l) ? Infinity : l;
      })();
      const filtered = commas.filter((comma) => {
        if (comma.commaType === 'irrational') {
          return false;
        }
        const { monzo } = comma;
        const cents = getCents(monzo);
        return lower <= cents && cents < upper;
      });
      results.push(...filtered);
      break;
    }
    case 'person': {
      const filtered = commas.filter(({ namedBy }) => {
        if (!namedBy) return false;
        const cName = namedBy.toLowerCase();
        const qName = query.toLowerCase();

        switch (corre) {
          case 'exact': {
            return cName === qName;
          }
          case 'forward': {
            return cName.slice(0, qName.length) === qName;
          }
          case 'backward': {
            return cName.slice(-qName.length) === qName;
          }
          case 'partial': {
            return cName.includes(qName);
          }
        }
      });
      results.push(...filtered);
      break;
    }
  }

  // データ整形
  const resultData = results.map((comma) => {
    switch (comma.commaType) {
      case 'rational': {
        const { id, name, monzo } = comma;
        const monzoStr = getMonzoVector(monzo);
        const cents = getCents(monzo);
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return [
          encodeURIComponent(id),
          name,
          monzoStr,
          centsStr,
          true,
        ] as const;
      }
      case 'irrational': {
        const { id, name, ratio } = comma;

        return [encodeURIComponent(id), name, ratio, undefined, false] as const;
      }
    }
  });

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
                const [id, name, ramon, cents, isRational] = res;

                return (
                  <tr key={id}>
                    <td>
                      {isRational ? (
                        <Link href={`/comma/detail/${id}`}>
                          {name.map((n, i) => (
                            <p key={`${id}-${i}`}>{n}</p>
                          ))}
                        </Link>
                      ) : (
                        <>
                          {name.map((n, i) => (
                            <p key={`${id}-${i}`}>{n}</p>
                          ))}
                        </>
                      )}
                    </td>
                    <td>
                      {isRational ? (
                        <>
                          {ramon[0] && <p>{ramon[0]}</p>}
                          <p>{ramon[1]}</p>
                        </>
                      ) : (
                        <p>{ramon}</p>
                      )}
                    </td>
                    <td>{cents}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='h-20'>
          <p className='text-center'>検索結果がありません。</p>
        </div>
      )}
    </>
  );
}
