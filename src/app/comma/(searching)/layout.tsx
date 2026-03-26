import CommaSearchForm from './CommaSearchForm';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return (
    <>
      <h1>コンマ検索</h1>
      <CommaSearchForm />
      {children}
    </>
  );
};

export default Layout;
