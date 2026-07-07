'use client';
import ColumnDiv from '../../ColumnDiv';
import ErrorLabel from '../ErrorLabel';

import { FieldError, UseFormRegister } from 'react-hook-form';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  className?:string;
  labelstyle?:string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema?: any;
  error?: FieldError;
  defaultValue?: string
};
const TextAreaInput = (props: Props) => {
  const {
    name,
    placeholder,
    register,
    validationSchema,
    error,
    label,
    rows = 4,
    defaultValue,
    className,
    labelstyle
  } = props;
  if (register) return (
    <ColumnDiv>
      <label className={`pt-2 text-slate-200 text-[11px] font-normal ${labelstyle ? labelstyle : null}`}>{label}</label>
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...register(name, { ...validationSchema })}
        defaultValue={defaultValue}
        className={`p-4 focus:outline-sky-300 text-white  focus:outline-0 focus:border-[#29292f] active:border-[#8D8D94] border-[#29292f] rounded-[8px] ${className ? className : " border-2 border-[1px]"} `}
      />
      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  );
  else {
    <ColumnDiv>
      <label className="pt-2 text-slate-200 text-[11px] font-normal">{label}</label>
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        defaultValue={defaultValue}
        className="border-2 p-4 focus:outline-sky-300 text-white border-[1px] p-4 focus:outline-0 focus:border-[#29292f] active:border-[#8D8D94] border-[#3d44c1] rounded-[8px]"
      />
      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  }
};

export default TextAreaInput;
