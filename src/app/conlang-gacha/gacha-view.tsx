import ExtLink from '@/lib/components/extLink';
import type { CotecJSON } from '@tktb-tess/my-zod-schema';
import { useId, useRef } from 'react';
import styles from './gacha-view.module.css';

interface Props {
  lang: Readonly<CotecJSON.Content>;
}

export default function GachaView({ lang }: Props) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const {
    name,
    kanji,
    desc,
    creator,
    period,
    twitter,
    dict,
    grammar,
    world,
    moyune,
    clav3,
    part,
    example,
    script,
  } = lang;

  const labelId = useId();

  const site = (() => {
    if (!lang.site) return;
    const site_ = lang.site.filter(
      ({ name }) =>
        name == null || (!name.includes('辞書') && !name.includes('文法')),
    );
    return site_.length > 0 ? site_ : undefined;
  })();

  const category = (() => {
    if (!lang.category) return;
    const cat_ = lang.category.filter(
      ({ name }) => !name.includes('モユネ分類') && !name.includes('CLA v3'),
    );
    return cat_.length > 0 ? cat_ : undefined;
  })();

  return (
    <section aria-labelledby={labelId} className={styles.root}>
      <h2 id={labelId} className={styles.title}>– ガチャ結果 –</h2>
      <table ref={tableRef} className={styles.gachaTable}>
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
                {desc.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
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
          {site && (
            <tr>
              <th>サイト</th>
              <td>
                <ul>
                  {site.map(({ name, url }, i) => {
                    if (name) {
                      return (
                        <li key={`${name}-${url}`}>
                          <ExtLink href={url}>{name}</ExtLink>
                        </li>
                      );
                    } else {
                      return (
                        <li key={url}>
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
                  {twitter.map((url) => {
                    return (
                      <li key={url}>
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
                  {dict.map((url) => {
                    return (
                      <li key={url}>
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
                  {grammar.map((url) => {
                    return (
                      <li key={url}>
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
              <td>{world.join(', ')}</td>
            </tr>
          )}
          {category && (
            <tr>
              <th>分類</th>
              <td>
                {category.map(({ name, content }) => (
                  <p key={`${name}-${content ?? ''}`}>
                    {content ? `${name}: ${content}` : `${name}`}
                  </p>
                ))}
              </td>
            </tr>
          )}
          {moyune && (
            <tr>
              <th>モユネ分類</th>
              <td>{moyune.join('/')}</td>
            </tr>
          )}
          {clav3 && (
            <tr>
              <th>CLA v3</th>
              <td>
                {clav3.dialect}_{clav3.language}_{clav3.family}_{clav3.creator}
              </td>
            </tr>
          )}
          {part && (
            <tr>
              <th>part</th>
              <td>{part}</td>
            </tr>
          )}
          {example && (
            <tr>
              <th>例文</th>
              <td>
                {example.map((ex) => (
                  <p key={ex}>{ex}</p>
                ))}
              </td>
            </tr>
          )}
          {script && (
            <tr>
              <th>表記</th>
              <td>
                {script.map((ex) => (
                  <p key={ex}>{ex}</p>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
