import { Monzo, getPrimesLte } from '@tktb-tess/xenharmonic-tool';
import { isEqual } from '@tktb-tess/util-fns';

/**
 * モンゾを基底と値の文字列配列にして返す
 * @param monzo モンゾ
 * @returns [基底の `string` (素数順通りの場合 `null`), 値の `string`]
 */
export const getMonzoVector = (monzo: Monzo): [string | null, string] => {
  const bases = monzo.map(([b]) => b);
  const values = monzo.map(([, v]) => v);

  const pList = getPrimesLte(bases.length).slice(0, bases.length);

  const vStr = values.length > 0 ? values.join('\x20') : '0';
  return isEqual(bases, pList)
    ? [null, `[${vStr}\u27e9`]
    : [`${bases.join('.')}`, `[${vStr}\u27e9`];
};

export const isEqualMonzo = (mnz1: Monzo, mnz2: Monzo) =>
  Monzo.stringify(mnz1) === Monzo.stringify(mnz2);



