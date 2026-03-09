'use client';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './gacha-view';
import { Suspense } from 'react';
import LoadingText from '@/lib/components/LoadingText';
import style from './gacha.module.css';

interface Props {
  langs: readonly CotecJSON.Content[];
}

const getLang = (
  langs: readonly CotecJSON.Content[],
  langId: string | null,
  delay: number,
): Promise<CotecJSON.Content | null> => {
  const { promise, resolve } =
    Promise.withResolvers<CotecJSON.Content | null>();
  if (langId == null) return Promise.resolve(null);
  setTimeout(() => {
    const lang = langs.find((l) => l.id === langId) ?? null;
    resolve(lang);
  }, delay);
  return promise;
};

const FallbackText = () => {
  return (
    <div className='mt-paragraph pb-105 flex justify-center-safe'>
      <LoadingText />
    </div>
  );
};

const Gacha = ({ langs }: Props) => {
  const [langId, setLangId] = useAtom(lastLangIdAtom);
  const langPromise = getLang(langs, langId, 1000);

  const handleBtn = () => {
    const newIndex = getRndInt(0, langs.length);
    const newId = langs[newIndex]?.id ?? null;
    setLangId(newId);
  };

  return (
    <>
      <div className={style.gachaBtn}>
        <button type='button' className='btn-theme-1' onClick={handleBtn}>
          回す！
        </button>
      </div>
      <Suspense fallback={<FallbackText />}>
        <GachaView langPromise={langPromise} />
      </Suspense>
    </>
  );
};

export default Gacha;
