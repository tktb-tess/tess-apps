import { atom } from "jotai";
import { Correspondence, CommaKind } from "./mod/decl";

export const commaSearchQuery = atom('');
export const commaSearchQuery2 = atom('');
export const commaCorresp = atom<Correspondence>('forward');
export const commaKind = atom<CommaKind>('name');