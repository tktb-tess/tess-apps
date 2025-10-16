'use client';

import { useFormStatus } from 'react-dom';

type Props = {
  className?: string;
};

export default function SearchBtn({ className: cName }: Props) {
  const { pending } = useFormStatus();

  return (
    <button className={`btn-1 ${cName}`} type='submit' disabled={pending}>
      {pending ? '検索中……' : '検索'}
    </button>
  );
}
