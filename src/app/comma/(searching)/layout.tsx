import CommaSearchForm from './comma-search-form';
import Link from 'next/link';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1>コンマ検索</h1>
      <Link href='/'>戻る</Link>
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
