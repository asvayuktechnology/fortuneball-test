'use client';
import React, { ReactElement } from 'react'
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

type Props = {
    name?: string;
    label?: string |ReactElement;
    register?: UseFormRegister<any>;
    validationSchema?: any;
    error?: FieldError;
    value?: string;
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
};
const Checkbox = (props: Props) => {
    const {
        name = '',
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
            <ColumnDiv className='relative mb-4 ' >
                <div className='flex items-center gap-4'>
                    <input
                        id={name}
                        type='checkbox'
                        value={inputValue}
                        {...register(name, { ...validationSchema })}
                    />
                    <label htmlFor="terms" className="text-sm text-white">
                        {label}
                    </label>
                </div>
                <ErrorLabel fieldError={error} />
            </ColumnDiv>
        );
    } else {
        return (
            <ColumnDiv>
                <ColumnDiv className='relative mb-4 ' >
                    <div className='flex items-center gap-4'>
                        <input
                            id={name}
                            type='checkbox'
                            value={inputValue}
                            onChange={onChange}
                        />
                        <label htmlFor="terms" className="text-sm text-white">
                            {label}
                        </label>
                    </div>
                    <ErrorLabel fieldError={error} />
                </ColumnDiv>
            </ColumnDiv>
        );
    }
};

export default Checkbox;
