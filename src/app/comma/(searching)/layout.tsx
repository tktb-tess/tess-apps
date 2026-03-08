import CommaSearchForm from './comma-search-form';
import Link from 'next/link';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1 className='font-sans text-center my-15'>コンマ検索</h1>
      <Link href='/' className='block self-center btn-theme-1 text-xl'>
        戻る
      </Link>
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
