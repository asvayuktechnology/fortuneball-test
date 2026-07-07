"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/common/input/TextInput";
import Button from "../ui/common/input/Button";
import ColumnDiv from "../ui/ColumnDiv";
import { generateCaptcha, isOver18YearsOld } from "@/utils";
import { registerBasic, useCustomerRegister } from "@/services/authService";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { registerVerify, registerResendOtp } from "@/services/customerService";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { LuRefreshCcw } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import useCookie from "@/hooks/useCookies";
import ResendOtpButton from "../ui/common/input/OtpSendButton";
import { ToasMessageModal } from "../ui/common/Modal";
import CustomCarousel from "../ui/common/CustomCarousel";
import Countdowntimer from "../home/Countdowntimer";
import Image from "next/image";
const validationSchema = z.object({
  email: z.string().email("Invalid email address"),
  sponsorCode: z.string().min(1, "Sponsor code is required"),
  captcha: z.string().min(1, "Captcha is required"),
});

type RegisterFormData = z.infer<typeof validationSchema>;

export default function RegisterBasicForm({
  sponsorCode,
  isReadOnly,
}: {
  sponsorCode: string;
  isReadOnly: boolean;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loader, setLoader] = useState(false);
  const [captchaData, setCaptchaData] = useState<{
    question: string;
    answer: number;
  }>({ question: "", answer: 0 });
  const [btnLoader, setBtnLoader] = useState({ otp: false, formSubmit: false });

  const { mutate: registerMutate, isPending: pendingloader } =
    useCustomerRegister({
      onSuccess: (res: any) => {
        if (res?.success === true) {
          setBtnLoader((prev) => ({ ...prev, formSubmit: true }));
          toast.success(res.message || "OTP sent to email");
        } else {
          toast.error(res?.message || "Registration failed");
        }
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || err?.message || "Registration failed",
        );
      },
    });

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      sponsorCode: sponsorCode || "", // YEH ADD KAREIN
    },
  });

  /* -------------------- AUTO SPONSOR -------------------- */
  useEffect(() => {
    if (sponsorCode && isReadOnly) {
      setValue("sponsorCode", sponsorCode, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [sponsorCode, isReadOnly, setValue]);

  useEffect(() => {
    setCaptchaData(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaData(generateCaptcha());
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA not ready");
      return;
    }

    // :white_tick: v3 token generate
    const recaptchaToken = await executeRecaptcha("register_basic");
    if (!recaptchaToken) {
      toast.error("reCAPTCHA verification failed");
      return;
    }

    if (parseInt(data.captcha) !== captchaData.answer) {
      setError("captcha", {
        type: "manual",
        message: "Captcha is incorrect",
      });
      return;
    }
    try {
      setLoader(true);

      // Prepare payload including the recaptchaToken
      const { captcha, ...payload } = data;
      const payloadWithRecaptcha = { ...payload, recaptchaToken };

      const result = await registerBasic(payloadWithRecaptcha);

      toast.success(result?.message || "Registration successful");
      reset();
      refreshCaptcha();
      setShowModal(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Registration failed",
      );
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className="max-w-md mx-auto">
      <div className="banner-section">
        <CustomCarousel>
          {[
            <div key="1">
              <div className="flex flex-col items-center mb-[27px] relative pt-7">
                <div className="flex justify-center">
                  <img
                    src="/images/login-banner.png"
                    alt="Fortune Ball"
                    className="w-full object-contain"
                  />
                </div>
                {/* <div className="-mt-3">
                  <Countdowntimer />
                </div> */}
              </div>
            </div>,

            <div key="2" className="">
              <div className="flex flex-col items-center mb-[27px] relative pt-7">
                <div className="flex justify-center">
                  <img
                    src="/images/login-banner.png"
                    alt="Fortune Ball"
                    className="w-full object-contain"
                  />
                </div>
                {/* <div className="-mt-3">
                  <Countdowntimer />
                </div> */}
              </div>
            </div>,
          ]}
        </CustomCarousel>
      </div>

      <div className="flex mx-[24px]  justify-center text-white p-[25px] mb-[20px] rounded-2xl bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee] p-8 relative">
        <div className="w-full max-w-[600px]  rounded-lg">
          <h2 className="text-[14px] mb-[7px] font-semibold text-center text-[#bababa]">
            Welcome to Playdex
          </h2>
          <p className="text-center text-[11px] text-[#bababa] font-normal mb-[28px]">
            Enter Your Email Below
          </p>
          <div className="formwrapper md:max-w-[576px] max-w-[400px] w-full">
            <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                            <Image src="/images/emailinputicon.svg" alt="" width={25} height={25} className="absolute top-1/2 left-[15px] -translate-y-1/2 z-2" />
                            <TextInput
                label="Email"
                name="email"
                placeholder="Enter email"
                register={register}
                error={errors.email}
                // readOnly={isReadOnly}
                authinput
                className="pl-7"
                icon
              />
              
                          </div>
             

   <div className="relative ">
              <Image src="/images/passwordinputicon.svg" alt="" width={25} height={25} className="absolute top-1/2 left-[15px] -translate-y-1/2 z-2" />
              <TextInput
                label="Sponsor Code"
                name="sponsorCode"
                placeholder="Enter sponsor code"
                register={register}
                error={errors.sponsorCode}
                readOnly={isReadOnly}
                authinput
                icon
              />
            </div>

             

              <ColumnDiv className="mb-4">
                <div className="flex items-start mb-1">
                  <span className="font-medium text-sm text-white">
                    Solve Captcha: <strong>{captchaData.question}</strong>
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

              {/* <Button
                text="Register"
                btnStyle="btn-normal"
                type="submit"
                className="w-full"
                isLoading={loader}
              /> */}

              <div className="relative">
                <Button
                  text="Register"
                  type="submit"
                  isLoading={loader}
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
                />
                <Image
                  src="/images/arrow-right.svg"
                  width={25}
                  height={25}
                  alt=""
                  className="absolute right-[10px] top-1/2 -translate-y-1/2"
                />
              </div>
            </form>
          </div>
        </div>
        <ToasMessageModal
          isOpen={showModal}
          type="success"
          onClose={() => setShowModal(!showModal)}
        />
      </div>
       <div
              className=" mb-5
                    flex items-end justify-around gap-3
                    rounded-[16px]  text-center
                    border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
                    mx-[24px] py-[15px]
                    shadow-[0_0_20px_rgba(124,86,255,0.15)]
                  "
            >
              {/* ICON */}
              <div className="flex justify-center flex-col gap-[8px]">
                <Image
                  src={"/images/prosicon1.png"}
                  alt=""
                  width={45}
                  height={45}
                  className="object-contain mx-auto"
                />
                <p className="text-[10px] text-[#bababa]">
                  Secure <br />
                  Transactions
                </p>
              </div>
              <div className="flex justify-center flex-col gap-[8px]">
      
                <Image
                  src={"/images/prosicon2.png"}
                  alt=""
                  width={55}
                  height={55}
                  className="object-contain mx-auto"
                />
                <p className="text-[10px] text-[#bababa]">
                  Instant <br />
                  Rewards
                </p>
              </div>
              <div className="flex justify-center flex-col gap-[8px] text-center">
                <Image
                  src={"/images/prosicon3.png"}
                  alt=""
                  width={50}
                  height={50}
                  className="object-contain mx-auto"
                />
                <p className="text-[10px] text-[#bababa]">
                  Daily <br />
                  Rewards
                </p>
      
              </div>
              <div className="flex justify-center flex-col gap-[8px] text-center">
                <Image
                  src={"/images/prosicon4.png"}
                  alt=""
                  width={30}
                  height={30}
                  className="object-contain mx-auto "
                />
                <p className="text-[10px] text-[#bababa]">
                  Fast <br />
                  Withdrawals
                </p>
      
              </div>
      
      
      
            </div>
            <div
                    className=" mb-5
                          flex items-center gap-4
                          rounded-[16px] 
                          border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
                          mx-[24px] py-[16px] px-[25px]
                          shadow-[0_0_20px_rgba(124,86,255,0.15)]
              "
                  >
                    {/* SHIELD ICON */}
                    <div className="shrink-0">
                      <Image
                        src="/images/100.png"
                        alt="Safe & Secure"
                        width={52}
                        height={64}
                        className="object-contain"
                      />
                    </div>
            
                    {/* CONTENT */}
                    <div>
                      <h3 className="text-[13px] mb-[7px] font-semibold text-white leading-none">
                        Safe & Secure
                      </h3>
            
                      <p className="mt-2 text-[9px] text-white/70">
                        Your data is protected with 256-bit encryption
                      </p>
                    </div>
                  </div>
                  
    </div>
  );
}
