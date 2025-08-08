import TessIcon from '@/lib/components/tessIcon';
import { Metadata } from 'next';
import Link from 'next/link';

const ogDesc = 'お探しのページは見つかりませんでした';
const ogTitle = '404 Not Found';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: '/',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: '/link-card.png',
  },
  twitter: {
    card: 'summary',
  },
};

export default function NotFound() {
  return (
    <main className='flex flex-col gap-5 justify-center items-center w-full *:max-w-full min-h-screen'>
      <div className='animate-[up-down_1s_cubic-bezier(.4,0,.6,1)_infinite_alternate]'>
        <TessIcon className='block size-40 fill-white animate-[spin_30s_linear_infinite]' />
      </div>
      <h2 className='font-extralight text-5xl xl:text-6xl'>Hoppla!</h2>
      <p>
        お探しのページは見つかりませんでした。移動または削除された可能性があります。
      </p>
      <Link href='/' className='block btn-1'>
        トップに戻る
      </Link>
    </main>
  );
}
