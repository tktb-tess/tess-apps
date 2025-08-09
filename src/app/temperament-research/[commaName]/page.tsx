import {
  fetchCommas,
  getCents,
  getMonzoVector,
  getRational,
  getTemperingOutEDOs,
  getTENorm,
} from '@/lib/mod/xen-calc';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ commaName: string }>;
};

const ogTitle = 'コンマ';
const ogDesc = 'コンマ詳細';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/temperament-research',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

const fetchCommaData = async (id: string) => {
  const { commas } = await fetchCommas();
  return commas[id];
};

export default async function CommaDetail({ params }: Props) {
  const commaID = decodeURIComponent((await params).commaName);
  const commaData = await fetchCommaData(commaID);
  if (!commaData || commaData.commaType === 'irrational') {
    notFound();
  }

  const { name, monzo, colorName, namedBy } = commaData;
  const monzoStr = getMonzoVector(monzo);
  const cents = getCents(monzo);
  const centsStr =
    cents < 0.1 ? cents.toExponential(4) + ' ¢' : cents.toFixed(4) + ' ¢';
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

  const rows = [
    ['Name', name.join(', ')],
    ['Color name', colorName[0] ? colorName.join(', ') : colorName[1]],
    ['Named by', namedBy ?? '[NO DATA]'],
    ['Monzo', monzoStr],
    ['Ratio', ratioStr],
    ['Cents', centsStr],
    ['Tenney–Euclidean Norm', TENormStr],
    ['Tempering out EDOs', temperingOutEDOs],
  ] as const;

  return (
    <>
      <header>
        <h1 className='font-sans text-center my-15'>{rows[0][1]}</h1>
      </header>
      <main className='flex flex-col gap-3'>
        <Link
          href='/temperament-research'
          className='block self-center btn-1 text-xl'
        >
          戻る
        </Link>
        <div className='table-container'>
          <table className='grid-cols-auto-2 max-w-200 mx-auto place-content-center gap-x-8 gap-y-3'>
            <thead>
              <tr>
                <th>性質</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([key, value]) => (
                <tr key={key}>
                  <td className='text-right'>{key}</td>
                  <td>{value}</td>
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
