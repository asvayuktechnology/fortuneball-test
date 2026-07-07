'use client';

// import { useEffect } from 'react';
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';
import { FieldError, UseFormRegister, Control } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type SelectInputProps = {
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
  onChange?: (value: string) => void
};

const SelectInput = ({
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
  onChange
}: SelectInputProps) => {
  const hasError = error && error.message;

  // If using control (recommended approach)
  // if (control) {
  //   const { field } = useController({
  //     name,
  //     control,
  //     defaultValue: defaultValue || '',
  //   });

  //   return (
  //     <ColumnDiv className={`relative mb-4 ${className}`}>
  //       <label className="py-2 text-[11px] absolute -top-[7px] left-4.25 pointer-events-none">
  //         {label}
  //       </label>
  //       <select
  //         id={name}
  //         {...field}
  //         className={`h-14 w-full rounded-[8px] border-[1px] bg-transparent p-4 focus:outline-0 focus:border-[#29292f] ${
  //           hasError ? 'border-red-500' : 'border-[#3d44c1]'
  //         }`}
  //       >
  //         <option value="">{placeholder}</option>
  //         {options.map((opt) => (
  //           <option key={opt.value} value={opt.value}>
  //             {opt.label}
  //           </option>
  //         ))}
  //       </select>
  //       <ErrorLabel fieldError={error} />
  //     </ColumnDiv>
  //   );
  // }

  // Fallback to register if control is not provided
  if (register) return (
    <ColumnDiv className={`relative mb-4 ${className}`}>
      <label className="pt-2 text-slate-200 text-[11px] font-light  pointer-events-none">
        {label}
      </label>
      <select
        id={name}
        {...(register && register(name, validationSchema))}
        defaultValue={defaultValue}
        className={`h-14 w-full text-slate-200 ]  rounded-[8px] border-[1px]  bg-transparent p-4 focus:outline-0 focus:border-[#9a4cee] ${hasError ? 'border-red-500' : 'border-[#9a4cee]'
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option className='bg-[#29292f] text-slate-200' key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  )
  else (
    <ColumnDiv className={`relative mb-4 ${className}`}>
      <label className="pt-2 text-slate-200 text-[11px] font-light  pointer-events-none">
        {label}
      </label>
      <select
        id={name}
        defaultValue={defaultValue}
        className={`h-14 w-full text-slate-200  rounded-[8px] border-[#9a4cee]  border-[1px] bg-transparent p-4 focus:outline-0 focus:border-[#29292f] ${hasError ? 'border-red-500' : 'border-[#3d44c1]'
          }`}
        onChange={(e) => onChange && onChange(e?.target?.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option className='bg-[#29292f] text-slate-200' key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  )
};

export default SelectInput;