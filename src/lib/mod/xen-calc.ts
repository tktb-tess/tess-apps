import { Commas, Monzo } from './decl';
import { isEqArray, millerRabin } from './util';

const pList: readonly number[] = Array(100000)
    .fill(0)
    .map((_, i) => BigInt(i + 1))
    .filter((n) => millerRabin(n))
    .map((p) => Number(p));


export const fetchCommas = async () => {
  const resp = await fetch(process.env.NEXT_PUBLIC_COMMAS_URL!, {
    method: 'GET',
  });
  if (!resp.ok) {
    throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
  }

  return resp.json() as Promise<Commas>;
};

export const generatePrimeList = (length: number) => {

  if (pList.length >= length) {
    return pList.slice(0, length);
  } else {
    throw Error('length exceeds limit');
  }
};

/**
 * @description `edo` で指定した平均律のpatent valのうち、`basis` で指定した基底の値を返す
 * @param edo EDO
 * @param basis 基底の素数
 * @returns
 */
export const getPatentVal = (edo: number, basis: number) => {
  return Math.floor(edo * Math.log2(basis) + 0.5);
};

/**
 * @description `monzo`をテンパーアウトするEDOの配列を返す
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
      .reduce((prev, cur) => prev + cur);

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

export const getRational = (monzo: Monzo): [bigint, bigint] => {
  if (monzo.length === 0) throw Error('empty monzo array');

  const numerator = monzo
    .map(([basis, value]) => (value > 0 ? BigInt(basis) ** BigInt(value) : 1n))
    .reduce((prev, cur) => prev * cur, 1n);
  const denominator = monzo
    .map(([basis, value]) => (value < 0 ? BigInt(basis) ** BigInt(-value) : 1n))
    .reduce((prev, cur) => prev * cur, 1n);

  return [numerator, denominator];
};

export const getMonzoVector = (monzo: Monzo) => {
  const bases = monzo.map(([b]) => b);
  const values = monzo.map(([, v]) => v);

  const pList = generatePrimeList(bases.length);
  return isEqArray(bases, pList)
    ? `[${values.join(' ')}\u27e9`
    : `${bases.join('.')} [${values.join(' ')}\u27e9`;
};
