import style from './page.module.css';
import { notFound } from 'next/navigation';
import { env } from '@/lib/mod/decl';
import CommaDetailView from './CommaDetailView';
import { formatData, fetchCommas } from './funcs';
import BackBtn from '@/lib/components/BackBtn';
import LoadingText from '@/lib/components/LoadingText';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ commaID: string }>;
}

export const generateMetadata = async ({ params }: Props) => {
  const { commaID } = await params;
  const commaData = await fetchCommas(commaID);
  const title = commaData?.name.at(0) ?? '[NO TITLE]';
  const description = commaData?.name.concat(commaData.colorName).join(', ');

  return {
    title,
    description,
    openGraph: {
      description,
      url: `/comma/detail/${commaID}`,
      siteName: env.SITE_NAME,
      images: '/link-card.png',
    },
    twitter: {
      card: 'summary',
    },
  };
};

const CommaDetail = async ({ params }: Props) => {
  const { commaID } = await params;
  const commaData = await fetchCommas(commaID);

  if (!commaData) {
    notFound();
  }

  const title = commaData.name[0] || '[NO TITLE]';
  const formatted = formatData(commaData);

  return (
    <>
      <h1 className={style.commaTitle}>{title}</h1>
      <div className={style.backBtn}>
        <BackBtn />
      </div>
      <CommaDetailView comma={formatted} />
    </>
  );
};

const Loading = () => {
  return (
    <div className='grid place-items-center-safe min-h-lvh'>
      <LoadingText />
    </div>
  );
};

const Page = async ({ params }: Props) => {
  return (
    <Suspense fallback={<Loading />}>
      <CommaDetail params={params} />
    </Suspense>
  );
};

export default Page;
