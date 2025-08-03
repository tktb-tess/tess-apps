'use client';
import ExtLink from '@/lib/components/extLink';
import { CotecContent } from '@/lib/mod/decl';
import { useRef, useState } from 'react';

type Props = {
  langs: readonly CotecContent[];
};

const getRndInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const Gacha = ({ langs }: Props) => {
  const [index, setIndex] = useState(0);

  const {
    name,
    kanji,
    desc,
    creator,
    period,
    site,
    twitter,
    dict,
    grammar,
    world,
    category,
    moyune,
    clav3,
    part,
    example,
    script,
  } = langs[index];

  const site_a = site.filter(
    ({ name }) => !name || (!name.includes('辞書') && !name.includes('文法'))
  );

  const category_a = category.filter(({ name }) => !name.includes('モユネ分類') && !name.includes('CLA v3'));

  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleBtn = () => {
    setIndex(() => getRndInt(0, langs.length));
    tableRef.current?.classList.remove('fade-slide-in');
    tableRef.current?.classList.replace('opacity-100', 'opacity-0');

    setTimeout(() => {
      tableRef.current?.classList.add('fade-slide-in');
      tableRef.current?.classList.replace('opacity-0', 'opacity-100');
    }, 10);
  };

  
  return (
    <>
      <button type='button' className='text-xl btn-1 self-center' onClick={handleBtn}>
        回す！
      </button>
      <section aria-labelledby='result' className='my-5'>
        <h2 className='text-center' id='result'>
          – ガチャ結果 –
        </h2>
        <table
          className='
          grid-cols-1 md:grid-cols-auto-2 place-content-center gap-y-3 gap-x-8 md:[&_th]:text-end md:[&_td]:max-w-200 px-3 py-1
          opacity-100 fade-slide-in
        '
          ref={tableRef}
        >
          <tbody>
            <tr>
              <th>言語名</th>
              <td>{name.concat(kanji).join(', ') || '[NO DATA]'}</td>
            </tr>
            <tr>
              <th>作者</th>
              <td>{creator.join(', ') || '[NO DATA]'}</td>
            </tr>
            <tr>
              <th>説明</th>
              {desc.length > 0 ? (
                <td>
                  {desc.map((paragraph, i) => (
                    <p key={`${index}-${i}`}>{paragraph}</p>
                  ))}
                </td>
              ) : (
                <td>[NO DATA]</td>
              )}
            </tr>
            {period && (
              <tr>
                <th>年代</th>
                <td>{period}</td>
              </tr>
            )}
            {site_a.length > 0 && (
              <tr>
                <th>サイト</th>
                <td>
                  {site_a.map(({ name, url }, i) => {
                    if (name) {
                      return (
                        <p key={`${index}-${i}`}>
                          <ExtLink href={url}>{name}</ExtLink>
                        </p>
                      );
                    } else {
                      return (
                        <p key={`${index}-${i}`}>
                          <ExtLink href={url}>{url}</ExtLink>
                        </p>
                      );
                    }
                  })}
                </td>
              </tr>
            )}
            {twitter.length > 0 && (
              <tr>
                <th>𝕏 (旧Twitter)</th>
                <td>
                  {twitter.map((url, i) => {
                    return (
                      <p key={`${index}-${i}`}>
                        <ExtLink href={url}>{url}</ExtLink>
                      </p>
                    );
                  })}
                </td>
              </tr>
            )}
            {dict.length > 0 && (
              <tr>
                <th>辞書</th>
                <td>
                  {dict.map((url, i) => {
                    return (
                      <p key={`${index}-${i}`}>
                        <ExtLink href={url}>{url}</ExtLink>
                      </p>
                    );
                  })}
                </td>
              </tr>
            )}
            {grammar.length > 0 && (
              <tr>
                <th>文法</th>
                <td>
                  {grammar.map((url, i) => {
                    return (
                      <p key={`${index}-${i}`}>
                        <ExtLink href={url}>{url}</ExtLink>
                      </p>
                    );
                  })}
                </td>
              </tr>
            )}

            {world.length > 0 && (
              <tr>
                <th>架空世界</th>
                <td>{world.join(', ')}</td>
              </tr>
            )}
            {category_a.length > 0 && (
              <tr>
                <th>分類</th>
                <td>
                  {category_a.map(({ name, content }, i) => (
                    <p key={`${index}-${i}`}>
                      {content ? `${name}: ${content}` : `${name}`}
                    </p>
                  ))}
                </td>
              </tr>
            )}
            {moyune.length > 0 && (
              <tr>
                <th>モユネ分類</th>
                <td>{moyune.join('/')}</td>
              </tr>
            )}
            {clav3 && (
              <tr>
                <th>CLA v3</th>
                <td>
                  {clav3.dialect}_{clav3.language}_{clav3.family}_
                  {clav3.creator}
                </td>
              </tr>
            )}
            {part && (
              <tr>
                <th>part</th>
                <td>{part}</td>
              </tr>
            )}
            {example.length > 0 && (
              <tr>
                <th>例文</th>
                <td>
                  {example.map((ex, i) => (
                    <p key={`${index}-${i}`}>{ex}</p>
                  ))}
                </td>
              </tr>
            )}
            {script.length > 0 && (
              <tr>
                <th>表記</th>
                <td>
                  {script.map((ex, i) => (
                    <p key={`${index}-${i}`}>{ex}</p>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Gacha;
