import { formatCentStr } from '@/lib/mod/funcs';
import type { CommaDetail } from './types';
import * as S from '@tktb-tess/my-zod-schema/comma_data';
import { Monzo, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';
import { cacheLife } from 'next/cache';

type Tag = 'superparticular' | 'no-2';
type CommaSize = 'unnoticeable' | 'small' | 'medium' | 'large';

export const fetchCommas = async (commaID: string) => {
  'use cache';
  cacheLife('hours');

  const json = (await import('../../commas.json')).default;
  const { commas } = S.commaDataSchema.parse(json);
  return commas.find((c) => c.id === commaID) ?? null;
};

const detectSize = (cents: number): CommaSize => {
  if (cents < 3.5) return 'unnoticeable';
  if (cents < 30) return 'small';
  if (cents < 100) return 'medium';
  return 'large';
};

const formatHeightStr = (height: number) => {
  if (height >= 100) {
    const str = height.toExponential(4);
    const regex = /^(?<num>\d\.\d+)e\+(?<exp>\d+)/;
    const matched = regex.exec(str)?.groups;
    const num = matched?.num;
    const exp = matched?.exp;
    if (!num || !exp) return str;
    return [num, exp] as const;
  }
  return height.toFixed(4);
};

export const formatData = (comma: S.Content): CommaDetail => {
  const { name: _na, colorName, namedBy: _by } = comma;

  const encoded = encodeURIComponent(_na[0] ?? '');
  const xenWikiUrl = `https://en.xen.wiki/w/${encoded}`;
  const name = _na.join(', ');
  const namedBy = _by ?? '[NO DATA]';

  const colorNameStr = (() => {
    if (colorName[0] && colorName[1]) {
      return colorName.join(', ');
    } else if (colorName[0]) {
      return colorName[0];
    } else if (colorName[1]) {
      return colorName[1];
    } else {
      return '[NO DATA]';
    }
  })();

  switch (comma.commaType) {
    case 'rational': {
      const monzo = Monzo.parse(comma.monzo);
      const monzoArray = (() => {
        const s = monzo.getMonzoVector();
        return [s.basis, s.monzo] as const;
      })();

      const centsStr = (() => {
        const cents = monzo.getCents();
        return formatCentStr(cents);
      })();

      const size = detectSize(monzo.getCents());
      const tenneyHeightStr = formatHeightStr(monzo.getTenneyHeight());
      const TENormStr = formatHeightStr(monzo.getTENorm());

      const temperingOutEDOs = getTemperOutEdos(10000, monzo).join(', ');

      const ratioStr = (() => {
        const [num, denom] = monzo.getRatio();
        let numStr = num.toString();
        let denomStr = denom.toString();

        if (numStr.length > 21) {
          const l = numStr.slice(0, 10);
          const r = numStr.slice(-10);
          const folded = numStr.length - 20;
          numStr = l + `…(${folded} 桁省略)…` + r;
        }
        if (denomStr.length > 21) {
          const l = denomStr.slice(0, 10);
          const r = denomStr.slice(-10);
          const folded = denomStr.length - 20;
          denomStr = l + `…(${folded} 桁省略)…` + r;
        }
        return `${numStr} / ${denomStr}`;
      })();

      const tags = (() => {
        const _tags: Tag[] = [];
        const [n, d] = monzo.getRatio();
        if (n - d === 1n) {
          _tags.push('superparticular');
        }

        const base2 = monzo.getArray().find(([b]) => b === 2);

        if (base2 == undefined) {
          _tags.push('no-2');
        }
        if (_tags.length === 0) return null;

        return _tags.sort().join(', ');
      })();

      return [
        ['名前', name],
        ['カラーネーム', colorNameStr],
        ['命名者', namedBy ?? '[NO DATA]'],
        ['モンゾ', monzoArray],
        ['比率', ratioStr],
        ['セント', centsStr],
        ['サイズ', size],
        ['Tenney高さ', tenneyHeightStr],
        ['Tenney–Euclideanノルム', TENormStr],
        ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ['緩和する10000以下の平均律', temperingOutEDOs],
        ['タグ', tags],
      ];
    }

    case 'irrational': {
      const { ratio, cents } = comma;

      const centsStr = formatCentStr(cents);
      const size = detectSize(cents);

      return [
        ['名前', name],
        ['カラーネーム', colorNameStr],
        ['命名者', namedBy ?? '[NO DATA]'],
        ['モンゾ', null],
        ['比率', ratio],
        ['セント', centsStr],
        ['サイズ', size],
        ['Tenney高さ', null],
        ['Tenney–Euclideanノルム', null],
        ['Xenharmonic wikiへのリンク', xenWikiUrl],
        ['緩和する10000以下の平均律', null],
        ['タグ', null],
      ];
    }
  }
};
