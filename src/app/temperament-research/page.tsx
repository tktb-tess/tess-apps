import type { Commas } from '@/lib/mod/decl';
import { Metadata } from 'next';

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

const fetchCommas = async () => {
  const resp = await fetch(process.env.NEXT_PUBLIC_COMMAS_URL ?? '', {
    method: 'GET',
  });
  if (!resp.ok)
    throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);

  return resp.json() as Promise<Commas>;
};

export default async function TemperamentSearch() {
  const { commas } = await fetchCommas();

  const data = commas.map(({ name, monzo, namedBy, ratio: r_ }) => {
    const cents = (() => {
      if (monzo.length === 0) {
        return undefined;
      }
      const pre = monzo
        .map(([b, v]) => 1200 * Math.log2(b) * v)
        .reduce((prev, cur) => prev + cur);

      return pre < 0.1 ? pre.toExponential(5) : pre.toFixed(5);
    })();

    const TENorm = (() => {
      if (monzo.length === 0) {
        return undefined;
      }
      const pre = Math.sqrt(
        monzo
          .map(([b, v]) => (Math.log2(b) * v) ** 2)
          .reduce((prev, cur) => prev + cur)
      );

      return pre >= 1000 ? pre.toExponential(5) : pre.toFixed(5);
    })();

    const monzoStr = (() => {
      if (monzo.length === 0) {
        return undefined;
      }
      const basisStr = monzo.map(([b]) => b).join('.');
      const vecStr = '[' + monzo.map(([, v]) => v).join(' ') + '\u27e9';

      return [basisStr, vecStr] as const;
    })();

    const ratio = (() => {
      if (monzo.length === 0) {
        return r_;
      }

      const num = monzo
        .map(([b, v]) => (v > 0 ? BigInt(b) ** BigInt(v) : 1n))
        .reduce((prev, cur) => prev * cur)
        .toString();
      const denom = monzo
        .map(([b, v]) => (v <= 0 ? BigInt(b) ** BigInt(-v) : 1n))
        .reduce((prev, cur) => prev * cur)
        .toString();

      const [num_s, denom_s] = [num, denom].map((n) => {
        if (n.length > 10) {
          return n.slice(0, 4) + '…' + n.slice(-4);
        } else return n;
      });
      return `${num_s} / ${denom_s}`;
    })();

    return {
      name,
      monzoStr,
      cents,
      TENorm,
      namedBy,
      ratio,
    } as const;
  });

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>{ogTitle}</h1>
      </header>
      <main className='flex flex-col min-h-[80vh] gap-3'>
        <div className='table-container'>
          <table className='grid-cols-auto-6 gap-x-2 gap-y-1'>
            <thead>
              <tr>
                <th>Comma name</th>
                <th>Monzo</th>
                <th>Ratio</th>
                <th>Cents</th>
                <th>TE norm</th>
                <th>Named by</th>
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({ name, monzoStr, ratio, cents, TENorm, namedBy }, i) => {
                  return (
                    <tr key={i}>
                      <td>{name}</td>
                      <td>
                        {monzoStr && (
                          <>
                            {monzoStr[0]}
                            <br />
                            {monzoStr[1]}
                          </>
                        )}
                      </td>
                      <td>{ratio}</td>
                      <td>{cents}</td>
                      <td>{TENorm}</td>
                      <td>{namedBy}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
