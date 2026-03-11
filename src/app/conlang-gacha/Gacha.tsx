'use client';
import style from './Gacha.module.css';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import { MouseEventHandler, useRef, useTransition } from 'react';
import LoadingIcon from '@/lib/components/LoadingIcon';
import type { LangDetail } from './types';

interface Props {
  langs: readonly CotecJSON.Content[];
}

const FallbackText = () => {
  return (
    <div className='mt-paragraph pb-105 flex justify-center-safe'>
      <div className='max-w-40'>
        <LoadingIcon />
      </div>
    </div>
  );
};

const sleep = (delay: number) => {
  return new Promise<void>((res) => setTimeout(res, delay));
};

const formatData = (lang: CotecJSON.Content): LangDetail => {
  const name = lang.name.concat(lang.kanji).join(', ') || '[NO DATA]';
  const creator = lang.creator.join(', ') || '[NO DATA]';
  const period = lang.period || null;
  const site = (() => {
    const s = lang.site;
    if (!s) return null;

    const s2 = s.filter(
      ({ name }) =>
        name == null || (!name.includes('辞書') && !name.includes('文法')),
    );

    if (s2.length === 0) return null;

    return s2.map((i) => [i.url, i.name ?? null] as const);
  })();

  const world = lang.world?.join(', ') || null;
  const categ = (() => {
    const c = lang.category;
    if (!c) return null;

    const c2 = c.filter(
      ({ name }) => !name.includes('モユネ分類') && !name.includes('CLA v3'),
    );

    if (c2.length === 0) return null;

    return c2.map((c2) => (c2.content ? `${c2.name}: ${c2.content}` : c2.name));
  })();

  const myn = lang.moyune?.join('/') || null;

  const clav3 = (() => {
    const l = lang.clav3;
    if (!l) return null;
    const { dialect, language, family, creator } = l;
    return `${dialect}_${language}_${family}_${creator}`;
  })();

  return [
    ['言語名', name],
    ['作者', creator],
    ['説明', lang.desc],
    ['年代', period],
    ['サイト', site],
    ['𝕏 (旧Twitter)', lang.twitter ?? null],
    ['辞書', lang.dict ?? null],
    ['文法', lang.grammar ?? null],
    ['架空世界', world],
    ['分類', categ],
    ['モユネ分類', myn],
    ['CLA v3', clav3],
    ['part', lang.part || null],
    ['例文', lang.example ?? null],
    ['表記', lang.script ?? null],
  ];
};

const Gacha = ({ langs }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [lastId, setLastId] = useAtom(lastLangIdAtom);
  const btn = useRef<HTMLButtonElement | null>(null);

  const handleGachaBtn: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    const newIndex = getRndInt(0, langs.length);
    const newId = langs.at(newIndex)?.id ?? null;
    startTransition(async () => {
      setLastId(newId);
      await sleep(1000); // 演出
    });
  };

  const formatted = (() => {
    const l = langs.find((l) => l.id === lastId);
    if (!l) return null;
    return formatData(l);
  })();

  return (
    <>
      <div className={style.gachaBtn}>
        <button onClick={handleGachaBtn} disabled={isPending} ref={btn}>
          回す！
        </button>
      </div>
      {isPending ? (
        <FallbackText />
      ) : (
        formatted && <GachaView lang={formatted} />
      )}
    </>
  );
};

export default Gacha;
