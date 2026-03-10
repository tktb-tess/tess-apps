import style from './LoadingText.module.css';
import LoadingIcon from './LoadingIcon';

interface Props {
  text?: string;
}

// https://icooon-mono.com/12675-%e3%83%ad%e3%83%bc%e3%83%87%e3%82%a3%e3%83%b3%e3%82%b0%e4%b8%ad%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b31/
const LoadingText = ({ text = '読み込み中……' }: Props = {}) => {
  return (
    <p className={style.loadingText}>
      <LoadingIcon />
      <span>{text}</span>
    </p>
  );
};

export default LoadingText;
