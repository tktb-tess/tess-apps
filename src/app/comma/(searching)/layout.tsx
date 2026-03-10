import CommaSearchForm from './commaSearchForm';
import Link from 'next/link';
import style from './layout.module.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1>コンマ検索</h1>
      <div className={style.backBtn}>
        <Link className='btn-theme-1' href='/'>
          戻る
        </Link>
      </div>
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
