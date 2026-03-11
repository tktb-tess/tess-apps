import { Comma } from '@tktb-tess/my-zod-schema';
import { Monzo, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ExtLink from '@/lib/components/extLink';
import { env } from '@/lib/mod/decl';
import type { CommaDetail } from './types';
import { formatCentStr } from '@/lib/mod/funcs';

interface Props {
  params: Promise<{ commaID: string }>;
}

type Tag = 'superparticular' | 'no-2';
type CommaSize = 'unnoticeable' | 'small' | 'medium' | 'large';

export const generateMetadata = async ({ params }: Props) => {
  const { commaID } = await params;

  const commas = await (async () => {
    const resp = await fetch(env.COMMAS_URL);

    if (!resp.ok) {
      throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
    }

    const o = await resp.json();

    return Comma.commaDataSchema.parse(o).commas;
  })();

  const commaData = commas.find((c) => c.id === commaID);

  const title = commaData?.name.at(0);
  const description = commaData?.name.concat(commaData.colorName).join(', ');

  return {
    title,
    description,
    openGraph: {
      description,
      url: `/comma/detail/${commaID}`,
      siteName: env.SITE_NAME,
      images: '/link-card.png',
    },
    twitter: {
      card: 'summary',
    },
  };
};

const formatData = (comma: Comma.Content): CommaDetail => {
  switch (comma.commaType) {
    case 'rational': {
      const { name: n__, monzo: mnz, colorName, namedBy } = comma;

      const xenWikiUrl = `https://en.xen.wiki/w/${encodeURIComponent(n__[0] ?? '')}`;

      const name = n__.join(', ');
      const monzo = new Monzo(mnz);
      const monzoStr = (() => {
        const s = monzo.getMonzoVector();
        return [s.basis, s.monzo] as const;
      })();

      const centsStr = (() => {
        const cents = monzo.getCents();
        return formatCentStr(cents);
      })();

      const size = ((): CommaSize => {
        const _c = monzo.getCents();

        if (_c < 3.5) return 'unnoticeable';
        else if (_c < 30) return 'small';
        else if (_c < 100) return 'medium';
        return 'large';
      })();

      const THeightStr = (() => {
        const THeight = monzo.getTenneyHeight();
        return THeight >= 100 ? THeight.toExponential(4) : THeight.toFixed(4);
      })();

      const TENormStr = (() => {
        const TENorm = monzo.getTENorm();
        return TENorm >= 100 ? TENorm.toExponential(4) : TENorm.toFixed(4);
      })();

      const temperingOutEDOs = getTemperOutEdos(10000, monzo).join(', ');

      const ratioStr = (() => {
        const [num, denom] = monzo.getRatio();
        let numStr = num.toString();
        let denomStr = denom.toString();

        if (numStr.length > 21) {
          const l = numStr.slice(0, 10);
          const r = numStr.slice(-10);
          const folded = numStr.length - 20;
          numStr = l + `…(${folded} 桁省略)…` + r;
        }
        if (denomStr.length > 21) {
          const l = denomStr.slice(0, 10);
          const r = denomStr.slice(-10);
          const folded = denomStr.length - 20;
          denomStr = l + `…(${folded} 桁省略)…` + r;
        }
        return `${numStr} / ${denomStr}`;
      })();

      const colorNameStr = (() => {
        if (colorName[0] && colorName[1]) {
          return colorName.join(', ');
        } else if (colorName[0]) {
          return colorName[0];
        } else if (colorName[1]) {
          return colorName[1];
        }
        return '[NO DATA]';
      })();

      const tags = (() => {
        const _tags: Tag[] = [];
        const [n, d] = monzo.getRatio();
        if (n - d === 1n) {
          _tags.push('superparticular');
        }

        const base2 = monzo.getArray().find(([b]) => b === 2);

        if (base2 === undefined) {
          _tags.push('no-2');
        }
        _tags.sort();
        return _tags.length > 0 ? _tags.join(', ') : null;
      })();

      return [
        ['名前', name],
        ['カラーネーム', colorNameStr],
        ['命名者', namedBy ?? '[NO DATA]'],
        ['モンゾ', monzoStr],
        ['比率', ratioStr],
        ['セント', centsStr],
        ['サイズ', size],
        ['Tenney高さ', THeightStr],
        ['Tenney–Euclideanノルム', TENormStr],
        ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ['緩和する10000以下の平均律', temperingOutEDOs],
        ['タグ', tags],
      ];
    }

    case 'irrational': {
      const { name: n__, ratio, cents, colorName, namedBy } = comma;
      const xenWikiUrl = `https://en.xen.wiki/w/${encodeURIComponent(n__[0] ?? '')}`;

      const name = n__.join(', ');

      const centsStr = formatCentStr(cents);

      const size = ((): CommaSize => {
        const _c = cents;

        if (_c < 3.5) return 'unnoticeable';
        else if (_c < 30) return 'small';
        else if (_c < 100) return 'medium';
        return 'large';
      })();

      const colorNameStr = (() => {
        if (colorName[0] && colorName[1]) {
          return colorName.join(', ');
        } else if (colorName[0]) {
          return colorName[0];
        } else if (colorName[1]) {
          return colorName[1];
        } else {
          return '[NO DATA]';
        }
      })();

      return [
        ['名前', name],
        ['カラーネーム', colorNameStr],
        ['命名者', namedBy ?? '[NO DATA]'],
        ['モンゾ', null],
        ['比率', ratio],
        ['セント', centsStr],
        ['サイズ', size],
        ['Tenney高さ', null],
        ['Tenney–Euclideanノルム', null],
        ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ['緩和する10000以下の平均律', null],
        ['タグ', null],
      ];
    }
  }
};

const Page = async ({ params }: Props) => {
  const { commaID } = await params;

  const fetchCommas = async () => {
    const resp = await fetch(env.COMMAS_URL);

    if (!resp.ok) {
      throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
    }

    const o = await resp.json();

    return Comma.commaDataSchema.parse(o).commas;
  };

  const commaData = (await fetchCommas()).find((c) => c.id === commaID);

  if (!commaData) {
    notFound();
  }

  const title = commaData.name[0] ?? '';
  const xenWikiUrl = `https://en.xen.wiki/w/${encodeURIComponent(title)}`;

  const rows: ReadonlyArray<
    | readonly [
        string,
        (
          | string
          | string[]
          | {
              readonly basis: string | null;
              readonly monzo: string;
            }
        ),
      ]
    | null
  > = (() => {
    switch (commaData.commaType) {
      case 'rational': {
        const { name, monzo: mnz, colorName, namedBy } = commaData;

        const monzo = new Monzo(mnz);
        const monzoStr = monzo.getMonzoVector();

        const centsStr = (() => {
          const cents = monzo.getCents();
          return cents < 0.1
            ? cents.toExponential(4) + ' ¢'
            : cents.toFixed(4) + ' ¢';
        })();

        const size = ((): CommaSize => {
          const _c = monzo.getCents();

          if (_c < 3.5) return 'unnoticeable';
          else if (_c < 30) return 'small';
          else if (_c < 100) return 'medium';
          return 'large';
        })();

        const THeightStr = (() => {
          const THeight = monzo.getTenneyHeight();
          return THeight >= 100 ? THeight.toExponential(4) : THeight.toFixed(4);
        })();

        const TENormStr = (() => {
          const TENorm = monzo.getTENorm();
          return TENorm >= 100 ? TENorm.toExponential(4) : TENorm.toFixed(4);
        })();

        const temperingOutEDOs = getTemperOutEdos(10000, monzo).join(', ');

        const ratioStr = (() => {
          const [num, denom] = monzo.getRatio();
          let numStr = num.toString();
          let denomStr = denom.toString();

          if (numStr.length > 21) {
            const l = numStr.slice(0, 10);
            const r = numStr.slice(-10);
            const folded = numStr.length - 20;
            numStr = l + `…(${folded} 桁省略)…` + r;
          }
          if (denomStr.length > 21) {
            const l = denomStr.slice(0, 10);
            const r = denomStr.slice(-10);
            const folded = denomStr.length - 20;
            denomStr = l + `…(${folded} 桁省略)…` + r;
          }
          return `${numStr} / ${denomStr}`;
        })();

        const colorNameStr = (() => {
          if (colorName[0] && colorName[1]) {
            return colorName.join(', ');
          } else if (colorName[0]) {
            return colorName[0];
          } else if (colorName[1]) {
            return colorName[1];
          }
          return '[NO DATA]';
        })();

        const tags = (() => {
          const _tags: Tag[] = [];
          const [n, d] = monzo.getRatio();
          if (n - d === 1n) {
            _tags.push('superparticular');
          }

          const base2 = monzo.getArray().find(([b]) => b === 2);

          if (base2 === undefined) {
            _tags.push('no-2');
          }
          return _tags;
        })();

        return [
          ['名前', name],
          ['カラーネーム', colorNameStr],
          ['命名者', namedBy ?? '[NO DATA]'],
          ['モンゾ', monzoStr],
          ['比率', ratioStr],
          ['セント', centsStr],
          ['サイズ', size],
          ['Tenney高さ', THeightStr],
          ['Tenney–Euclideanノルム', TENormStr],
          ['Xenharmonic wikiへのリンク', xenWikiUrl],
          ['緩和する10000以下の平均律', temperingOutEDOs],
          tags.length > 0 ? ['タグ', tags] : null,
        ];
      }
      case 'irrational': {
        const { name, ratio, cents, colorName, namedBy } = commaData;

        const centsStr =
          cents < 0.1 ? cents.toExponential(4) + ' ¢' : cents.toFixed(4) + ' ¢';

        const size = ((): CommaSize => {
          const _c = cents;

          if (_c < 3.5) return 'unnoticeable';
          else if (_c < 30) return 'small';
          else if (_c < 100) return 'medium';
          return 'large';
        })();

        const colorNameStr = (() => {
          if (colorName[0] && colorName[1]) {
            return colorName.join(', ');
          } else if (colorName[0]) {
            return colorName[0];
          } else if (colorName[1]) {
            return colorName[1];
          } else {
            return '[NO DATA]';
          }
        })();

        return [
          ['名前', name],
          ['カラーネーム', colorNameStr],
          ['命名者', namedBy ?? '[NO DATA]'],
          ['比率', ratio],
          ['セント', centsStr],
          ['サイズ', size],
          ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ];
      }
    }
  })();

  return (
    <>
      <h1>{title}</h1>
      <Link href='/comma'>戻る</Link>
      <div>
        <table>
          <tbody>
            {rows
              .filter((r) => r !== null)
              .map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>
                    {typeof value === 'string' ? (
                      key === 'Xenharmonic wikiへのリンク' ? (
                        <ExtLink href={value}>{value}</ExtLink>
                      ) : key === '緩和する10000以下の平均律' ? (
                        <details>
                          <summary>展開</summary>
                          <p>{value}</p>
                        </details>
                      ) : key === 'セント' ? (
                        <>
                          {(() => {
                            const matched = value.match(/^(\d\.\d+)e(-\d+)/);
                            if (!matched) return value;
                            const num = matched[1];
                            const exp = matched[2];
                            return (
                              <>
                                {num} × 10<sup>{exp}</sup> ¢
                              </>
                            );
                          })()}
                        </>
                      ) : (
                        value
                      )
                    ) : Array.isArray(value) ? (
                      <>{value.join(', ')}</>
                    ) : (
                      <>
                        {value.basis && <p>{value.basis}</p>}
                        <p>{value.monzo}</p>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
