import './globals.css';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang='ja'>
      <body>
        <div className='px-2 w-full max-w-384 mx-auto flex flex-col gap-2'>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
