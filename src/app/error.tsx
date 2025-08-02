'use client';
import { Metadata } from 'next';
import { useEffect } from 'react';

const ogDesc = 'Something went wrong';
const ogTitle = '500 Internal Server Error';

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

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col gap-5 justify-center items-center min-h-screen'>
      <h2 className='font-extralight text-5xl xl:text-6xl'>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className='btn-1'
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
