import * as Comma from '@tktb-tess/my-zod-schema/comma_data';
import type { CommaKind, Match } from '@/lib/mod/decl';
import { Monzo } from '@tktb-tess/xenharmonic-tool/monzo';
import type { CommaData } from './types';
import { formatCentStr } from '@/lib/mod/funcs';

export const fetchComma = async (
  query: string,
  query2: string,
  kind: CommaKind,
  match: Match,
) => {
  const json = (await import('../../commas.json')).default;
  const { commas } = Comma.commaDataSchema.parse(json);
  const filtered = filterComma(commas, query, query2, kind, match);
  return filtered.map(formatData);
};

/**
 * 条件に一致するコンマを抽出
 */
const filterComma = (
  commas: readonly Comma.Content[],
  query: string,
  query2: string,
  kind: CommaKind,
  match: Match,
) => {
  try {
    switch (kind) {
      case 'name': {
        return commas.filter(({ name }) => {
          const cNames = name.map((s) => s.toLowerCase());
          const qName = query.toLowerCase();

          return cNames.some((cName) => {
            switch (match) {
              case 'exact': {
                return cName === qName;
              }
              case 'forward': {
                return cName.slice(0, qName.length) === qName;
              }
              case 'backward': {
                return cName.slice(-qName.length) === qName;
              }
              case 'partial': {
                return cName.includes(qName);
              }
            }
          });
        });
      }
      case 'monzo': {
        const iMonzo = Monzo.parse(query);

        return commas.filter((comma) => {
          if (comma.commaType === 'irrational') {
            return false;
          }

          const monzo = Monzo.parse(comma.monzo);

          if (monzo.getArray().length < iMonzo.getArray().length) {
            return false;
          }

          const sliced = new Monzo(
            monzo.getArray().filter(([b]) => {
              return iMonzo.getArray().some(([ib]) => ib === b);
            }),
          );

          return iMonzo.toString() === sliced.toString();
        });
      }
      case 'cent': {
        const lower = (() => {
          const l = Number.parseFloat(query);
          return Number.isNaN(l) ? 0 : l;
        })();
        const upper = (() => {
          const l = Number.parseFloat(query2);
          return Number.isNaN(l) ? Infinity : l;
        })();
        return commas.filter((comma) => {
          if (comma.commaType === 'irrational') {
            const { cents } = comma;
            return lower <= cents && cents < upper;
          }
          const monzo = Monzo.parse(comma.monzo);
          const cents = monzo.getCents();
          return lower <= cents && cents < upper;
        });
      }
      case 'person': {
        return commas.filter(({ namedBy }) => {
          if (!namedBy) return false;
          const cName = namedBy.toLowerCase();
          const qName = query.toLowerCase();

          switch (match) {
            case 'exact': {
              return cName === qName;
            }
            case 'forward': {
              return cName.slice(0, qName.length) === qName;
            }
            case 'backward': {
              return cName.slice(-qName.length) === qName;
            }
            case 'partial': {
              return cName.includes(qName);
            }
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * データ整形
 * @param comma コンマ
 * @returns 整形されたデータ
 */
const formatData = (comma: Comma.Content): CommaData => {
  switch (comma.commaType) {
    case 'rational': {
      const { id, name, monzo: mnz } = comma;
      const monzo = Monzo.parse(mnz);
      const monzoStr = monzo.getMonzoVector();
      const cents = monzo.getCents();
      const centsStr = formatCentStr(cents);

      return {
        id,
        names: name,
        centsStr,
        type: 'rational',
        monzoStr,
      };
    }
    case 'irrational': {
      const { id, name, ratio, cents } = comma;
      const centsStr = formatCentStr(cents);

      return {
        id,
        names: name,
        centsStr,
        type: 'irrational',
        ratio,
      };
    }
  }
};
