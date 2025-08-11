'use client';
import Form from 'next/form';
import SearchBtn from '@/lib/components/search-btn';
import { commaSearchQuery } from '@/lib/atoms';
import { useAtom } from 'jotai';

export default function CommaSearchForm() {
  const [query, setQuery] = useAtom(commaSearchQuery);

  return (
    <>
      <Form
        action='/comma/search'
        className='flex *:min-w-0 justify-center gap-5'
      >
        <input
          name='query'
          type='text'
          value={query}
          onChange={(e) => setQuery(() => e.target.value)}
        />
        <SearchBtn />
      </Form>
    </>
  );
}
