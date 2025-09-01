import { CommaData, CommaKind, Commas, Correspondence } from '@/lib/mod/decl';
import { getCents, Monzo, getMonzoVector } from '@tktb-tess/xenharmonic-tool';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { bailliePSW } from '@tktb-tess/util-fns';

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
      try {
        const values = query2.split(',').map((v) => {
          const value = Number.parseInt(v);

          return Number.isNaN(value) ? 0 : value;
        });

        const primeList: readonly number[] = (() => {
          const basisLen = values.length;

          const pList: number[] = [];

          for (let n = 2n; pList.length < basisLen; n++) {
            if (bailliePSW(n)) pList.push(Number(n));
          }

          return pList;
        })();

        const bases = query.split(',').map((b, i) => {
          const basis = Number.parseInt(b);

          return Number.isNaN(basis) ? primeList[i] : basis;
        });

        const iMonzo_ = values
          .map<[number, number]>((value, i) => {
            return [bases.at(i) ?? primeList[i], value];
          })
          .sort(([a], [b]) => a - b);

        // console.log(iMonzo_);

        const iMonzo = Monzo.create(iMonzo_);

        const filtered = commas.filter((comma) => {
          if (comma.commaType === 'irrational') {
            return false;
          }

          const monzo = Monzo.create(comma.monzo);

          switch (corre) {
            case 'exact': {
              return Monzo.isEqual(iMonzo, monzo);
            }

            case 'forward': {
              if (monzo.length < iMonzo.length) {
                return false;
              }

              const sliced = Monzo.create(monzo.slice(0, iMonzo.length));

              return Monzo.isEqual(iMonzo, sliced);
            }

            case 'backward': {
              if (monzo.length < iMonzo.length) {
                return false;
              }

              const sliced = Monzo.create(monzo.slice(-iMonzo.length));

              return Monzo.isEqual(iMonzo, sliced);
            }
            case 'partial': {
              if (monzo.length < iMonzo.length) {
                return false;
              }

              const sliced = Monzo.create(
                monzo.filter(([b]) => {
                  return iMonzo.some(([ib]) => ib === b);
                })
              );

              return Monzo.isEqual(iMonzo, sliced);
            }
          }
        });

        results.push(...filtered);
      } catch {
        redirect('/comma');
      }

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
          const { cents } = comma;
          return lower <= cents && cents < upper;
        }
        const monzo = Monzo.create(comma.monzo);
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
        const { id, name, monzo: mnz } = comma;
        const monzo = Monzo.create(mnz);
        const monzoStr = getMonzoVector(monzo);
        const cents = getCents(monzo);
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return [
          id,
          name,
          monzoStr,
          centsStr,
          true,
        ] as const;
      }
      case 'irrational': {
        const { id, name, ratio, cents } = comma;
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return [id, name, ratio, centsStr, false] as const;
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
                      <Link href={`/comma/detail/${id}`}>
                        {name.map((n, i) => (
                          <p key={`${id}-${i}`}>{n}</p>
                        ))}
                      </Link>
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
