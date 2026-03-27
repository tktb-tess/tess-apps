import Link from 'next/link';
import CommaSearchForm from './CommaSearchForm';
import style from './layout.module.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const TopBtn = () => {
  return (
    <div className={style.topBtnWr}>
      <Link className={style.topBtn} href='/'>
        トップへ
      </Link>
    </div>
  );
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1>コンマ検索</h1>
      <TopBtn />
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
