import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

type LayoutProps = {
  readonly children: React.ReactNode;
};

export const viewport: Viewport = {
  themeColor: 'black',
};

const interFont = localFont({
  src: [
    {
      path: './fonts/Inter/InterVariable.woff2',
      style: 'normal',
    },
    {
      path: './fonts/Inter/InterVariable-Italic.woff2',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
});

const charisFont = localFont({
  src: [
    {
      path: './fonts/Charis/Charis-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Charis/Charis-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Charis/Charis-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Charis/Charis-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Charis/Charis-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Charis/Charis-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/Charis/Charis-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/Charis/Charis-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-charis',
});

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
      <body className={`${interFont.variable} ${charisFont.variable}`}>
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
