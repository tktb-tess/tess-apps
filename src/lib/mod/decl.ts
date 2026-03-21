export type Match = 'exact' | 'forward' | 'backward' | 'partial';

export type CommaKind = 'name' | 'monzo' | 'cent' | 'person';

export const isMatch = (str: string) => {
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
  commaCorrespondence: 'comma-correspondence',
  commaKind: 'comma-kind',
} as const;

export const env = {
  SITE_NAME: 'τὰ συστήματα',
  BASE_URL: 'https://apps.tktb-tess.dev',
  COTEC_URL:
    'https://tktb-tess.github.io/cotec-json-data/out/conlinguistics-wiki-list-cotec.json',
  COMMAS_URL: 'https://tktb-tess.github.io/commas/out/commas.json',
} as const;

export const dateTime = Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Asia/Tokyo',
});
