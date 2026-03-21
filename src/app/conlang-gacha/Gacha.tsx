'use client';
import style from './Gacha.module.css';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import { MouseEventHandler, useRef, useTransition } from 'react';
import LoadingIcon from '@/lib/components/LoadingIcon';
import { sleep, formatData } from './funcs';

interface Props {
  langs: readonly CotecJSON.Content[];
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
