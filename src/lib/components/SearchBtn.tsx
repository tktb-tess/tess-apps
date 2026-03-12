'use client';
import { useFormStatus } from 'react-dom';
import style from './SearchBtn.module.css';

const SearchBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button className={style.searchBtn} type='submit' disabled={pending}>
      {pending ? '検索中……' : '検索'}
    </button>
  );
};

export default SearchBtn;
