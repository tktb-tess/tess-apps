'use client';
import Form from 'next/form';
import SearchBtn from '@/lib/components/search-btn';
import {
  commaQueryAtom,
  commaQuery2Atom,
  commaCorrespAtom,
  commaKindAtom,
} from '@/lib/atoms';
import { useAtom } from 'jotai';
import { ChangeEventHandler } from 'react';
import { isCorre, isKind } from '@/lib/mod/decl';

const label = {
  name: '名前',
  monzo: 'モンゾ',
  cent: ['下限', '上限'],
  person: '命名者',
} as const;

export default function CommaSearchForm() {
  const [query, setQuery] = useAtom(commaQueryAtom);
  const [query2, setQuery2] = useAtom(commaQuery2Atom);
  const [corre, setCorre] = useAtom(commaCorrespAtom);
  const [kind, setKind] = useAtom(commaKindAtom);

  const handleCorre: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { value } = target;
    setCorre(() => (isCorre(value) ? value : 'forward'));
  };
  const handleKind: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { value } = target;
    setKind(() => (isKind(value) ? value : 'name'));
  };

  return (
    <>
      <Form
        action='/comma/search'
        className='flex flex-col items-stretch md:items-center max-w-full gap-5'
      >
        {kind === 'cent' ? (
          <div className='flex *:min-w-0 justify-center gap-2'>
            <span className='flex gap-1 *:min-w-0 flex-[0_1_45%]'>
              <label htmlFor='q-lower' className='text-nowrap'>
                {label[kind][0]}
              </label>
              <input
                name='query'
                type='text'
                value={query}
                id='q-lower'
                onChange={(e) => setQuery(() => e.target.value)}
                className='flex-[1_1_0]'
              />
            </span>
            <span className='flex gap-1 *:min-w-0 flex-[0_1_45%]'>
              <label htmlFor='q-higher' className='text-nowrap'>
                {label[kind][1]}
              </label>
              <input
                name='query2'
                type='text'
                value={query2}
                id='q-higher'
                onChange={(e) => setQuery2(() => e.target.value)}
                className='flex-[1_1_0]'
              />
            </span>
          </div>
        ) : (
          <div className='flex justify-center gap-1 *:min-w-0'>
            <label htmlFor='query' className='text-nowrap'>
              {label[kind]}
            </label>
            <input
              name='query'
              type='text'
              value={query}
              id='query'
              onChange={(e) => setQuery(() => e.target.value)}
              className='flex-[1_1_0]'
            />
          </div>
        )}

        {(kind === 'name' || kind === 'person') && (
          <div className='flex justify-center gap-4'>
            <span>
              <input
                type='radio'
                name='corre'
                value='forward'
                id='btn-1'
                checked={corre === 'forward'}
                onChange={handleCorre}
              />
              <label htmlFor='btn-1'>前方</label>
            </span>
            <span>
              <input
                type='radio'
                name='corre'
                value='backward'
                id='btn-2'
                checked={corre === 'backward'}
                onChange={handleCorre}
              />
              <label htmlFor='btn-2'>後方</label>
            </span>
            <span>
              <input
                type='radio'
                name='corre'
                value='partial'
                id='btn-3'
                checked={corre === 'partial'}
                onChange={handleCorre}
              />
              <label htmlFor='btn-3'>部分</label>
            </span>
            <span>
              <input
                type='radio'
                name='corre'
                value='exact'
                id='btn-4'
                checked={corre === 'exact'}
                onChange={handleCorre}
              />
              <label htmlFor='btn-4'>完全</label>
            </span>
          </div>
        )}
        <div className='flex justify-center gap-4'>
          <span>
            <input
              type='radio'
              name='kind'
              id='btn-5'
              value='name'
              checked={kind === 'name'}
              onChange={handleKind}
            />
            <label htmlFor='btn-5'>名前</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id='btn-6'
              value='monzo'
              checked={kind === 'monzo'}
              onChange={handleKind}
            />
            <label htmlFor='btn-6'>モンゾ</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id='btn-7'
              value='cent'
              checked={kind === 'cent'}
              onChange={handleKind}
            />
            <label htmlFor='btn-7'>セント</label>
          </span>
          <span>
            <input
              type='radio'
              name='kind'
              id='btn-8'
              value='person'
              checked={kind === 'person'}
              onChange={handleKind}
            />
            <label htmlFor='btn-8'>命名者</label>
          </span>
        </div>
        <SearchBtn className='self-center' />
      </Form>
    </>
  );
}
