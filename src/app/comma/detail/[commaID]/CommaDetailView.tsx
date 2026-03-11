import style from './CommaDetailView.module.css';
import type { CommaDetail } from './types';

interface Props {
  comma: CommaDetail;
}

const CommaDetailView = ({ comma }: Props) => {
  return (
    <table className={style.commaTable}>
      <tbody></tbody>
    </table>
  );
};

export default CommaDetailView;
