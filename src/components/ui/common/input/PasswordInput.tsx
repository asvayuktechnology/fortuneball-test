'use client';
import React from 'react'
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { FaEyeSlash, FaEye } from 'react-icons/fa'
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
const TextInput = (props: Props) => {
    const {
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
    const pathname = usePathname();
    const isUserLogin = ['/login', '/forget', '/register'].some(path => pathname.includes(path));
    const [type, setType] = useState<'password' | 'text'>('password');
    const chnageType = () => setType(type == 'password' ? 'text' : 'password')
    if (register) {
        return (
            <ColumnDiv className='relative mb-4' >
                <div className='flex items-center w-full justify-center'>
                    <input
                        placeholder={placeholder}
                        id={name}
                        type={type}
                        value={inputValue}
                        {...register(name, { ...validationSchema })}
                        className={`peer h-12 w-full rounded-[10px] text-[11px] bg-[#11053e] text-slate-200 border-[1px] px-3  focus:outline-0 focus:border-[#d8d8d8] active:border-[#fff]
          ${isUserLogin ? 'text-white' : ''} ${hasError ? 'border-red-500' : 'border-[#9a4cee]'}`}
                    />
                    <span className='absolute top-1/2 right-3 -translate-y-1/2  cursor-pointer' onClick={chnageType}>
                        {type === 'password' ? <FaEye color='white' /> : <FaEyeSlash color='white' />}
                    </span>
                </div>
                {/* <label htmlFor={name} className={`peer-focus:opacity-0 transition-opacity duration-200  py-2 text-[11px] absolute -top-[7px] left-4.25 pointer-events-none text-slate-200 ${isUserLogin ? 'text-white ' : ''}`}>{label}</label> */}
                <ErrorLabel fieldError={error} />
            </ColumnDiv>
        );
    } else {
        return (
            <ColumnDiv>
                <div className='relative'>
                    {/* <label className="py-1 text-white text-sm text-[11px] absolute -top-[0px] left-4.25 pointer-events-none">{label}</label> */}
                    <div className='flex items-center w-full justify-center'>
                        <input
                            placeholder={placeholder}
                            id={name}
                            type={type}
                            value={inputValue}
                            className={`peer h-12 w-full rounded-[10px] text-[11px] bg-[#11053e] text-slate-200 border-[1px] px-3  focus:outline-0 focus:border-[#d8d8d8] active:border-[#fff]
          ${isUserLogin ? 'text-white' : ''} ${hasError ? 'border-red-500' : 'border-[#9a4cee]'}`}
                            onChange={onChange}
                        />
                        <span className='absolute top-1/2 -left-8  cursor-pointer' onClick={chnageType}>
                            {type === 'password' ? <FaEye color='white' /> : <FaEyeSlash color='white' />}
                        </span>
                    </div>
                </div>

                <ErrorLabel fieldError={error} />
            </ColumnDiv>
        );
    }
};

export default TextInput;
