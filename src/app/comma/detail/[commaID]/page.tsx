import style from './page.module.css';
import { Comma } from '@tktb-tess/my-zod-schema';
import { Monzo, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import type { CommaDetail } from './types';
import { formatCentStr } from '@/lib/mod/funcs';
import CommaDetailView from './CommaDetailView';

interface Props {
  params: Promise<{ commaID: string }>;
}

type Tag = 'superparticular' | 'no-2';
type CommaSize = 'unnoticeable' | 'small' | 'medium' | 'large';

const fetchCommas = async () => {
  const resp = await fetch(env.COMMAS_URL);

  if (!resp.ok) {
    throw Error(`failed to fetch: ${resp.status} ${resp.statusText}`);
  }

  const o = await resp.json();
  return Comma.commaDataSchema.parse(o).commas;
};

export const generateMetadata = async ({ params }: Props) => {
  const { commaID } = await params;

  const commas = await fetchCommas();
  const commaData = commas.find((c) => c.id === commaID);
  const title = commaData?.name.at(0) ?? '[NO TITLE]';
  const description = commaData?.name.concat(commaData.colorName).join(', ');

  return {
    title,
    description,
    openGraph: {
      description,
      url: `/comma/detail/${commaID}`,
      siteName: env.SITE_NAME,
      images: '/link-card.png',
    },
    twitter: {
      card: 'summary',
    },
  };
};

const detectSize = (cents: number): CommaSize => {
  if (cents < 3.5) return 'unnoticeable';
  else if (cents < 30) return 'small';
  else if (cents < 100) return 'medium';
  return 'large';
};

const formatHeightStr = (height: number) => {
  if (height >= 100) {
    const str = height.toExponential(4);
    const matched = str.match(/^(?<num>\d\.\d+)e\+(?<exp>\d+)/);
    const num = matched?.groups?.num;
    const exp = matched?.groups?.exp;
    if (!num || !exp) return str;
    return [num, exp] as const;
  }
  return height.toFixed(4);
};

const formatData = (comma: Comma.Content): CommaDetail => {
  const { name: _na, colorName, namedBy: _by } = comma;

  const xenWikiUrl = `https://en.xen.wiki/w/${encodeURIComponent(_na[0] ?? '')}`;
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
      const monzo = new Monzo(comma.monzo);
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

const Page = async ({ params }: Props) => {
  const { commaID } = await params;
  const commaData = (await fetchCommas()).find((c) => c.id === commaID);

  if (!commaData) {
    notFound();
  }

  const title = commaData.name[0] ?? '[NO TITLE]';
  const formatted = formatData(commaData);

  return (
    <>
      <h1 className={style.commaTitle}>{title}</h1>
      <div className={style.backBtn}>
        <Link href='/comma'>戻る</Link>
      </div>
      <CommaDetailView comma={formatted} />
    </>
  );
};

export default Page;
