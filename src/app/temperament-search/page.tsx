import type { Commas } from '@/lib/mod/decl';

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

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>Title</h1>
      </header>
      <main className='flex flex-col min-h-[80vh] gap-3'>
        {commas.map(({ monzo, name, ratio }) => {
          const cents = monzo
            .map(([basis, value]) => 1200 * Math.log2(basis) * value)
            .reduce((prev, current) => prev + current, 0);
          const monzo_basis = monzo.map(([basis]) => basis).join('.');
          const monzo_vector =
            '[' + monzo.map(([, value]) => value).join(' ') + '\u27e9';
          const TENorm = Math.sqrt(
            monzo
              .map(([basis, value]) => (Math.log2(basis) * value) ** 2)
              .reduce((prev, cur) => prev + cur, 0)
          );
          return (
            <ul key={`${name}`}>
              <li>name: {name}</li>
              {monzo.length > 0 ? (
                <li>
                  monzo: {monzo_basis} {monzo_vector}
                </li>
              ) : (
                <li>ratio: {ratio}</li>
              )}
              {cents > 0 && <li>cents: {cents} ¢</li>}
              {TENorm > 0 && <li>TE norm: {TENorm}</li>}
            </ul>
          );
        })}
      </main>
    </>
  );
}
