'use client';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './GachaView';
import { Suspense } from 'react';
import LoadingText from '@/lib/components/LoadingText';
import GachaBtn from './GachaBtn';

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
  

  return (
    <>
      <form >
        <GachaBtn />
      </form>
      <Suspense fallback={<FallbackText />}>
        
      </Suspense>
    </>
  );
};

export default Gacha;
