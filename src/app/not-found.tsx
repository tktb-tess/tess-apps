import { Metadata } from 'next';
import Link from 'next/link';

const ogDesc = 'お探しのページが見つかりませんでした。移動または削除された可能性があります。';
const ogTitle = '404 Not Found';

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    description: ogDesc,
    url: 'https://apps.tktb-tess.dev',
    siteName: 'τὰ συστήματα',
    images: '/link-card.png'
  },
}

const NotFound = () => {
  return (
    <div className='flex flex-col gap-5 justify-center items-center w-full *:max-w-full min-h-screen'>
      <h2 className='font-extralight text-5xl xl:text-6xl'>Hoppla!</h2>
      <h2>404 Not Found</h2>
      <p>
        お探しのページは見つかりませんでした。移動または削除された可能性があります。
      </p>
      <Link href='/' className='block btn-1'>トップに戻る</Link>
    </div>
  );
};

export default NotFound;
