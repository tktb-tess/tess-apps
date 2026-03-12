import ExtLink from '@/lib/components/extLink';
import style from './CommaDetailView.module.css';
import type { CommaDetail } from './types';

interface Props {
  comma: CommaDetail;
}

const CommaDetailView = ({ comma }: Props) => {
  return (
    <table className={style.commaTable}>
      <tbody>
        {comma.map(([k, v]) => {
          if (!v) return null;
          else
            return (
              <tr key={k}>
                <th>{k}</th>

                {(() => {
                  if (k === 'モンゾ') {
                    const [basis, vec] = v;
                    return (
                      <td>
                        {basis && <p>{basis}</p>}
                        <p>{vec}</p>
                      </td>
                    );
                  } else if (
                    k === 'セント' ||
                    k === 'Tenney–Euclideanノルム' ||
                    k === 'Tenney高さ'
                  ) {
                    const unit = k === 'セント' ? ' ¢' : '';
                    if (typeof v === 'string') {
                      return (
                        <td>
                          {v}
                          {unit}
                        </td>
                      );
                    }
                    return (
                      <td>
                        {v[0]} × 10<sup>{v[1]}</sup>
                        {unit}
                      </td>
                    );
                  } else if (k === 'Xenharmonic wikiへのリンク') {
                    return (
                      <td>
                        <ExtLink href={v} className='break-all'>
                          {v}
                        </ExtLink>
                      </td>
                    );
                  } else if (k === '緩和する10000以下の平均律') {
                    return (
                      <td>
                        <details className={style.edos}>
                          <summary>展開</summary>
                          <div>
                            <p>{v}</p>
                          </div>
                        </details>
                      </td>
                    );
                  } else {
                    return <td>{v}</td>;
                  }
                })()}
              </tr>
            );
        })}
      </tbody>
    </table>
  );
};

export default CommaDetailView;
