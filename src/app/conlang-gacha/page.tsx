import ExtLink from '@/lib/comp/extLink';
import Link from 'next/link';
import { Cotec } from '@/lib/mod/decl';
import { TZDate } from '@date-fns/tz';

const fetchCtcJson = async () => {
  const url =
    'https://tktb-tess.github.io/cotec-json-data/parsed-from-conlinguistics-wiki-list.ctc.json';
  return fetch(url, { method: 'GET' }).then<Cotec>((resp) => {
    if (!resp.ok) throw Error(`failed to fetch: ${resp.status}`);

    return resp.json();
  });
};

const App = async () => {
  const { metadata, contents } = await fetchCtcJson();

  const updatedDate = new TZDate(metadata.date_last_updated);

  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>人工言語ガチャ</h1>
      </header>
      <main className='flex flex-col min-h-[90vh] gap-3'>
        <section aria-labelledby='setsumei' className='flex flex-col gap-2'>
          <h2 id='setsumei' className='text-center'>
            – 説明 –
          </h2>
          <p>
            <ExtLink href='https://github.com/kaeru2193/Conlang-List-Works/'>
              かえるさん (kaeru2193) のリポジトリ
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
        <p>最終更新日時: <code>{updatedDate.toLocaleString()} (日本時間)</code></p>
        <h3 className='text-center'>計 {contents.length} 語</h3>
        <p className='text-center'>準備中……</p>
      </main>
      
      <Link href='/' className='block self-center btn-1'>
        戻る
      </Link>
      <div className='h-10'></div>
    </>
  );
};

export default App;
