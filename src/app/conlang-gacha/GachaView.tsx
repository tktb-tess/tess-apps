import styles from './GachaView.module.css';
import { useId } from 'react';
import ExtLink from '@/lib/components/extLink';
import type { LangDetail } from './types';

interface Props {
  lang: LangDetail;
}

const GachaView = ({ lang }: Props) => {
  const id = useId();

  return (
    <section aria-labelledby={id} className={styles.root}>
      <h2 id={id} className={styles.title}>
        – ガチャ結果 –
      </h2>
      <table className={styles.gachaTable}>
        <tbody>
          {lang.map(([k, v]) => {
            if (!v) return null;
            const key = (() => {
              if (typeof v === 'string') {
                return `${k}-${v}`;
              } else {
                return `${k}-${v.join('-')}`;
              }
            })();
            return (
              <tr key={key}>
                <th>{k}</th>
                {(() => {
                  if (
                    k === '言語名' ||
                    k === '作者' ||
                    k === '年代' ||
                    k === '架空世界' ||
                    k === 'モユネ分類' ||
                    k === 'CLA v3' ||
                    k === 'part'
                  ) {
                    return <td className={styles.centralised}>{v}</td>;
                  } else if (
                    k === '説明' ||
                    k === '例文' ||
                    k === '表記' ||
                    k === '分類'
                  ) {
                    if (v.length > 0) {
                      return (
                        <td>
                          {v.map((par) => (
                            <p
                              key={par}
                              className={
                                k === '表記' || k === '分類'
                                  ? styles.centralised
                                  : undefined
                              }
                            >
                              {par}
                            </p>
                          ))}
                        </td>
                      );
                    } else {
                      return <td className={styles.centralised}>[NO DATA]</td>;
                    }
                  } else if (
                    k === '𝕏 (旧Twitter)' ||
                    k === '辞書' ||
                    k === '文法'
                  ) {
                    return (
                      <td>
                        <ul>
                          {v.map((url) => (
                            <li key={url} className='break-all'>
                              <ExtLink href={url}>{url}</ExtLink>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  } else {
                    return (
                      <td>
                        <ul>
                          {v.map(([url, name]) => (
                            <li
                              key={`${name ?? url}-${url}`}
                              className={name ? undefined : 'break-all'}
                            >
                              <ExtLink href={url}>{name ?? url}</ExtLink>
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  }
                })()}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default GachaView;
