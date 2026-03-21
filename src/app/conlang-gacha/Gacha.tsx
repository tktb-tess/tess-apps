'use client';
import style from './Gacha.module.css';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import { MouseEventHandler, useTransition } from 'react';
import LoadingIcon from '@/lib/components/LoadingIcon';
import { sleep, formatData } from './funcs';
import { ReadonlyDeep } from 'type-fest';

interface Props {
  langs: ReadonlyMap<string, ReadonlyDeep<CotecJSON.Content[]>>;
}

const FallbackText = () => {
  return (
    <div className={style.fallbackText}>
      <div className={style.fallbackIcon}>
        <LoadingIcon />
      </div>
    </div>
  );
};

const Gacha = ({ langs }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [lastId, setLastId] = useAtom(lastLangIdAtom);
  const keys = [...langs.keys()];

  const handleGachaBtn: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    const newIndex = getRndInt(0, keys.length);
    const newId = keys.at(newIndex) ?? null;
    startTransition(async () => {
      setLastId(newId);
      await sleep(1000); // 演出
    });
  };

  const formatted = (() => {
    if (!lastId) return null;
    const l = langs.get(lastId)?.[0];
    if (!l) return null;
    return formatData(l);
  })();

  return (
    <>
      <div className={style.gachaBtn}>
        <button onClick={handleGachaBtn} disabled={isPending}>
          {isPending ? '抽選中……' : '回す！'}
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
