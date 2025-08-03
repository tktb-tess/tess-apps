import { Metadata, Viewport } from 'next';
import './globals.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

export const viewport: Viewport = {
  themeColor: 'black',
}

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_SITE_NAME!, template: `%s - ${process.env.NEXT_PUBLIC_SITE_NAME!}` },
  metadataBase: new URL(`https://apps.tktb-tess.dev`),
  openGraph: {
    title: { default: process.env.NEXT_PUBLIC_SITE_NAME!, template: `%s - ${process.env.NEXT_PUBLIC_SITE_NAME!}` },
  },
}

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang='ja'>
      <body>
        <div className='px-2 w-full min-h-screen max-w-384 mx-auto flex flex-col gap-2'>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
