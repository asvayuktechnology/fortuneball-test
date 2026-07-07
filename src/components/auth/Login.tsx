"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../ui/common/input/TextInput";
import Button from "../ui/common/input/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { generateCaptcha } from "@/utils";
import Link from "next/link";
import { useLogin } from "@/services/authService";
import { LuRefreshCcw } from "react-icons/lu";
import toast from "react-hot-toast";
import useCookie from "@/hooks/useCookies";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Countdowntimer from "../home/Countdowntimer";
import CustomCarousel from "../ui/common/CustomCarousel";
export const validationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  captcha: z.string().min(1, "Captcha is required"),
});
type LoginFormData = z.infer<typeof validationSchema>;
export default function Login() {
  const auth = useAuth();
  const router = useRouter();
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const { setCookie } = useCookie<string>("authToken");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(validationSchema),
  });
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };
  const onSuccess = (result: any) => {
    if (result) {
      toast.success(result.message || "Login successful");
      setCookie(result.token, {
        expires: 7, // Expires in 7 days
        secure: false,
        sameSite: "strict",
      });
      auth.setIsLoggedIn(true);
      //  router.push("/");
    }
  };
  const onError = (err: any) => {
    const message =
      err?.response?.data?.message || err?.message || "Login failed";
    toast.error(message);
    refreshCaptcha();
  };
  const mutation = useLogin({ onSuccess, onError });
  const onSubmit = async (data: LoginFormData) => {
    if (parseInt(data.captcha) !== captcha.answer) {
      setError("captcha", {
        type: "manual",
        message: "Captcha is incorrect",
      });
      return;
    }
    mutation.mutate(data);
  };
  useEffect(() => {
    refreshCaptcha();
  }, []);
  // useEffect(() => {
  //   if (auth.isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [auth]);

    useEffect(() => {
    if (auth.isLoggedIn) {
      router.push('/');
      setTimeout(() => window.location.reload(), 1500)
    }
  }, [auth])
  
  return (
    <div className="max-w-md mx-auto">
      <div className="banner-section">
        <CustomCarousel >
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

            <div
              key="2"
              className=""
            >
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
        <Image src="/images/playdexlogo.png" width={200} height={50} alt="" className="absolute top-5 left-6.5" />

      </div>

      <div className="flex mx-[24px]  justify-center text-white p-[25px] mb-[20px] rounded-2xl bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee] p-8 relative">
        <div className="w-full max-w-[600px]  rounded-lg  ">
          <h2 className="text-[14px] mb-[7px] font-semibold text-center text-[#bababa]">
            Welcome Back 
          </h2>
          <p className="text-center text-[11px] text-[#bababa] font-normal mb-[28px]">
            Enter your details below
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 authform">
            <div className="relative">
              <Image src="/images/emailinputicon.svg" alt="" width={25} height={25} className="absolute top-[24px] left-[15px] -translate-y-1/2 z-2" />
              <TextInput
                label="Email Address *"
                name="email"
                placeholder="Enter email"
                register={register}
                error={errors.email}
                authinput
                className="pl-7"
                icon
              />

            </div>
            {/* Password Field */}
            <div className="relative ">
              <Image src="/images/passwordinputicon.svg" alt="" width={25} height={25} className="absolute top-[24px] left-[15px] -translate-y-1/2 z-2" />
              <TextInput
                label="Password *"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                register={register}
                error={errors.password}
                authinput
                icon
              />
              <span
                className="absolute top-[50%] right-3 -translate-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Captcha Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-1 flex outerlable ">
                Solve CAPTCHA:{" "}
                <strong className="pl-1">{captcha.question}</strong>
                <button
                  type="button"
                  className="ml-5 text-xs text-blue-600 hover:underline "
                  onClick={refreshCaptcha}
                >
                  <LuRefreshCcw className="text-lg ml-1 cursor-pointer text-white" />
                </button>
              </label>
              <div className="relative">
                <TextInput
                  label=""
                  name="captcha"
                  placeholder="Enter captcha"
                  register={register}
                  error={errors.captcha}
                />

              </div>
            </div>
            <div className="flex items-center justify-between mt-3 mb-[32px]">
              <div className="flex items-end gap-[6px]">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border  accent-[#b663fa] text-[#b663fa] focus:ring-purple-500"
                />
                <label
                  htmlFor="remember-me"
                  className="text-[11px] text-[#b663fa] cursor-pointer select-none "
                >
                  Remember me
                </label>
              </div>
              {/* Forgot password link */}
              <div className="text-center ">
                <Link href="/forget" className="text-[11px] text-[#b663fa] ">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="relative">
              <Button
                text="Login Now"
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
                isLoading={mutation?.isPending} disableStyle
              />
              <Image src="/images/arrow-right.svg" width={25} height={25} alt="" className="absolute right-[10px] top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Signup CTA box */}
          <div
            className="flex items-center gap-12 mt-[32px] text-[11px] justify-center
"
          >
            <p className="text-[#bababa] ">
              Don't have an account?
            </p>

            <Link
              href="/register"
              className=" text-[#ffd045]
    "
            >
              Register Now
            </Link>
          </div>
        </div>
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
      <div className="mt-6 px-6 flex items-center justify-between text-[8px]">
        <p className="text-white/50">
          © 2026 Playdex. All rights reserved
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/terms"
            className="text-[8px] text-[#bb34fc]"
          >
            Terms & Conditions
          </Link>

          <span className="text-[8px] text-[#bb34fc]/50">|</span>

          <Link
            href="/privacy-policy"
            className="text-[8px] text-[#bb34fc]"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
