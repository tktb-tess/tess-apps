'use client';

import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';
import GachaView from './gacha-view';

interface Props {
  langs: readonly CotecJSON.Content[];
}

export default function Gacha({ langs }: Props) {
  const [langId, setLangId] = useAtom(lastLangIdAtom);

  const index = (() => {
    if (!langId) return null;
    const ini = langs.findIndex((l) => l.id === langId);
    return ini > -1 ? ini : null;
  })();

  const handleBtn = () => {
    const newIndex = getRndInt(0, langs.length);
    const newId = langs[newIndex]?.id ?? null;
    setLangId(newId);
  };

  const lang = typeof index === 'number' ? langs.at(index) : undefined;
  return (
    <>
      <button type='button' className='btn-theme-1' onClick={handleBtn}>
        回す！
      </button>
      {lang && <GachaView lang={lang} />}
    </>
  );
}
