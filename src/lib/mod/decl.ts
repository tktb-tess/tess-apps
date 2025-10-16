// Cotec types

const moyunes = [
  'INT',
  'ART',
  'EXP',
  'PHI',
  'HYP',
  'NAT',
  'REA',
  'IMG',
  'CIN',
  'CDE',
  'GEN',
  'SPE',
  'SON',
  'LIT',
  'KIN',
  'SER',
  'JOK',
  'PAV',
  'AAV',
  'PWL',
  'AWL',
  'TOL',
  'PRI',
  'PUB',
  'FIX',
] as const;

export type MoyuneClass = (typeof moyunes)[number];

export const isMoyune = (str: string): str is MoyuneClass => {
  for (const moyune of moyunes) {
    if (moyune === str) return true;
  }
  return false;
};

export type CotecMetadata = {
  readonly datasize: [number, number];
  readonly title: string;
  readonly author: string[];
  readonly createdDate: string;
  readonly lastUpdate: string;
  readonly jsonLastUpdate: string;
  readonly license: { name: string; content: string };
  readonly advanced: number;
  readonly label: string[];
  readonly type: string[];
};

export type CotecContent = {
  readonly id: string;
  readonly messier: unknown;
  readonly name: readonly string[];
  readonly kanji: readonly string[];
  readonly desc: readonly string[];
  readonly creator: readonly string[];
  readonly period?: string;
  readonly site?: { name?: string; url: string }[];
  readonly twitter?: readonly string[];
  readonly dict?: readonly string[];
  readonly grammar?: readonly string[];
  readonly world?: readonly string[];
  readonly category?: readonly Readonly<{ name: string; content?: string }>[];
  readonly moyune?: readonly MoyuneClass[];
  readonly clav3?: {
    readonly dialect: string;
    readonly language: string;
    readonly family: string;
    readonly creator: string;
  };
  readonly part?: string;
  readonly example?: readonly string[];
  readonly script?: readonly string[];
};

export type Cotec = {
  readonly metadata: CotecMetadata;
  readonly contents: readonly CotecContent[];
};

// Comma types

type CommaType =
  | {
      readonly commaType: 'rational';
      readonly monzo: Array<[number, number]>;
    }
  | {
      readonly commaType: 'irrational';
      readonly ratio: string;
      readonly cents: number;
    };

export type CommaData = CommaType & {
  readonly id: string;
  readonly name: string[];
  readonly colorName: readonly [string, string];
  readonly namedBy?: string;
};

export type CommaMetadata = {
  readonly lastUpdate: string;
  readonly numberOf: number;
};

export type Commas = {
  readonly metadata: CommaMetadata;
  readonly commas: readonly CommaData[];
};

export type Correspondence = 'exact' | 'forward' | 'backward' | 'partial';

export type CommaKind = 'name' | 'monzo' | 'cent' | 'person';

export const isCorre = (str: string) => {
  return (
    str === 'forward' ||
    str === 'backward' ||
    str === 'partial' ||
    str === 'exact'
  );
};

export const isKind = (str: string) => {
  return (
    str === 'name' || str === 'monzo' || str === 'cent' || str === 'person'
  );
};

export const storageKeys = {
  lastLangID: 'last-lang-id',
  commaQuery1: 'comma-query-1',
  commaQuery2: 'comma-query-2',
  commaCorresp: 'comma-corresp',
  commaKind: 'comma-kind',
} as const;

export const env = {
  SITE_NAME: 'τὰ συστήματα',
  BASE_URL: 'https://apps.tktb-tess.dev',
  COTEC_URL:
    'https://tktb-tess.github.io/cotec-json-data/out/conlinguistics-wiki-list-cotec.json',
  COMMAS_URL: 'https://tktb-tess.github.io/commas/out/commas.json',
} as const;
