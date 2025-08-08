import { getCents, getMonzoVector, fetchCommas } from '@/lib/mod/xen-calc';
import { Metadata } from 'next';
import Link from 'next/link';

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

export default async function TemperamentSearch() {
  const { commas, metadata } = await fetchCommas();
  const update = new Date(metadata.lastUpdate).getTime();
  const nameMonzos = commas.filter(({ monzo }) => monzo.length > 0).map(({ name, colorName, monzo }) => {
    return [name || colorName[0], getMonzoVector(monzo), getCents(monzo)] as const;
  });

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>{ogTitle}</h1>
      </header>
      <main className='flex flex-col gap-3'>
        <div className='table-container'>
          <table className='grid-cols-auto-3'>
            <thead>
              <tr>
                <th>Comma name</th>
                <th>Monzo</th>
                <th>Cents</th>
              </tr>
            </thead>
            <tbody>
              {nameMonzos.map(([name, monzo, cents], i) => (
                <tr key={`${update}-${i}`}>
                  <td><Link href={`/temperament-research/${encodeURIComponent(name)}`}>{name}</Link></td>
                  <td>{monzo}</td>
                  <td>{cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
