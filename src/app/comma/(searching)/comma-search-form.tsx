'use client';
import Form from 'next/form';
import { useAtom } from 'jotai';
import { ChangeEventHandler } from 'react';
import SearchBtn from '@/lib/components/search-btn';
import { isCorrespondence, isKind } from '@/lib/mod/decl';
import {
  commaQueryAtom,
  commaQuery2Atom,
  commaCorrespondenceAtom,
  commaKindAtom,
} from '@/lib/atoms';

const label = {
  name: '名前',
  monzo: 'モンゾ',
  cent: ['下限', '上限'],
  person: '命名者',
} as const;

const CommaSearchForm = () => {
  const [query, setQuery] = useAtom(commaQueryAtom);
  const [query2, setQuery2] = useAtom(commaQuery2Atom);
  const [correspondence, setCorrespondence] = useAtom(commaCorrespondenceAtom);
  const [kind, setKind] = useAtom(commaKindAtom);

  const handleCorre: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.target.value;
    setCorrespondence(isCorrespondence(value) ? value : 'forward');
  };

  const handleKind: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.target.value;
    setKind(isKind(value) ? value : 'name');
  };

  return (
    <>
      <Form action='/comma/search'>
        {kind === 'cent' ? (
          <div>
            <label htmlFor='q-lower'>{label[kind][0]}</label>
            <input
              name='query'
              type='text'
              value={query}
              id='q-lower'
              onChange={(e) => setQuery(e.target.value)}
            />

            <label htmlFor='q-higher'>{label[kind][1]}</label>
            <input
              name='query2'
              type='text'
              value={query2}
              id='q-higher'
              onChange={(e) => setQuery2(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label htmlFor='query'>{label[kind]}</label>
            <input
              name='query'
              type='text'
              value={query}
              id='query'
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {(kind === 'name' || kind === 'person') && (
          <div>
            <span>
              <input
                type='radio'
                name='corre'
                value='forward'
                id='btn-1'
                checked={correspondence === 'forward'}
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
                checked={correspondence === 'backward'}
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
                checked={correspondence === 'partial'}
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
                checked={correspondence === 'exact'}
                onChange={handleCorre}
              />
              <label htmlFor='btn-4'>完全</label>
            </span>
          </div>
        )}
        <div>
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
        <SearchBtn />
      </Form>
    </>
  );
};

export default CommaSearchForm;
