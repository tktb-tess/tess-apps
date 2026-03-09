import { Correspondence, CommaKind, storageKeys } from './mod/decl';
import { atomWithStorage } from 'jotai/utils';

export const commaQueryAtom = atomWithStorage(storageKeys.commaQuery1, '');
export const commaQuery2Atom = atomWithStorage(storageKeys.commaQuery2, '');
export const commaCorrespondenceAtom = atomWithStorage<Correspondence>(
  storageKeys.commaCorrespondence,
  'forward',
);
export const commaKindAtom = atomWithStorage<CommaKind>(
  storageKeys.commaKind,
  'name',
);
export const lastLangIdAtom = atomWithStorage<string | null>(
  storageKeys.lastLangID,
  null,
);


