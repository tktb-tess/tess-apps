import { Commas } from '@/lib/mod/decl';
import { getCents, getMonzoVector } from '@/lib/mod/xen-calc';
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
  const fetchCommas = async () => {
    const resp = await fetch(process.env.NEXT_PUBLIC_COMMAS_URL!, {
      method: 'GET',
      cache: 'no-cache'
    });
    if (!resp.ok) {
      throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
    }

    return resp.json() as Promise<Commas>;
  };
  const { commas, metadata } = await fetchCommas();
  const update = new Date(metadata.lastUpdate).getTime();

  const nameMonzos = commas.map((comma) => {
    if (comma.commaType === 'irrational') {
      return undefined;
    }

    const { name, colorName, monzo, id } = comma;
    return [
      name[0] || colorName[0],
      getMonzoVector(monzo),
      getCents(monzo),
      id,
    ] as const;
  });

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>{ogTitle}</h1>
      </header>
      <main className='flex flex-col gap-3'>
        <Link href='/' className='block self-center btn-1 text-xl'>
          戻る
        </Link>
        <div className='table-container'>
          <table className='grid-cols-auto-3 max-w-300 mx-auto place-content-center gap-x-8 gap-y-3'>
            <thead>
              <tr>
                <th>Comma name</th>
                <th>Monzo</th>
                <th>Cents (¢)</th>
              </tr>
            </thead>
            <tbody>
              {nameMonzos.map((data, i) => {
                if (!data) return undefined;
                const [name, monzo, cents, id] = data;
                return (
                  <tr key={`${update}-${i}`}>
                    <td>
                      <Link
                        href={`/temperament-research/${encodeURIComponent(id)}`}
                      >
                        {name}
                      </Link>
                    </td>
                    <td>{monzo}</td>
                    <td>
                      {cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
