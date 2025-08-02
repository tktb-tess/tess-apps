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
  date_created: string;
  date_last_updated: string;
  license: { name: string; content: string };
  advanced: number;
  label: string[];
  type: string[];
}>;

export type CotecContent = Readonly<{
  messier: unknown;
  name: readonly string[];
  kanji: readonly string[];
  desc: readonly string[];
  creator: readonly string[];
  period: string | null;
  site: { name: string | null; url: string }[];
  twitter: readonly string[];
  dict: readonly string[];
  grammar: readonly string[];
  world: readonly string[];
  category: readonly Readonly<{ name: string; content: string | null }>[];
  moyune: readonly MoyuneClass[];
  clav3: Readonly<{
    dialect: string;
    language: string;
    family: string;
    creator: string;
  }> | null;
  part: string | null;
  example: readonly string[];
  script: readonly string[];
}>;

export type Cotec = {
  metadata: CotecMetadata;
  contents: readonly CotecContent[];
};

export type CTCCache = {
  cache: Cotec;
  expires: number;
};
