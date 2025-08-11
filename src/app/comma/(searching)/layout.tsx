import CommaSearchForm from './comma-search-form';
import Link from 'next/link';

type LayoutProps = {
  readonly children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className='flow-root'>
        <h1 className='font-sans text-center my-15'>コンマ検索</h1>
      </header>
      <main className='flex flex-col gap-10'>
        <Link href='/' className='block self-center btn-1 text-xl'>
          戻る
        </Link>
        <CommaSearchForm />
        {children}
      </main>
    </>
  );
}
