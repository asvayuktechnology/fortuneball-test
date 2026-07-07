"use client";

import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ColumnDiv from "../../ColumnDiv";
import ErrorLabel from "../ErrorLabel";

type Props = {
  name: string;
  control: Control<any>;
  error?: FieldError;
  placeholder?: string;
};

const PhoneNumberInput = ({
  name,
  control,
  error,
  placeholder,
}: Props) => {
  const hasError = error?.message;

  return (
    <ColumnDiv className="relative mb-4">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country="in"
            value={field.value || ""}
            onChange={field.onChange}
            placeholder={placeholder}
            containerClass="!w-full"
            inputClass={`!w-full !h-12 !rounded-[8px] !bg-[#11053e] !text-slate-200 !pl-24 !pr-3 !text-sm  ${
              hasError
                ? "!border !border-red-500"
                : "!border !border-[#9a4cee]"
            }`}
            buttonClass={`!bg-[#11053e] ${
              hasError
                ? "!border-red-500"
                : "!border-[#9a4cee]"
            } !rounded-l-[8px]`}
            dropdownClass="!bg-[#11053e] !text-white"
          />
        )}
      />

      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  );
};

export default PhoneNumberInput;