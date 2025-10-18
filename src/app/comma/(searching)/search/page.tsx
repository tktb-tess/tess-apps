import { CommaKind, Correspondence } from '@/lib/mod/decl';
import { Monzo } from '@tktb-tess/xenharmonic-tool';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import { Comma } from '@tktb-tess/my-zod-schema';

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
    siteName: env.SITE_NAME,
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

  const results: Comma.Content[] = [];

  const commas = await (async () => {
    const resp = await fetch(env.COMMAS_URL);

    if (!resp.ok) {
      throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
    }

    const o = await resp.json();

    return Comma.commaDataSchema.parse(o).commas;
  })();

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
        // console.log(iMonzo_);

        const iMonzo = Monzo.parse(query);

        const filtered = commas.filter((comma) => {
          if (comma.commaType === 'irrational') {
            return false;
          }

          const monzo = new Monzo(comma.monzo);

          if (monzo.getArray().length < iMonzo.getArray().length) {
            return false;
          }

          const sliced = new Monzo(
            monzo.getArray().filter(([b]) => {
              return iMonzo.getArray().some(([ib]) => ib === b);
            })
          );

          return iMonzo.toString() === sliced.toString();
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
        const monzo = new Monzo(comma.monzo);
        const cents = monzo.getCents();
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
        const monzo = new Monzo(mnz);
        const monzoStr = monzo.getMonzoVector();
        const cents = monzo.getCents();
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return [id, name, monzoStr, centsStr, true] as const;
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
                          {ramon.basis && <p>{ramon.basis}</p>}
                          <p>{ramon.monzo}</p>
                        </>
                      ) : (
                        <p>{ramon}</p>
                      )}
                    </td>
                    <td>
                      {(() => {
                        const matched = cents.match(/^(\d\.\d+)e(-\d+)/);
                        if (!matched) return cents;
                        const num = matched[1];
                        const exp = matched[2];
                        return (
                          <>
                            {num} × 10<sup>{exp}</sup> ¢
                          </>
                        );
                      })()}
                    </td>
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
