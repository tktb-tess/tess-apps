'use client';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import { MouseEventHandler, useState, useTransition } from 'react';
import LoadingIcon from '@/lib/components/LoadingIcon';
import style from './Gacha.module.css';

interface Props {
  langs: readonly CotecJSON.Content[];
}

const FallbackText = () => {
  return (
    <div className='mt-paragraph pb-105 flex justify-center-safe'>
      <LoadingIcon />
    </div>
  );
};

const Gacha = ({ langs }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [lastId, setLastId] = useAtom(lastLangIdAtom);
  const [index, setIndex] = useState<number | null>(() => {
    if (lastId == null) return null;
    const initIndex = langs.findIndex((l) => l.id === lastId);
    if (initIndex > -1) return initIndex;
    return null;
  });

  const updateIndex: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    startTransition(async () => {
      await new Promise<void>((res) => setTimeout(res, 1000));
      const newIndex = getRndInt(0, langs.length);
      const newId = langs.at(newIndex)?.id ?? null;
      setIndex(newIndex);
      setLastId(newId);
    });
  };

  const lang = (index == null ? null : langs.at(index)) ?? null;

  return (
    <>
      <div className={style.gachaBtn}>
        <button
          onClick={updateIndex}
          className='btn-theme-1'
          disabled={isPending}
        >
          回す!
        </button>
      </div>
      {isPending ? <FallbackText /> : lang && <GachaView lang={lang} />}
    </>
  );
};

export default Gacha;
