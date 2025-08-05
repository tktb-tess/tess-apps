export const getVal = (edo: number, basis: number) => {
  return Math.floor(edo * Math.log2(basis) + 0.5);
};

export const getTemperingOutEDOs = (
  monzo: readonly (readonly [number, number])[],
  maxEdo: number
) => {
  if (!Number.isFinite(maxEdo)) throw Error('invalidNumber');
  const edos: number[] = [];

  for (let edo = 1; edo < maxEdo + 1; edo++) {
    const braket = monzo
      .map(([basis, v]) => getVal(edo, basis) * v)
      .reduce((prev, cur) => prev + cur, 0);

    if (braket === 0) edos.push(edo);
  }

  return edos;
};
