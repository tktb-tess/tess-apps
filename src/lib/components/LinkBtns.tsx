import Link from 'next/link';
import style from './LinkBtns.module.css';
import type { ReadonlyDeep } from 'type-fest';

interface Props {
  data: ReadonlyDeep<
    {
      url: string;
      text: string;
    }[]
  >;
}

const LinkBtns = ({ data }: Props) => {
  return (
    <nav aria-label='各ページリンク' className={style.linkBtns}>
      <ul>
        {data.map(({ url, text }) => (
          <li key={`${url}-${text}`}>
            <Link className={style.linkItem} href={url}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LinkBtns;
