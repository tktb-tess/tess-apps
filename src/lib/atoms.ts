import { atom } from 'jotai';
import { Correspondence, CommaKind, storageKeys } from './mod/decl';
import { atomWithStorage } from 'jotai/utils';

export const commaSearchQuery = atom('');
export const commaSearchQuery2 = atom('');
export const commaCorresp = atom<Correspondence>('forward');
export const commaKind = atom<CommaKind>('name');
export const lastLangIdAtom = atomWithStorage<string | null>(
  storageKeys.lastLangID,
  null,
  undefined,
  {
    getOnInit: true,
  }
);
