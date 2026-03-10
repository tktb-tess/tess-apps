'use client';
import style from './commaSearchForm.module.css';
import Form from 'next/form';
import { useAtom } from 'jotai';
import { InputEventHandler, useId } from 'react';
import SearchBtn from '@/lib/components/search-btn';
import { CommaKind, Match, isMatch as isMatch, isKind } from '@/lib/mod/decl';
import {
  commaQueryAtom,
  commaQuery2Atom,
  commaMatchAtom,
  commaKindAtom,
} from '@/lib/atoms';

const label = {
  name: ['名前'],
  monzo: ['モンゾ'],
  cent: ['下限', '上限'],
  person: ['命名者'],
} as const satisfies Record<CommaKind, string[]>;

interface QueryInputProps {
  label: string;
  name: string;
  value: string;
  onInput: InputEventHandler<HTMLInputElement>;
}

const QueryInput = ({ label, name, value, onInput }: QueryInputProps) => {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type='text' name={name} value={value} onInput={onInput} />
    </>
  );
};

interface MatchInputProps {
  label: string;
  name: 'corre';
  value: Match;
  checkedValue: Match;
  onInput: InputEventHandler<HTMLInputElement>;
}

interface KindInputProps {
  label: string;
  name: 'kind';
  value: CommaKind;
  checkedValue: CommaKind;
  onInput: InputEventHandler<HTMLInputElement>;
}

type RadioInputProps = MatchInputProps | KindInputProps;

const RadioInput = ({
  label,
  name,
  value,
  checkedValue,
  onInput,
}: RadioInputProps) => {
  const id = useId();
  return (
    <div className={style.radioInput}>
      <input
        type='radio'
        name={name}
        value={value}
        id={id}
        defaultChecked={checkedValue === value}
        onInput={onInput}
      />
      <label htmlFor={id} className='btn-theme-1'>
        {label}
      </label>
    </div>
  );
};

const CommaSearchForm = () => {
  const [query, setQuery] = useAtom(commaQueryAtom);
  const [query2, setQuery2] = useAtom(commaQuery2Atom);
  const [match, setMatch] = useAtom(commaMatchAtom);
  const [kind, setKind] = useAtom(commaKindAtom);

  const handleMatch: InputEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.currentTarget.value;
    setMatch(isMatch(value) ? value : 'forward');
  };

  const handleKind: InputEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.currentTarget.value;
    setKind(isKind(value) ? value : 'name');
  };

  return (
    <>
      <Form action='/comma/search' className={style.searchForm}>
        <div className={style.searchQueries}>
          <QueryInput
            label={label[kind][0]}
            name='query'
            value={query}
            onInput={(ev) => setQuery(ev.currentTarget.value)}
          />
          {kind === 'cent' && (
            <>
              <QueryInput
                label={label[kind][1]}
                name='query2'
                value={query2}
                onInput={(ev) => setQuery2(ev.currentTarget.value)}
              />
            </>
          )}
        </div>
        {(kind === 'name' || kind === 'person') && (
          <div className={style.radioInputGroup}>
            <RadioInput
              label='前方'
              name='corre'
              value='forward'
              checkedValue={match}
              onInput={handleMatch}
            />
            <RadioInput
              label='後方'
              name='corre'
              value='backward'
              checkedValue={match}
              onInput={handleMatch}
            />
            <RadioInput
              label='部分'
              name='corre'
              value='partial'
              checkedValue={match}
              onInput={handleMatch}
            />
            <RadioInput
              label='完全'
              name='corre'
              value='exact'
              checkedValue={match}
              onInput={handleMatch}
            />
          </div>
        )}
        <div className={style.radioInputGroup}>
          <RadioInput
            label='名前'
            name='kind'
            value='name'
            checkedValue={kind}
            onInput={handleKind}
          />
          <RadioInput
            label='モンゾ'
            name='kind'
            value='monzo'
            checkedValue={kind}
            onInput={handleKind}
          />
          <RadioInput
            label='セント'
            name='kind'
            value='cent'
            checkedValue={kind}
            onInput={handleKind}
          />
          <RadioInput
            label='命名者'
            name='kind'
            value='person'
            checkedValue={kind}
            onInput={handleKind}
          />
        </div>
        <SearchBtn />
      </Form>
    </>
  );
};

export default CommaSearchForm;
