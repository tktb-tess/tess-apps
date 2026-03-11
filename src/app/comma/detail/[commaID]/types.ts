import type { ReadonlyDeep } from 'type-fest';

export type CommaDetail = ReadonlyDeep<
  [
    ['名前', string],
    ['カラーネーム', string],
    ['命名者', string],
    ['モンゾ', [string | null, string]],
    ['比率', string],
    ['セント', string | [string, string]],
    ['サイズ', string],
    ['Tenney高さ', string | null],
    ['Tenney–Euclideanノルム', string | null],
    ['Xenharmonic wikiへのリンク', string],
    ['緩和する10000以下の平均律', string | null],
    ['タグ', string | null],
  ]
>;
