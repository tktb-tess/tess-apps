'use client';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import {
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import LoadingIcon from '@/lib/components/LoadingIcon';
import style from './Gacha.module.css';

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

const Gacha = ({ langs }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [lastId, setLastId] = useAtom(lastLangIdAtom);
  const btn = useRef<HTMLButtonElement | null>(null);

  const handleGachaBtn: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    startTransition(async () => {
      await new Promise<void>((res) => setTimeout(res, 1000));
      const newIndex = getRndInt(0, langs.length);
      const newId = langs.at(newIndex)?.id ?? null;
      setLastId(newId);
      requestAnimationFrame(() => {
        btn.current?.focus();
      });
    });
  };

  const lang = langs.find((l) => l.id === lastId) ?? null;

  return (
    <>
      <div className={style.gachaBtn}>
        <button onClick={handleGachaBtn} disabled={isPending} ref={btn}>
          回す!
        </button>
      </div>
      {isPending ? <FallbackText /> : lang && <GachaView lang={lang} />}
    </>
  );
};

export default Gacha;
