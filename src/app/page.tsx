import { Metadata } from "next";
import Link from "next/link";

const ogTitle = 'τά συστήματα';
const ogDesc = '作ったアプリたち';

export const metadata: Metadata = {
  metadataBase: new URL(`https://apps.tktb-tess.dev`),
  title: ogTitle,
  description: ogDesc,
  openGraph: {
    title: ogTitle,
    description: ogDesc,
    url: 'https://apps.tktb-tess.dev',
    siteName: ogTitle,
  },
};


const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center *:max-w-full min-h-screen">
      <Link href='/conlang-gacha' className="no-underline bg-sky-300 text-black w-100 h-20 grid place-content-center rounded-xl transition-shadow any-hover:glow">
        <p className="text-3xl">人工言語ガチャ</p>
      </Link>
    </div>
  );
};

export default Home;
