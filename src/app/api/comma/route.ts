import { bailliePSW } from '@tktb-tess/util-fns';
import {
  getTemperOutEdos,
  Monzo,
} from '@tktb-tess/xenharmonic-tool';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const mnzParamSchema = z.string().regex(/^(\d+\:)?\-?\d+(,(\d+\:)?\-?\d+)*$/);

const monzoSchema = z
  .tuple([z.number().int().gte(2), z.number().int()])
  .array();

type MonzoData = {
  readonly monzo: Monzo;
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
    const monzo__ = mnzParamSchema.parse(decodeURIComponent(mnz_)).split(',');
    const pList = (() => {
      const { length } = monzo__;
      const ps_: number[] = [];
      for (let n = 2n; ps_.length < length; n++) {
        if (bailliePSW(n)) ps_.push(Number(n));
      }
      return ps_;
    })();
    const monzo_: [number, number][] = monzo__.map((s, i) => {
      if (s.includes(':')) {
        const [b, v] = s.split(':').map((n) => Number.parseInt(n));
        return [b, v];
      } else {
        return [pList[i], Number.parseInt(s)];
      }
    });

    const monzo = new Monzo(monzoSchema.parse(monzo_))
    

    const fr = monzo.getRatio();

    const monzoData: MonzoData = {
      monzo,
      cents: monzo.getCents(),
      TenneyHeight: monzo.getTenneyHeight(),
      TENorm: monzo.getTENorm(),
      VenedettiHeight: `${fr[0] * fr[1]}`,
      fraction: [`${fr[0]}`, `${fr[1]}`],
      temperOutEDOs: getTemperOutEdos(10000, monzo),
    };

    return new NextResponse(JSON.stringify(monzoData), {
      headers,
      status: 200,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
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
