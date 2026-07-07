"use client";
import React, { useEffect, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/common/input/TextInput";
import Button from "../ui/common/input/Button";
import ColumnDiv from "../ui/ColumnDiv";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { generateCaptcha, isOver18YearsOld } from "@/utils";
import toast from "react-hot-toast";
import { useCustomerRegister } from "@/services/authService";
import { LuRefreshCcw } from "react-icons/lu";
import { useRouter } from "next/navigation";
import useCookie from "@/hooks/useCookies";
import { useVerifyToken } from "@/services/customerService";
import PhoneInput from "react-phone-input-2";
import PhoneNumberInput from "../ui/common/input/PhoneNumberInput";

// Zod schema for form validation
const validationSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    sponsorCode: z.string().min(1, "Sponsor code is required"),
    walletaddress: z.string().min(1, "Wallet address is required"),
    dateofbirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => isOver18YearsOld(val), {
        message: "You must be at least 18 years old",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmpassword: z.string(),
    captcha: z.string().min(1, "Captcha is required"),
    encyptcode: z.string().min(1, "Encrypt code is required"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type RegisterFormData = z.infer<typeof validationSchema>;

export default function Register({ tokenId }: { tokenId: string }) {
  // console.log('sponser', sponser)
  const router = useRouter();

  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { setCookie } = useCookie<string>("authToken");
  const { mutate: verifyToken, isPending: pendingVerifyToken } =
    useVerifyToken();
  const [errorRes, setErrorRes] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const onSuccess = (result: any) => {
    // console.log(result);

    if (result) {
      // toast.success(result.message || "Registration successful");
      toast.success("Registration successful");
    }
    setCookie(result.token, {
      expires: 7, // Expires in 7 days
      secure: false,
      sameSite: "strict",
    });
    reset();
    refreshCaptcha();
    router.push("/user/profile");
  };
  const onError = (err: any) => {
    // console.log("error", err);
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Registration failed";
    toast.error(message);
  };
  const mutaion = useCustomerRegister({ onSuccess, onError });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      encyptcode: tokenId,
    },
  });
  const onSubmit = async (data: RegisterFormData) => {
    // console.log("form daat :-", data);

    if (parseInt(data.captcha) !== captcha.answer) {
      setError("captcha", {
        type: "manual",
        message: "Captcha is incorrect",
      });
      return;
    }
    const { captcha: _, ...submissionData } = data;
    mutaion.mutate(submissionData);
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  useEffect(() => {
    if (tokenId) {
      verifyToken(
        { encryptedData: tokenId },
        {
          onSuccess: (data: any) => {
            if (data) {
              setValue("sponsorCode", data.sponsorCode);
              setValue("email", data.email);
              setIsReadOnly(true);
              setIsVerified(true);
            }
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              "Something went wrong!";

            setErrorRes(message);
          },
        }
      );
    }
  }, [tokenId]);

  if (errorRes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Registration Link Error
        </h1>
        <p className="text-lg text-red-500 mb-6">{errorRes}</p>
      </div>
    );
  }

  return (
    <>
      {isVerified && (
        <div className="flex min-h-full w-full justify-center px-8">
          <div className="flex w-full flex-col items-center">
            <div className="formwrapper py-7 md:max-w-[576px] max-w-[400px] w-full">
              <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  label="First Name"
                  name="firstname"
                  placeholder="Enter first name"
                  register={register}
                  error={errors.firstname}
                  authinput
                />
                <TextInput
                  label="Last Name"
                  name="lastname"
                  placeholder="Enter last name"
                  register={register}
                  error={errors.lastname}
                  authinput
                />
                <TextInput
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  register={register}
                  error={errors.email}
                  readOnly={isReadOnly}
                  authinput
                />
                {/* Phone with country code */}
              <PhoneNumberInput
                name="phone"
                control={control as Control<any>}
                error={errors.phone}
                placeholder="Enter phone number"
              />

                {/* <TextInput
                  label="Phone"
                  name="phone"
                  placeholder="Enter phone number"
                  register={register}
                  error={errors.phone}
                  authinput
                /> */}
                <TextInput
                  label="Sponsor Code"
                  name="sponsorCode"
                  placeholder="Enter sponsor code"
                  register={register}
                  error={errors.sponsorCode}
                  readOnly={isReadOnly}
                  authinput
                />
                <TextInput
                  label="Wallet Address"
                  name="walletaddress"
                  placeholder="Enter wallet address"
                  register={register}
                  error={errors.walletaddress}
                  authinput
                />
                <TextInput
                  label="DOB"
                  type="date"
                  name="dateofbirth"
                  placeholder="Enter dateofbirth number"
                  register={register}
                  error={errors.dateofbirth}
                  authinput
                />

                {/* Password Field */}
                <div className="relative">
                  <TextInput
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    register={register}
                    error={errors.password}
                    authinput
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-100"
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
                    authinput
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-100"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <ColumnDiv className="mb-4">
                  <div className="flex items-start mb-1">
                    <span className="font-medium text-sm text-white">
                      Solve Captcha: <strong>{captcha.question}</strong>
                    </span>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline ml-5"
                      onClick={refreshCaptcha}
                    >
                      <LuRefreshCcw className="text-lg cursor-pointer text-white" />
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
                  text="Register"
                  btnStyle="btn-normal"
                  type="submit"
                  className="w-full
rounded-full
py-4
font-semibold
text-black
shadow-lg
transition
text-[13px]
hover:scale-[1.02]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]"
                  disableStyle
                  isLoading={mutaion?.isPending}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
