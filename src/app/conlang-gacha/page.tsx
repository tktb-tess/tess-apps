import ExtLink from '@/lib/components/extLink';
import Link from 'next/link';
import { Cotec } from '@/lib/mod/decl';
import { TZDate } from '@date-fns/tz';
import { Metadata } from 'next';
import Gacha from './gacha';
import { addMonths } from 'date-fns';

const ogTitle = '人工言語ガチャ';
const ogDesc = 'wiki掲載の人工言語のガチャ。';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: 'https://apps.tktb-tess.dev/conlang-gacha',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

const fetchCtcJson = async () => {
  
  return fetch(process.env.NEXT_PUBLIC_COTEC_URL ?? '', { method: 'GET' }).then((resp) => {
    if (!resp.ok) throw Error(`failed to fetch: ${resp.status}`);

    return resp.json() as Promise<Cotec>;
  });
};

export default async function App() {
  const { metadata: ctcMetadata, contents: langs } = await fetchCtcJson();

  const updatedDate = new TZDate(ctcMetadata.date_last_updated, 'Asia/Tokyo');

  const expires = addMonths(updatedDate, 1).getTime();

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>人工言語ガチャ</h1>
      </header>
      <main className='flex flex-col min-h-[80vh] gap-3'>
        <section aria-labelledby='setsumei' className='flex flex-col gap-2'>
          <h2 id='setsumei' className='text-center'>
            – 説明 –
          </h2>
          <p>
            <ExtLink href='https://github.com/kaeru2193/Conlang-List-Works/'>
              かえる (kaeru2193) さんのリポジトリ
            </ExtLink>
            にて管理されている <code>conlinguistics-wiki-list.ctc</code>{' '}
            からデータを取得し、ランダムで1つ言語を選んで情報を表示します。
          </p>
          <p>
            <code>conlinguistics-wiki-list.ctc</code> とは、人工言語学Wikiの
            <ExtLink href='https://wiki.conlinguistics.jp/%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%9C%8F%E3%81%AE%E4%BA%BA%E5%B7%A5%E8%A8%80%E8%AA%9E%E4%B8%80%E8%A6%A7'>
              日本語圏の人工言語一覧
            </ExtLink>
            からリストを取得し、それをCotec形式に変換したものです。
            <ExtLink href='https://migdal.jp/cl_kiita/cotec-conlang-table-expression-powered-by-csv-clakis-rfc-2h86'>
              Cotec形式の詳細
            </ExtLink>
          </p>
        </section>
        <p>
          最終更新日時:{' '}
          <code>{updatedDate.toLocaleString('ja-JP')} (日本時間)</code>
        </p>
        <p>ライセンス表示: {ctcMetadata.license.content}</p>
        <h3 className='text-center'>計 {langs.length} 語</h3>
        <Gacha langs={langs} expires={expires} />
      </main>

      <Link href='/' className='block self-center btn-1 text-xl'>
        戻る
      </Link>
      <div className='h-10'></div>
    </>
  );
};
