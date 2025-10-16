import ExtLink from '@/lib/components/extLink';
import { Commas, env } from '@/lib/mod/decl';
import { Monzo, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ commaID: string }>;
};

type Tag = 'superparticular' | 'no-2';
type CommaSize = 'unnoticeable' | 'small' | 'medium' | 'large';

export async function generateMetadata({ params }: Props) {
  const { commaID } = await params;

  const { commas }: Commas = await fetch(env.COMMAS_URL).then((r) => r.json());

  const commaData = commas.find((c) => c.id === commaID);

  const title = commaData?.name[0];
  const description = commaData?.name.concat(commaData.colorName).join(', ');

  return {
    title,
    description,
    openGraph: {
      description,
      url: `/comma-result/${commaID}`,
      siteName: env.SITE_NAME,
      images: '/link-card.png',
    },
    twitter: {
      card: 'summary',
    },
  };
}

export default async function CommaDetail({ params }: Props) {
  const { commaID } = await params;

  const { commas }: Commas = await fetch(env.COMMAS_URL).then((r) => r.json());

  const commaData = commas.find((c) => c.id === commaID);

  if (!commaData) {
    notFound();
  }

  const title = commaData.name[0];
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
        )
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
      <header>
        <h1 className='font-sans text-center font-extralight my-15'>{title}</h1>
      </header>
      <main className='flex flex-col gap-3'>
        <Link
          href='/comma'
          className='btn-1 self-center text-center block text-xl'
        >
          戻る
        </Link>
        <div className='table-container'>
          <table className='grid-cols-1 md:grid-cols-auto-2 mx-auto md:place-content-center gap-x-8 gap-y-3'>
            <tbody>
              {rows
                .filter((r) => r !== null)
                .map(([key, value]) => (
                  <tr key={key}>
                    <th className='md:text-right'>{key}</th>
                    <td className='text-center md:text-left md:max-w-240 text-balance'>
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

        <div className='h-10'></div>
      </main>
    </>
  );
}
