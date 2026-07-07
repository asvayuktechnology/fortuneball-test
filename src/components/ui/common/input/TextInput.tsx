'use client';
import React, { useEffect } from 'react'
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { usePathname } from 'next/navigation';

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
  authinput?: boolean;
  readOnly?: boolean;
  icon?:boolean;
};
const TextInput = (props: Props) => {
  const {
    type = 'text',
    name = '',
    placeholder,
    label,
    register,
    validationSchema,
    error,
    value,
    onChange,
    authinput,
    readOnly,
    icon=false,
  } = props;
  const [inputValue, setInputValue] = useState(value);

  // Handle value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };
useEffect(() => {
  setInputValue(value ?? '');
}, [value]);

  const hasError = error && error.message;

  const pathname = usePathname();
  const isUserLogin = ['/login', '/forget', '/register'].some(path => pathname.includes(path));

  if (register) {
    return (
      <ColumnDiv className='relative mb-4'>
        {/* {authinput ? (
          <label
            htmlFor={name}
            className={` left-3 authlabel text-[11px] text-slate-200  pointer-events-none 
              ${inputValue ? 'opacity-0' : 'opacity-100  top-[3px] left-3 authlabel'} 
              ${isUserLogin ? 'text-white' : ''}`}
          >
            {label}
          </label>
        ) : (<label htmlFor={name} className={` ${authinput ? "absolute -top-[5px] left-3 authlabel" : ""}  peer-focus:opacity-0 focus:text-slate-800 transition-opacity duration-200 pt-2 text-[11px]  pointer-events-none text-slate-200 ${isUserLogin ? 'text-white ' : ''}`}>{label}</label>)} */}
    
      <input
        id={name}
        type={type}
        {...register(name, validationSchema)} // Spread register directly
        readOnly={readOnly}
        placeholder={placeholder}
        className={`peer h-12 w-full rounded-[10px] text-[11px] bg-[#11053e] text-slate-200 border-[1px] ${icon ? "pl-12" : "pl-3"} focus:outline-0 focus:border-[#d8d8d8] active:border-[#fff]
          ${isUserLogin ? 'text-white' : ''} ${hasError ? 'border-red-500' : 'border-[#9a4cee]'}`}
      />
        <ErrorLabel fieldError={error} />
      </ColumnDiv>
    );
  } else {
    return (
       <ColumnDiv>
    <div className='relative'>
      {/* {authinput ? (
        <label
          htmlFor={name}
          className={`absolute left-3 text-[11px] text-white pointer-events-none
            ${inputValue ? 'opacity-0' : 'opacity-100 top-[3px]'}`}
        >
          {label}
        </label>
      ) : (
        <label
          htmlFor={name}
          className="py-1 text-white text-[11px] absolute -top-[0px] left-3 pointer-events-none"
        >
          {label}
        </label>
      )} */}

      <input
        id={name}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        className="h-12 border-[#37373e] focus:outline-none focus:shadow-[0_0px_0px_0.25rem_rgba(13,110,253,0.25)] rounded-md w-full border-1 p-4 pl-2 text-white"
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange?.(e);
        }}
      />
    </div>

    <ErrorLabel fieldError={error} />
  </ColumnDiv>
    );
  }
};

export default TextInput;
