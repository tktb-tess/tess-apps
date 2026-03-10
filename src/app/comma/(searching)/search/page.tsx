import { CommaKind, Match } from '@/lib/mod/decl';
import { Monzo } from '@tktb-tess/xenharmonic-tool';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import { Comma } from '@tktb-tess/my-zod-schema';
import style from './page.module.css';

type Props = {
  searchParams: Promise<{
    query: string;
    query2: string;
    corre: Match;
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

const fetchComma = async () => {
  const resp = await fetch(env.COMMAS_URL);

  if (!resp.ok) {
    throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
  }

  const o = await resp.json();

  return Comma.commaDataSchema.parse(o).commas;
};

const filterComma = (
  query: string,
  query2: string,
  kind: CommaKind,
  corre: Match,
  commas: readonly Comma.Content[],
) => {
  try {
    switch (kind) {
      case 'name': {
        return commas.filter(({ name }) => {
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
      }
      case 'monzo': {
        const iMonzo = Monzo.parse(query);

        return commas.filter((comma) => {
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
            }),
          );

          return iMonzo.toString() === sliced.toString();
        });
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
        return commas.filter((comma) => {
          if (comma.commaType === 'irrational') {
            const { cents } = comma;
            return lower <= cents && cents < upper;
          }
          const monzo = new Monzo(comma.monzo);
          const cents = monzo.getCents();
          return lower <= cents && cents < upper;
        });
      }
      case 'person': {
        return commas.filter(({ namedBy }) => {
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
      }
    }
  } catch (e) {
    console.error(e);
    redirect('/comma');
  }
};

interface CommaBaseData {
  readonly id: string;
  readonly names: string[];
  readonly centsStr: string;
}

interface RationalCommaData extends CommaBaseData {
  readonly type: 'rational';
  readonly monzoStr: {
    readonly basis: string | null;
    readonly monzo: string;
  };
}

interface IrrationalCommaData extends CommaBaseData {
  readonly type: 'irrational';
  readonly ratio: string;
}

type CommaData = RationalCommaData | IrrationalCommaData;

const Page = async ({ searchParams }: Props) => {
  const { query, kind, corre: match, query2 } = await searchParams;
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
  const results = filterComma(query, query2, kind, match, commas);

  // データ整形
  const resultData = results.map((comma): CommaData => {
    switch (comma.commaType) {
      case 'rational': {
        const { id, name, monzo: mnz } = comma;
        const monzo = new Monzo(mnz);
        const monzoStr = monzo.getMonzoVector();
        const cents = monzo.getCents();
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return {
          id,
          names: name,
          centsStr,
          type: 'rational',
          monzoStr,
        };
      }
      case 'irrational': {
        const { id, name, ratio, cents } = comma;
        const centsStr =
          (cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)) + ' ¢';

        return {
          id,
          names: name,
          centsStr,
          type: 'irrational',
          ratio,
        };
      }
    }
  });

  return (
    <>
      <h2 className='text-center'>– 検索結果 –</h2>
      {resultData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>名前</th>
              <th>モンゾ または 比率</th>
              <th>セント</th>
            </tr>
          </thead>
          <tbody>
            {resultData.map((res) => {
              const { id, names, type, centsStr } = res;

              return (
                <tr key={id}>
                  <td>
                    <Link href={`/comma/detail/${id}`}>
                      {names.map((n, i) => (
                        <p key={`${id}-${i}`}>{n}</p>
                      ))}
                    </Link>
                  </td>
                  <td>
                    {(() => {
                      switch (type) {
                        case 'rational': {
                          const { monzoStr } = res;
                        }
                        case 'irrational': {
                          const {} = res;
                        }
                      }
                    })()}
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
      ) : (
        <div className='h-20'>
          <p className='text-center'>検索結果がありません。</p>
        </div>
      )}
    </>
  );
};

export default Page;
