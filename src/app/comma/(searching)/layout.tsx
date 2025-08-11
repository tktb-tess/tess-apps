import SearchBtn from '@/lib/components/search-btn';
import Form from 'next/form';
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
        <Form
          action='/comma/search'
          className='flex *:min-w-0 justify-center gap-5'
        >
          <input name='query' type='text' />
          <SearchBtn />
        </Form>
        {children}
      </main>
    </>
  );
}
