import type { ReadonlyDeep } from 'type-fest';

export type LangDetail = ReadonlyDeep<
  [
    ['言語名', string],
    ['作者', string],
    ['説明', string[]],
    ['年代', string | null],
    ['サイト', [string, string | null][] | null],
    ['𝕏 (旧Twitter)', string[] | null],
    ['辞書', string[] | null],
    ['文法', string[] | null],
    ['架空世界', string | null],
    ['分類', string[] | null],
    ['モユネ分類', string | null],
    ['CLA v3', string | null],
    ['part', string | null],
    ['例文', string[] | null],
    ['表記', string[] | null],
  ]
>;


