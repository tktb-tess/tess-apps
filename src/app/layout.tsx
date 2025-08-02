import { Metadata, Viewport } from 'next';
import './globals.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

const ogTitle = 'τά συστήματα';

export const viewport: Viewport = {
  themeColor: 'black',
}

export const metadata: Metadata = {
  title: { default: ogTitle, template: `%s - ${ogTitle}` },
  metadataBase: new URL(`https://apps.tktb-tess.dev`),
  openGraph: {
    title: { default: ogTitle, template: `%s - ${ogTitle}` },
    url: 'https://apps.tktb-tess.dev',
    siteName: ogTitle,
  },
}

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
