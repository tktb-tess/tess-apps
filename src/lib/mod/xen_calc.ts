import { Monzo } from './decl';

export const getPatentVal = (edo: number, basis: number) => {
  return Math.floor(edo * Math.log2(basis) + 0.5);
};

/**
 *
 * @param monzo モンゾ
 * @param maxEdo 最大EDO (デフォルト10000)
 * @returns
 */
export const getTemperingOutEDOs = (monzo: Monzo, maxEdo = 10000) => {
  if (!Number.isFinite(maxEdo)) throw Error('invalid number');
  if (monzo.length === 0) throw Error('empty monzo array');
  const edos: number[] = [];

  for (let edo = 1; edo < maxEdo + 1; edo++) {
    const braket = monzo
      .map(([basis, v]) => getPatentVal(edo, basis) * v)
      .reduce((prev, cur) => prev + cur, 0);

    if (braket === 0) edos.push(edo);
  }

  return edos;
};

export const getCents = (monzo: Monzo) => {
  if (monzo.length === 0) throw Error('empty monzo array');

  return monzo
    .map(([basis, value]) => 1200 * Math.log2(basis) * value)
    .reduce((prev, cur) => prev + cur);
};

export const getTenneyHeight = (monzo: Monzo) => {
  if (monzo.length === 0) throw Error('empty monzo array');

  return monzo
    .map(([basis, value]) => Math.log2(basis) * Math.abs(value))
    .reduce((prev, cur) => prev + cur);
};

export const getTENorm = (monzo: Monzo) => {
  if (monzo.length === 0) throw Error('empty monzo array');

  return Math.sqrt(
    monzo
      .map(([basis, value]) => (Math.log2(basis) * value) ** 2)
      .reduce((prev, cur) => prev + cur)
  );
};

export const getRational = (monzo: Monzo) => {
  if (monzo.length === 0) throw Error('empty monzo array');

  const numerator = monzo
    .map(([basis, value]) => (value > 0 ? BigInt(basis) ** BigInt(value) : 0n))
    .reduce((prev, cur) => prev + cur);
  const denominator = monzo
    .map(([basis, value]) => (value < 0 ? BigInt(basis) ** BigInt(-value) : 0n))
    .reduce((prev, cur) => prev + cur);


  return [numerator, denominator] as const;
};
