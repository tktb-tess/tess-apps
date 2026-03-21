'use client';
import style from './BackBtn.module.css';

const BackBtn = () => {
  return (
    <button
      className={style.backBtn}
      onClick={(ev) => {
        ev.preventDefault();
        history.back();
      }}
    >
      戻る
    </button>
  );
};

export default BackBtn;
