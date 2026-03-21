import CommaSearchForm from './CommaSearchForm';
import style from './layout.module.css';
import BackBtn from '@/lib/components/BackBtn';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1>コンマ検索</h1>
      <div className={style.backBtn}>
        <BackBtn />
      </div>
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
