'use client';
import ExtLink from '@/lib/components/extLink';
import { useRef } from 'react';
import { getRndInt } from '@tktb-tess/util-fns';
import { useAtom } from 'jotai';
import { lastLangIdAtom } from '@/lib/atoms';
import { CotecJSON } from '@tktb-tess/my-zod-schema';

type Props = {
  langs: readonly CotecJSON.Content[];
};

export default function Gacha({ langs }: Props) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [langId, setLangId] = useAtom(lastLangIdAtom);

  const tableAnimation = async () => {
    tableRef.current?.classList.remove('fade-slide-in');
    tableRef.current?.classList.add('invisible');

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        tableRef.current?.classList.add('fade-slide-in');
        tableRef.current?.classList.remove('invisible');
        resolve();
      }, 10);
    });
  };

  const index = (() => {
    if (!langId) return null;
    const ini = langs.findIndex(({ id }) => id === langId);
    return ini > -1 ? ini : null;
  })();

  const handleBtn = async () => {
    const newIndex = getRndInt(0, langs.length);
    setLangId(() => langs[newIndex].id);
    await tableAnimation();
  };

  const gachaBtn = (
    <button type='button' className='__g-btn-theme-1' onClick={handleBtn}>
      回す！
    </button>
  );

  if (index == null) {
    return <>{gachaBtn}</>;
  }

  const lang = langs.at(index);

  if (!lang) {
    return <>{gachaBtn}</>;
  }

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
  } = lang;

  const site_a = (() => {
    if (!site) return;
    const site_ = site.filter(
      ({ name }) =>
        name == null || (!name.includes('辞書') && !name.includes('文法')),
    );
    return site_.length > 0 ? site_ : undefined;
  })();

  const category_a = (() => {
    if (!category) return;
    const cat_ = category.filter(
      ({ name }) => !name.includes('モユネ分類') && !name.includes('CLA v3'),
    );
    return cat_.length > 0 ? cat_ : undefined;
  })();

  return (
    <>
      {gachaBtn}
      <section aria-labelledby='gacha-result'>
        <h2 id='gacha-result'>– ガチャ結果 –</h2>
        <table ref={tableRef}>
          <tbody>
            <tr>
              <th>言語名</th>
              <td className=''>
                {name.concat(kanji).join(', ') || '[NO DATA]'}
              </td>
            </tr>
            <tr>
              <th>作者</th>
              <td className=''>
                {creator.join(', ') || '[NO DATA]'}
              </td>
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
                <td className=''>{period}</td>
              </tr>
            )}
            {site_a && (
              <tr>
                <th>サイト</th>
                <td>
                  <ul>
                    {site_a.map(({ name, url }, i) => {
                      if (name) {
                        return (
                          <li key={`${index}-${i}`}>
                            <ExtLink href={url}>{name}</ExtLink>
                          </li>
                        );
                      } else {
                        return (
                          <li key={`${index}-${i}`}>
                            <ExtLink href={url}>{url}</ExtLink>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </td>
              </tr>
            )}
            {twitter && (
              <tr>
                <th>𝕏 (旧Twitter)</th>
                <td>
                  <ul>
                    {twitter.map((url, i) => {
                      return (
                        <li key={`${index}-${i}`}>
                          <ExtLink href={url}>{url}</ExtLink>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            )}
            {dict && (
              <tr>
                <th>辞書</th>
                <td>
                  <ul>
                    {dict.map((url, i) => {
                      return (
                        <li key={`${index}-${i}`}>
                          <ExtLink href={url}>{url}</ExtLink>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            )}
            {grammar && (
              <tr>
                <th>文法</th>
                <td>
                  <ul>
                    {grammar.map((url, i) => {
                      return (
                        <li key={`${index}-${i}`}>
                          <ExtLink href={url}>{url}</ExtLink>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            )}
            {world && (
              <tr>
                <th>架空世界</th>
                <td className='text-center md:text-start'>
                  {world.join(', ')}
                </td>
              </tr>
            )}
            {category_a && (
              <tr>
                <th>分類</th>
                <td className='text-center md:text-start'>
                  {category_a.map(({ name, content }, i) => (
                    <p key={`${index}-${i}`}>
                      {content ? `${name}: ${content}` : `${name}`}
                    </p>
                  ))}
                </td>
              </tr>
            )}
            {moyune && (
              <tr>
                <th>モユネ分類</th>
                <td className='text-center md:text-start'>
                  {moyune.join('/')}
                </td>
              </tr>
            )}
            {clav3 && (
              <tr>
                <th>CLA v3</th>
                <td className='text-center md:text-start'>
                  {clav3.dialect}_{clav3.language}_{clav3.family}_
                  {clav3.creator}
                </td>
              </tr>
            )}
            {part && (
              <tr>
                <th>part</th>
                <td className='text-center md:text-start'>{part}</td>
              </tr>
            )}
            {example && (
              <tr>
                <th>例文</th>
                <td>
                  {example.map((ex, i) => (
                    <p key={`${index}-${i}`}>{ex}</p>
                  ))}
                </td>
              </tr>
            )}
            {script && (
              <tr>
                <th>表記</th>
                <td className='text-center md:text-start'>
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
}
