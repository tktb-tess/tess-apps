'use client';
import style from './CommaSearchForm.module.css';
import { useAtom } from 'jotai';
import { ChangeEventHandler, InputEventHandler, useId } from 'react';
import { CommaKind, Match, isMatch, isKind } from '@/lib/mod/decl';
import * as Atoms from '@/lib/atoms';
import SearchBtn from '@/lib/components/SearchBtn';
import Form from 'next/form';

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

interface BaseInputProps {
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface MatchInputProps extends BaseInputProps {
  name: 'match';
  value: Match;
  checkedValue: Match;
}

interface KindInputProps extends BaseInputProps {
  name: 'kind';
  value: CommaKind;
  checkedValue: CommaKind;
}

type RadioInputProps = MatchInputProps | KindInputProps;

const RadioInput = ({
  label,
  name,
  value,
  checkedValue,
  onChange,
}: RadioInputProps) => {
  const id = useId();
  return (
    <div className={style.radioInput}>
      <input
        type='radio'
        name={name}
        value={value}
        id={id}
        checked={checkedValue === value}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

const CommaSearchForm = () => {
  const [query, setQuery] = useAtom(Atoms.commaQueryAtom);
  const [query2, setQuery2] = useAtom(Atoms.commaQuery2Atom);
  const [match, setMatch] = useAtom(Atoms.commaMatchAtom);
  const [kind, setKind] = useAtom(Atoms.commaKindAtom);

  const handleMatch: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.currentTarget.value;
    setMatch(isMatch(value) ? value : 'forward');
  };

  const handleKind: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.currentTarget.value;
    setKind(isKind(value) ? value : 'name');
  };

  return (
    <>
      <Form action='/comma/search' className={style.searchForm}>
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
        {(kind === 'name' || kind === 'person') && (
          <>
            <p>一致</p>
            <div className={style.radioInputGroup}>
              <RadioInput
                label='前方'
                name='match'
                value='forward'
                checkedValue={match}
                onChange={handleMatch}
              />
              <RadioInput
                label='後方'
                name='match'
                value='backward'
                checkedValue={match}
                onChange={handleMatch}
              />
              <RadioInput
                label='部分'
                name='match'
                value='partial'
                checkedValue={match}
                onChange={handleMatch}
              />
              <RadioInput
                label='完全'
                name='match'
                value='exact'
                checkedValue={match}
                onChange={handleMatch}
              />
            </div>
          </>
        )}
        <p>モード</p>
        <div className={style.radioInputGroup}>
          <RadioInput
            label='名前'
            name='kind'
            value='name'
            checkedValue={kind}
            onChange={handleKind}
          />
          <RadioInput
            label='モンゾ'
            name='kind'
            value='monzo'
            checkedValue={kind}
            onChange={handleKind}
          />
          <RadioInput
            label='セント'
            name='kind'
            value='cent'
            checkedValue={kind}
            onChange={handleKind}
          />
          <RadioInput
            label='命名者'
            name='kind'
            value='person'
            checkedValue={kind}
            onChange={handleKind}
          />
        </div>
        <div className={style.submit}>
          <SearchBtn />
        </div>
      </Form>
    </>
  );
};

export default CommaSearchForm;
