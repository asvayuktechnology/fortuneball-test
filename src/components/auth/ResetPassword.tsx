"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/common/input/TextInput";
import Button from "../ui/common/input/Button";
import ColumnDiv from "../ui/ColumnDiv";
import { generateCaptcha } from "@/utils";
import toast from "react-hot-toast";
import { LuRefreshCcw } from "react-icons/lu";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "@/services/authService";
import { useRouter } from 'next/navigation'

// Zod schema for form validation
const validationSchema = z
  .object({
    captcha: z.string().min(1, "Captcha is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type RegisterFormData = z.infer<typeof validationSchema>;

export default function ResetForm({ tokenId }: { tokenId: string }) {
  // console.log("tokenId", tokenId);
    const router = useRouter(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (parseInt(data.captcha) !== captcha.answer) {
      setError("captcha", {
        type: "manual",
        message: "Captcha is incorrect",
      });
      return;
    }

    try {
      const payload = {
      newPassword: data.newPassword
    };

    const result = await resetPassword(payload, tokenId);
      if (result) {
        toast.success(result.message || "Reset Password");
      }
      reset();
      refreshCaptcha();
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";
      toast.error(message);
    }
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  return (
    <div className="flex min-h-full w-full justify-center px-4">
      <div className="flex w-full flex-col items-center">
        <div className="formwrapper py-7 md:max-w-[576px] max-w-[400px] w-full">
          <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <TextInput
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                register={register}
                error={errors.newPassword}
              />
              <span
                className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <TextInput
                label="Confirm Password"
                name="confirmpassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                register={register}
                error={errors.confirmpassword}
              />
              <span
                className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ColumnDiv className="mb-4">
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm text-[#e5e3ec]">
                  Solve Captcha: <strong>{captcha.question}</strong>
                </span>
                <button
                  type="button"
                  className="text-xs text-white hover:underline ml-5"
                  onClick={refreshCaptcha}
                >
                  <LuRefreshCcw className="text-lg ml-1 cursor-pointer " />
                </button>
              </div>
              <TextInput
                label="Captcha"
                name="captcha"
                placeholder="Enter captcha"
                register={register}
                error={errors.captcha}
              />
            </ColumnDiv>

            <Button
              text={"Reset"}
              btnStyle="btn-normal"
              type="submit"
              className="w-full font-normal"
            />
          </form>
          <div className="mt-16  text-center rounded-lg p-6 bg-[#29292f]">
            <p className="text-sm text-[#c6c3d3] font-semibold mb-2">
              Don't have an account?
            </p>
            <Link
              href="/register"
              className="bg-[#ffc428] p-3 rounded-lg text-slate-900 font-medium text-[12px] hover:underline"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
