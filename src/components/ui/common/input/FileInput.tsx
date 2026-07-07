"use client";
import React, { useState, useEffect, useRef } from "react";
import { UseFormRegister, FieldError, useWatch } from "react-hook-form";
import ErrorLabel from "../ErrorLabel";
import ColumnDiv from "../../ColumnDiv";
import Image from "next/image";

type Props = {
  name: string;
  label: string;
  type?: string;
  register?: UseFormRegister<any>;
  validationSchema?: any;
  error?: FieldError;
  className?: string;
  accept?: string;
  control?: any;
  resetTrigger?: any;
};

const FileInput = ({
  name,
  label,
  type = "file",
  register,
  validationSchema,
  error,
  className = "",
  accept = "image/png,image/jpg,image/jpeg",
  control,
  resetTrigger,
}: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetTrigger]);

  return (
    <ColumnDiv className="relative mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-small text-white"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        accept={accept}
        {...(register && register(name))}
        onChange={(e) => {
          handleChange(e); // generate preview
          register?.(name)?.onChange?.(e); // update RHF state
        }}
        ref={(e) => {
          inputRef.current = e;
          register?.(name)?.ref?.(e);
        }}
        className={`block w-full text-sm text-white bg-[#37373e] border border-transparent rounded-md file:bg-[#37373e] file:border-0 file:py-2 file:px-4 cursor-pointer ${
          error ? "border-red-500" : "border-[#37373e]"
        } ${className}`}
      />

      {previewUrl && typeof previewUrl === "string" && (
        <div className="mt-3">
          <Image
            height={128}
            width={128}
            src={previewUrl}
            alt="Preview"
            className="h-32 w-32 object-cover rounded border"
          />
        </div>
      )}

      <ErrorLabel fieldError={error} />
    </ColumnDiv>
  );
};

export default FileInput;
