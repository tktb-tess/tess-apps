import {
  getCents,
  getFraction,
  getPrime,
  getTemperOutEDOs,
  getTenneyHeight,
  getTENorm,
} from '@/lib/mod/xen-calc';
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

const mnzParamSchema = z.string().regex(/^(\d+\:)?\-?\d+(,(\d+\:)?\-?\d+)*$/);

const monzoSchema = z
  .tuple([z.number().int().gte(2), z.number().int()])
  .array();

type MonzoData = {
  readonly monzo: z.infer<typeof monzoSchema>;
  readonly cents: number;
  readonly TenneyHeight: number;
  readonly TENorm: number;
  readonly fraction: [string, string];
  readonly VenedettiHeight: string;
  readonly temperOutEDOs: readonly number[];
};

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
} as const;

export const GET = async ({ nextUrl }: NextRequest) => {
  try {
    const mnz_ = nextUrl.searchParams.get('monzo');
    console.log(mnz_);
    if (!mnz_) {
      return new NextResponse(JSON.stringify({ message: 'emptyMonzo' }), {
        status: 400,
        headers,
      });
    }
    const monzo_ = mnzParamSchema
      .parse(decodeURIComponent(mnz_))
      .split(',')
      .map((s, i) => {
        if (s.includes(':')) {
          const [b, v] = s.split(':').map((n) => Number.parseInt(n));
          return [b, v];
        } else {
          return [getPrime(i), Number.parseInt(s)];
        }
      });

    const monzo = monzoSchema
      .parse(monzo_)
      .toSorted(([a], [b]) => a - b)
      .filter(([, v]) => v !== 0);
    const fr = getFraction(monzo);

    const monzoData: MonzoData = {
      monzo,
      cents: getCents(monzo),
      TenneyHeight: getTenneyHeight(monzo),
      TENorm: getTENorm(monzo),
      VenedettiHeight: `0x${(fr[0] * fr[1]).toString(16)}`,
      fraction: [`0x${fr[0].toString(16)}`, `0x${fr[1].toString(16)}`],
      temperOutEDOs: getTemperOutEDOs(monzo),
    };

    return new NextResponse(JSON.stringify(monzoData), {
      headers,
      status: 200,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      const { issues, name } = e;
      const { errors } = z.treeifyError(e);
      const err = {
        name,
        issues,
        errors,
      } as const;

      return new NextResponse(JSON.stringify(err), {
        status: 400,
        headers,
      });
    } else if (e instanceof Error) {
      const { name, message } = e;
      const err = {
        name,
        message,
      } as const;

      return new NextResponse(JSON.stringify(err), {
        status: 500,
        headers,
      });
    } else {
      const err = {
        name: 'unidentifiedError',
      } as const;
      return new NextResponse(JSON.stringify(err), {
        status: 500,
        headers,
      });
    }
  }
};
