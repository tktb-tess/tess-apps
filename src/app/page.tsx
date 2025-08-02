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
    <div className="grid place-content-center h-screen">
      <ul>
        <li><Link href='/conlang-gacha'>Conlang Gacha</Link></li>
      </ul>
    </div>
  );
};

export default Home;
