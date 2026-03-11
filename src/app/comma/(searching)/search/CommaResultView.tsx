import Link from 'next/link';
import type { CommaData } from './types';
import style from './CommaResultView.module.css';

interface Props {
  commaData: readonly CommaData[];
}

const CommaResultView = ({ commaData }: Props) => {
  return (
    <>
      <h2 className={style.title}>– 検索結果 –</h2>
      {commaData.length > 0 ? (
        <table className={style.commaTable}>
          <thead>
            <tr>
              <th>名前</th>
              <th>モンゾ または 比率</th>
              <th>セント</th>
            </tr>
          </thead>
          <tbody>
            {commaData.map((res) => {
              const { id, names, type, centsStr } = res;

              return (
                <tr key={id}>
                  <td>
                    <Link href={`/comma/detail/${id}`}>
                      {names.map((n, i) => (
                        <p key={`${id}-${i}`}>{n}</p>
                      ))}
                    </Link>
                  </td>
                  <td>
                    {(() => {
                      if (type === 'rational') {
                        const { monzoStr } = res;
                        return (
                          <>
                            {monzoStr.basis && <p>{monzoStr.basis}</p>}
                            <p>{monzoStr.monzo}</p>
                          </>
                        );
                      } else {
                        return res.ratio;
                      }
                    })()}
                  </td>
                  <td>
                    {(() => {
                      if (typeof centsStr === 'string') {
                        return centsStr + ' ¢';
                      }
                      const [num, exp] = centsStr;
                      return (
                        <>
                          {num} × 10<sup>{exp}</sup> ¢
                        </>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className='h-20'>
          <p className='text-center'>検索結果がありません。</p>
        </div>
      )}
    </>
  );
};

export default CommaResultView;
