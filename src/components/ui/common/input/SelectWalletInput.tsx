'use client';

import { Controller, Control, FieldError, UseFormRegister } from 'react-hook-form';
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';

type Option = {
  label: string;
  value: string | number;
  amount: string | number;
};

type SelectWalletInputProps = {
  name: string;
  label: string;
  options: Option[];
  register?: UseFormRegister<any>;
  control?: Control<any>;
  validationSchema?: any;
  error?: FieldError;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
};

const SelectWalletInput = ({
  name,
  label,
  options,
  register,
  control,
  validationSchema,
  error,
  defaultValue = '',
  placeholder = '-- Select --',
  className = '',
}: SelectWalletInputProps) => {
  const hasError = error && error.message;

  return (
    <ColumnDiv className={`relative mb-4 ${className}`}>
      <label className="pt-2 text-slate-200 text-[11px] pointer-events-none">
        {label}
      </label>

      {control ? (
        <Controller
          name={name}
          control={control as any}
          rules={validationSchema}
          defaultValue={defaultValue}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              className={`h-14 w-full text-slate-200 rounded-[8px] border-[1px] bg-transparent p-4 focus:outline-0 focus:border-[#29292f] ${hasError ? 'border-red-500' : 'border-[#3d44c1]'}`}
            >
              <option value="">{placeholder}</option>
              {options.map((opt) => (
                <option className="bg-[#14151a] text-white" key={opt.value} value={opt.value}>
                  {opt.label} ({opt.amount})
                </option>
              ))}
            </select>
          )}
        />
      ) : (
        <select
          id={name}
          {...(register && register(name, validationSchema))}
          defaultValue={defaultValue}
          className={`h-12 w-full text-slate-200 border border-[#9a4cee] rounded-[12px] border-[1px] bg-transparent p-[12px] focus:outline-0 focus:border-[#29292f] ${hasError ? 'border-red-500' : 'border-[#000000]'}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option className="bg-[#000000] text-white " key={opt.value} value={opt.value}>
              {opt.label} ({opt.amount})
            </option>
          ))}
        </select>
      )}

      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  );
};

export default SelectWalletInput;
