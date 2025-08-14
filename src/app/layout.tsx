import { Metadata, Viewport } from 'next';
import './globals.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME!,
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    title: {
      default: process.env.NEXT_PUBLIC_SITE_NAME!,
      template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    },
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='ja'>
      <body>
        <nav className='flex border-b border-white/60 justify-center'>
          <a
            href='https://tktb-tess.dev'
            target='_blank'
            rel='noopener'
            className='text-white h-12 flex items-center hover:bg-white hover:text-black no-underline transition-colors px-1'
          >
            悠久肆方体へ
          </a>
        </nav>
        <div className='px-2 w-full min-h-screen max-w-384 mx-auto flex flex-col gap-2'>
          {children}
        </div>
      </body>
    </html>
  );
}
