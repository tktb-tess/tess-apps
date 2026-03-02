import { Metadata, Viewport } from 'next';
import { env } from '@/lib/mod/decl';
import './globals.css';
import './layout.css';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: {
    default: env.SITE_NAME,
    template: `%s | ${env.SITE_NAME}`,
  },
  metadataBase: new URL(env.BASE_URL),
  openGraph: {
    title: {
      default: env.SITE_NAME,
      template: `%s | ${env.SITE_NAME}`,
    },
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='ja'>
      <body>
        <header>
          <nav className='__header'>
            <a href='https://tktb-tess.dev' target='_blank'>
              悠久肆方体へ
            </a>
          </nav>
        </header>
        <main>
          <h1></h1>
          {children}
        </main>
        <footer></footer>
      </body>
    </html>
  );
}
