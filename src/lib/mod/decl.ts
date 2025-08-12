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

export type CotecMetadata = Readonly<{
  datasize: [number, number];
  title: string;
  author: string[];
  createdDate: string;
  lastUpdate: string;
  jsonLastUpdate: string;
  license: { name: string; content: string };
  advanced: number;
  label: string[];
  type: string[];
}>;

export type CotecContent = Readonly<{
  id: string;
  messier: unknown;
  name: readonly string[];
  kanji: readonly string[];
  desc: readonly string[];
  creator: readonly string[];
  period?: string;
  site?: { name?: string; url: string }[];
  twitter?: readonly string[];
  dict?: readonly string[];
  grammar?: readonly string[];
  world?: readonly string[];
  category?: readonly Readonly<{ name: string; content?: string }>[];
  moyune?: readonly MoyuneClass[];
  clav3?: Readonly<{
    dialect: string;
    language: string;
    family: string;
    creator: string;
  }>;
  part?: string;
  example?: readonly string[];
  script?: readonly string[];
}>;

export type Cotec = {
  readonly metadata: CotecMetadata;
  readonly contents: readonly CotecContent[];
};

// Comma types

export type Monzo = readonly (readonly [number, number])[];

type CommaType =
  | {
      readonly commaType: 'rational';
      readonly monzo: Monzo;
    }
  | {
      readonly commaType: 'irrational';
      readonly ratio: string;
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
