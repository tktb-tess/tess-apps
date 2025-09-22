import ExtLink from '@/lib/components/extLink';
import { Commas } from '@/lib/mod/decl';
import {
  getCents,
  Monzo,
  getRatio,
  getTemperOutEdos,
  getTenneyHeight,
  getTENorm,
  getMonzoVector,
} from '@tktb-tess/xenharmonic-tool';

import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ commaID: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { commaID } = await params;

  const { commas }: Commas = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then((r) => r.json());

  const commaData = commas.find((c) => c.id === commaID);

  const title = commaData?.name[0];
  const description = commaData?.name.concat(commaData.colorName).join(', ');

  return {
    title,
    description,
    openGraph: {
      description,
      url: `/comma-result/${encodeURIComponent(commaID)}`,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: '/link-card.png',
    },
    twitter: {
      card: 'summary',
    },
  };
}

export default async function CommaDetail({ params }: Props) {
  const { commaID } = await params;

  const { commas }: Commas = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then((r) => r.json());

  const commaData = commas.find((c) => c.id === commaID);

  if (!commaData) {
    notFound();
  }

  const title = commaData.name[0];
  const xenWikiUrl = `https://en.xen.wiki/w/${encodeURIComponent(title)}`;

  const rows: ReadonlyArray<
    readonly [string, string | readonly [string | null, string]]
  > = (() => {
    switch (commaData.commaType) {
      case 'rational': {
        const { name, monzo: mnz, colorName, namedBy } = commaData;

        const monzo = Monzo.create(mnz);
        const monzoStr = getMonzoVector(monzo);

        const centsStr = (() => {
          const cents = getCents(monzo);
          return cents < 0.1
            ? cents.toExponential(4) + ' ¢'
            : cents.toFixed(4) + ' ¢';
        })();

        const THeightStr = (() => {
          const THeight = getTenneyHeight(monzo);
          return THeight >= 100 ? THeight.toExponential(4) : THeight.toFixed(4);
        })();

        const TENormStr = (() => {
          const TENorm = getTENorm(monzo);
          return TENorm >= 100 ? TENorm.toExponential(4) : TENorm.toFixed(4);
        })();

        const temperingOutEDOs = getTemperOutEdos(10000, monzo).join(', ');

        const ratioStr = (() => {
          const [num, denom] = getRatio(monzo);
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
          } else {
            return '[NO DATA]';
          }
        })();

        return [
          ['名前', name.join(', ')],
          ['カラーネーム', colorNameStr],
          ['命名者', namedBy ?? '[NO DATA]'],
          ['モンゾ', monzoStr],
          ['比率', ratioStr],
          ['セント', centsStr],
          ['Tenney高さ', THeightStr],
          ['Tenney–Euclideanノルム', TENormStr],
          ['Xenharmonic wikiへのリンク', xenWikiUrl],
          ['緩和する10000以下の平均律', temperingOutEDOs],
        ] as const;
      }
      case 'irrational': {
        const { name, ratio, cents, colorName, namedBy } = commaData;

        const centsStr =
          cents < 0.1 ? cents.toExponential(4) + ' ¢' : cents.toFixed(4) + ' ¢';

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
          ['名前', name.join(', ')],
          ['カラーネーム', colorNameStr],
          ['命名者', namedBy ?? '[NO DATA]'],
          ['比率', ratio],
          ['セント', centsStr],
          ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ] as const;
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
              {rows.map(([key, value]) => (
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
                      ) : (
                        value
                      )
                    ) : (
                      <>
                        {value[0] && <p>{value[0]}</p>}
                        <p>{value[1]}</p>
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
