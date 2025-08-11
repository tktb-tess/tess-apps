import { Commas } from '@/lib/mod/decl';
import {
  getCents,
  getMonzoVector,
  getRational,
  getTemperingOutEDOs,
  getTenneyHeight,
  getTENorm,
} from '@/lib/mod/xen-calc';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ commaID: string }>;
};

export async function generateMetadata({ params }: Props) {
  const commaID = decodeURIComponent((await params).commaID);
  const { commas }: Commas = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then((r) => r.json());
  const commaData = commas.find((c) => c.id === commaID);

  const title = commaData ? commaData.name[0] : undefined;
  const description = commaData
    ? commaData.name.concat(commaData.colorName).join(', ')
    : undefined;

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
  const commaID = decodeURIComponent((await params).commaID);
  const { commas }: Commas = await fetch(
    process.env.NEXT_PUBLIC_COMMAS_URL!
  ).then((r) => r.json());
  console.log(commaID);
  const commaData = commas.find((c) => c.id === commaID);
  

  if (!commaData || commaData.commaType === 'irrational') {
    notFound();
  }

  const { name, monzo, colorName, namedBy } = commaData;

  const monzoStr = getMonzoVector(monzo);
  const cents = getCents(monzo);
  const centsStr =
    cents < 0.1 ? cents.toExponential(4) + ' ¢' : cents.toFixed(4) + ' ¢';

  const THeight = getTenneyHeight(monzo);
  const THeightStr =
    THeight >= 100 ? THeight.toExponential(4) : THeight.toFixed(4);
  const TENorm = getTENorm(monzo);
  const TENormStr = TENorm >= 100 ? TENorm.toExponential(4) : TENorm.toFixed(4);
  const temperingOutEDOs = getTemperingOutEDOs(monzo).join(', ');

  const ratioStr = (() => {
    const [num, denom] = getRational(monzo);
    let numStr = num.toString();
    let denomStr = denom.toString();

    if (numStr.length > 10) {
      const l = numStr.slice(0, 3);
      const r = numStr.slice(-3);
      numStr = l + '…' + r;
    }
    if (denomStr.length > 10) {
      const l = denomStr.slice(0, 3);
      const r = denomStr.slice(-3);
      denomStr = l + '…' + r;
    }
    return `${numStr}/${denomStr}`;
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

  const rows = [
    ['名前', name.join(', ')],
    ['カラーネーム', colorNameStr],
    ['命名者', namedBy ?? '[NO DATA]'],
    ['モンゾ', monzoStr],
    ['比率', ratioStr],
    ['セント', centsStr],
    ['Tenney高さ', THeightStr],
    ['Tenney–Euclideanノルム', TENormStr],
    ['緩和する10000以下の平均律', temperingOutEDOs],
  ] as const;

  return (
    <>
      <header>
        <h1 className='font-sans text-center font-extralight my-15'>
          {name[0]}
        </h1>
      </header>
      <main className='flex flex-col gap-3'>
        <div className='table-container'>
          <table className='grid-cols-1 md:grid-cols-auto-2 mx-auto md:place-content-center gap-x-8 gap-y-3'>
            <tbody>
              {rows.map(([key, value]) => (
                <tr key={key}>
                  <th className='md:text-right'>{key}</th>
                  <td className='text-center md:text-left md:max-w-240'>
                    {value}
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
