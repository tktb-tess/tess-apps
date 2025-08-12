'use client';
import Form from 'next/form';
import SearchBtn from '@/lib/components/search-btn';
import {
  commaSearchQuery,
  commaSearchQuery2,
  commaCorresp,
  commaKind,
} from '@/lib/atoms';
import { useAtom } from 'jotai';
import { ChangeEventHandler } from 'react';
import { CommaKind, isCorre, isKind } from '@/lib/mod/decl';

export default function CommaSearchForm() {
  const [query, setQuery] = useAtom(commaSearchQuery);
  const [query2, setQuery2] = useAtom(commaSearchQuery2);
  const [corre, setCorre] = useAtom(commaCorresp);
  const [kind, setKind] = useAtom(commaKind);

  const handleCorre: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { value } = target;
    setCorre(() => (isCorre(value) ? value : 'forward'));
  };
  const handleKind: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { value } = target;
    setKind(() => (isKind(value) ? value : 'name'));
  };

  const label: Record<CommaKind, string> = {
    name: '名前',
    monzo: 'モンゾ',
    cent: 'セント',
    person: '命名者',
  };

  const ids = Array(10)
    .fill(0)
    .map(() => crypto.randomUUID());

  return (
    <>
      <Form
        action='/comma/search'
        className='flex flex-col items-center max-w-full gap-5'
      >
        <div className='flex justify-center gap-2'>
          {kind === 'cent' ? (
            <>
              <span className='flex'>
                <label htmlFor={ids[8]}>下限</label>
                <input
                  name='query'
                  type='text'
                  value={query}
                  id={ids[8]}
                  onChange={(e) => setQuery(() => e.target.value)}
                  className='flex-grow-1'
                />
              </span>
              <span className='flex'>
                <label htmlFor={ids[8]}>上限</label>
                <input
                  name='query2'
                  type='text'
                  value={query2}
                  id={ids[8]}
                  onChange={(e) => setQuery2(() => e.target.value)}
                  className='flex-grow-1'
                />
              </span>
            </>
          ) : (
            <>
              <label htmlFor={ids[8]}>{label[kind]}</label>
              <input
                name='query'
                type='text'
                value={query}
                id={ids[8]}
                onChange={(e) => setQuery(() => e.target.value)}
                className='flex-grow-1'
              />
            </>
          )}
        </div>
        <div className='flex justify-center gap-4'>
          <span>
            <input
              type='radio'
              name='corre'
              value='forward'
              id={ids[0]}
              checked={corre === 'forward'}
              onChange={handleCorre}
            />
            <label htmlFor={ids[0]}>前方</label>
          </span>
          <span>
            <input
              type='radio'
              name='corre'
              value='backward'
              id={ids[1]}
              checked={corre === 'backward'}
              onChange={handleCorre}
            />
            <label htmlFor={ids[1]}>後方</label>
          </span>
          <span>
            <input
              type='radio'
              name='corre'
              value='partial'
              id={ids[2]}
              checked={corre === 'partial'}
              onChange={handleCorre}
            />
            <label htmlFor={ids[2]}>部分</label>
          </span>
          <span>
            <input
              type='radio'
              name='corre'
              value='exact'
              id={ids[3]}
              checked={corre === 'exact'}
              onChange={handleCorre}
            />
            <label htmlFor={ids[3]}>完全</label>
          </span>
        </div>
        <div className='flex justify-center gap-4'>
          <span>
            <input
              type='radio'
              name='kind'
              id={ids[4]}
              value='name'
              checked={kind === 'name'}
              onChange={handleKind}
            />
            <label htmlFor={ids[4]}>名前</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id={ids[5]}
              value='monzo'
              checked={kind === 'monzo'}
              onChange={handleKind}
            />
            <label htmlFor={ids[5]}>モンゾ</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id={ids[6]}
              value='cent'
              checked={kind === 'cent'}
              onChange={handleKind}
            />
            <label htmlFor={ids[6]}>セント</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id={ids[7]}
              value='person'
              checked={kind === 'person'}
              onChange={handleKind}
            />
            <label htmlFor={ids[7]}>命名者</label>
          </span>
        </div>
        <SearchBtn />
      </Form>
    </>
  );
}
