import { fetchCommas, getCents, getMonzoVector, getRational, getTemperingOutEDOs, getTENorm } from '@/lib/mod/xen-calc';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ commaName: string }>;
};

const ogTitle = '音律探索';
const ogDesc = 'Regular temperament の探索';

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

const fetchCommaData = async (name_: string) => {
  const { commas } = await fetchCommas();
  return commas.find(({ name }) => name === name_);
};

export default async function CommaDetail({ params }: Props) {
  const { commaName } = await params;
  const commaData = await fetchCommaData(commaName);
  if (!commaData) {
    notFound();
  }
  const { monzo, colorName, namedBy } = commaData;
  const monzoStr = getMonzoVector(monzo);
  const cents = getCents(monzo);
  const centsStr = cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4);
  const TENorm = getTENorm(monzo);
  const TENormStr = TENorm >= 100 ? cents.toExponential(4) : cents.toFixed(4);
  const temperingOutEDOs = getTemperingOutEDOs(monzo).join(', ');
  const ratio = getRational(monzo);

  return (
    <>
      <header>
        <h1>{commaName}</h1>
      </header>
      <main className='flex flex-col gap-3'>
        <div>
          <table className='grid-cols-auto-2'></table>
        </div>
      </main>
    </>
  );
}
