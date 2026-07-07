'use client';
import React from 'react'
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

type Props = {
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema?: any;
  error?: FieldError;
  value?: string;
  className?: string// Add className prop
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
};
const SearchInput = (props: Props) => {
  const {
    type = 'search',
    name = '',
    placeholder,
    label,
    register,
    validationSchema,
    error,
    value,
    onChange

  } = props;
  const [inputValue, setInputValue] = useState(value);
  const hasError = error && error.message;

  if (register) {
    return (
      <ColumnDiv className='relative mb-4' >
        <label className="py-2 text-[11px] absolute -top-[7px] left-4.25 pointer-events-none text-slate-200">{label}</label>
        <input
          id={name}
          type={type}
          value={inputValue}
          {...register(name, { ...validationSchema })}
          // placeholder={placeholder}
          className={`h-16 w-full rounded-[10px] text-white border-[#9a4cee]  border-[1px] p-4 focus:outline-0 focus:border-[#29292f] active:border-[#8D8D94] ${hasError ? 'border-red-500' : 'border-[#29292f]'
            }`}
        />
        <ErrorLabel fieldError={error} />
      </ColumnDiv>
    );
  } else {
    return (
      <ColumnDiv>
        <label className="py-1 text-slate-200 text-sm">{label}</label>
        <div className='relative'>
          <input
            id={name}
            type={type}
            value={inputValue}
            placeholder={placeholder}
            className={'h-10  border-[#9a4cee]  rounded-md w-full border-1 p-4  pl-2 mb-3 text-slate-200 focus:outline-none focus:border-[#29292f]'}
            onChange={onChange}
          />
        </div>

        <ErrorLabel fieldError={error} />
      </ColumnDiv>
    );
  }
};

export default SearchInput;
