export interface CommaBaseData {
  readonly id: string;
  readonly names: string[];
  readonly centsStr: string | readonly [string, string];
}

export interface RationalCommaData extends CommaBaseData {
  readonly type: 'rational';
  readonly monzoStr: {
    readonly basis: string | null;
    readonly monzo: string;
  };
}

export interface IrrationalCommaData extends CommaBaseData {
  readonly type: 'irrational';
  readonly ratio: string;
}

export type CommaData = RationalCommaData | IrrationalCommaData;
