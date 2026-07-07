"use client"
import React, { useEffect, useState } from "react";
import { FaPaste } from "react-icons/fa";
import Button from "../ui/common/input/Button";
import TextInput from "../ui/common/input/TextInput";
import SelectInput from '../ui/common/input/Select';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useInitiateWithdrawals, useConfirmWithdrawal } from "@/services/TransactionService";
// import SelectWalletInput from "../ui/common/input/SelectWalletInput";
import { useFetchCustemerWalletList } from "@/services/customerService";
// import { useFetchCustomerWallet } from "@/services/customerService";
import PageTitle from "../ui/common/pagetitle/PageTitle";
import Image from "next/image";
import { MyWithdwralRequestList2 } from "./MyWithdrawl";
import { ListTable } from "../ui/common/table/ListTable/ListWithTable";
import { useFetchAuthprofile } from "@/services/authService";
import { maskWallet } from "@/utils";
import Loader from "../ui/common/Loader";
import { checkDivisibleBy10 } from "@/utils";
const WithdrawSchema = z.object({
  walletType: z.string().min(1, "wallet type is required"),
  // tokens: z.string().min(1, "Token is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => checkDivisibleBy10(val), {
      message: "Only 10, 20, 30... allowed.",
    }),
  walletAddress: z.string().optional(),
});
const OtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});
type WithdrawFormData = z.infer<typeof WithdrawSchema>;
type OtpFormData = z.infer<typeof OtpSchema>;
const Withdrawl = () => {
  const [currentWalletAmount, setCurrentWalletAmount] = useState<string>("0")
  const [loader, setLoader] = useState(false);
  const { data: walletList, isLoading: isLoadingWallet, refetch: refetchWallet } = useFetchCustemerWalletList();
  const filteredWalletList = walletList?.filter(
    wallet => !['deposit', 'usdt', 'staking', 'usdt', 'boosterwallet', 'mtht', 'BNBWallet'].includes(wallet.value)
  );
  const [showOtp, setShowOtp] = useState(false);
  const { mutate: initiateWithdrawal, isPending: initiateWithdrawalPendding } = useInitiateWithdrawals();
  const { mutate: confirmWithdrawal, isPending: confirmWithdrawalPending } = useConfirmWithdrawal();
  const {
    register: withdrawRegister,
    handleSubmit: handleWithdrawSubmit,
    reset: resetWithdrawForm,
    formState: { errors: withdrawErrors },
    control, // Added for SelectInput
    getValues: getWithdrawValues,
    watch: withdrawWatch,
    setValue: setWithdrawValue
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(WithdrawSchema),
  });
  const allValues = withdrawWatch();
  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm<OtpFormData>({
    resolver: zodResolver(OtpSchema),
  });


  const onSubmitWithdraw = async (data: WithdrawFormData) => {
    try {
      // ✅ Check if amount is divisible by 10 before hitting API
      if (!checkDivisibleBy10(data.amount)) {
        toast.error("Only 10, 20, 30... allowed.");
        return; // ⛔ Stop here
      }

      // ✅ Continue only if divisible
      initiateWithdrawal(
        { ...data, walletAddress: data?.walletAddress ?? "" },
        {
          onSuccess: (data) => {
            toast.success(data.message || "OTP sent successfully");
            setShowOtp(true);
            resetWithdrawForm();
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              "Withdrawal initiation failed";
            toast.error(message);
          },
        }
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  };


  const onSubmitOtp = async (data: OtpFormData) => {
    try {
      confirmWithdrawal(data, {
        onSuccess: (data) => {
          toast.success(data.message || "Withdrawal successful");
          setShowOtp(false);
          resetWithdrawForm();
          resetOtpForm();
        },
        onError: (err: any) => {
          const message = err?.response?.data?.error ||
            err?.response?.data?.message || err?.message || "Withdrawal confirmation failed";
          toast.error(message);
        },
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  };
  const getAndSetCurrentWalletAmount = () => {
    const walletAmount = filteredWalletList?.filter(item => item?.value === allValues?.walletType);
    if (walletAmount && walletAmount[0]) {
      const amount = walletAmount[0]?.amount;
      setCurrentWalletAmount(amount);
    }
  };
  const setSelectedWalletMaxAmout = () => {
    setWithdrawValue('amount', currentWalletAmount?.toString())
  }
  useEffect(() => {
    refetchWallet();
  }, [])
  useEffect(() => {
    getAndSetCurrentWalletAmount();
  }, [allValues]);
  const { data: userData, isLoading, refetch } = useFetchAuthprofile();
  console.log('cutomer data :-', userData);

  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative min-h-screen">
          <div className="max-w-md mx-auto mt-10 px-[24px]">

            <div className="withdraw py-6 px-8">
              <h1 className="mb-5 text-center text-[21px] font-bold text-white">
                Withdrawal
              </h1>
              <div
                className="
relative
text-center
rounded-[18px]
border
border-[#9a4cee]
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
px-[18px]
py-[18px]
shadow-[0_8px_30px_rgba(0,0,0,.4)]
"
              >
                <div className="wallethead min-w-[135px] absolute -top-0 left-1/2 -translate-1/2 sm:text-sm text-[12px] text-center font-bold  mr-1 bg-white py-1 px-2 rounded text-[#08155e]">
                  Wallet Address{" "}
                </div>
                {/* <div className="text-white  overflow-hidden sm:text-md text-[14px] font-medium truncate mx-auto"> {isLoading ? 'XXX.X' : maskWallet(userData?.data?.walletAddress) ?? 'XX.XX'}</div> */}

                <div className="text-white overflow-hidden sm:text-md text-[14px] font-medium truncate mx-auto">
                  {isLoading ? (
                    "XXX.X"
                  ) : (
                    <>
                      <span className="hidden md:inline">
                        {userData?.data?.walletAddress ?? "XX.XX"}
                      </span>
                      <span className="md:hidden">
                        {maskWallet(userData?.data?.walletAddress) ?? "XX.XX"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col  gap-6">
                {/* Form Section */}
                <div
                  className="
mt-[24px]
rounded-[18px]
border
border-[#9a4cee]
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
p-[18px]
"
                >

                  <div className="w-full ">
                    {!showOtp ? (
                      <form
                        onSubmit={handleWithdrawSubmit(onSubmitWithdraw)}
                        className="space-y-6"
                      >
                        <div className="">
                          {/* Withdrawal Address */}
                          {/* <div className="relative">
                  <TextInput
                    label="Wallet Address"
                    type="text"
                    name="walletAddress"
                    placeholder="Withdrawal Address"
                    register={withdrawRegister}
                    error={withdrawErrors.walletAddress}
                  />
                </div> */}
                          <div className="md:col-span-1 ">
                            <SelectInput
                              name="walletType"
                              label="Select wallet"
                              options={filteredWalletList ?? []}
                              control={control as any}
                              error={withdrawErrors.walletType}
                              register={withdrawRegister}
                            />
                          </div>
                          {/* Token Amount */}
                          <div className="relative">
                            <TextInput
                              name="amount"
                              label={`Enter Amount`} //(Available amount ${currentWalletAmount}) MTHT
                              className=""
                              //placeholder="Amount must be divisible by 10. Try 10, 20, 30, etc."
                              register={withdrawRegister}
                              error={withdrawErrors.amount}
                            />
                            <div className="text-white -mt-3 mb-3 font-normal text-[12px]">
                              Available :{" "}
                              <span className="font-medium">
                                {" "}
                                {currentWalletAmount} MTHT{"  "}
                              </span>
                            </div>
                            {/* <Image
                        src="/images/layrexlogo.png"
                        width={30}
                        height={30}
                        alt="Company Logo"
                        priority
                        className="absolute lg:top-[47%] top-[47%] right-12 -translate-1/2"
                      /> */}
                            <span
                              onClick={setSelectedWalletMaxAmout}
                              className="cursor-pointer absolute text-[#9a4cee] right-6  top-[24px] -translate-y-1/2"
                            >
                              Max
                            </span>
                          </div>
                        </div>
                        {/* Submit Button */}
                        <div className="md:col-span-1 ">
                          <Button
                            type="submit"
                            text="Withdrawal"
                            className="w-full
rounded-[14px]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
text-[11px]
font-semibold
text-black"
                            disableStyle
                            isLoading={initiateWithdrawalPendding}
                            disabled
                          />
                        </div>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleOtpSubmit(onSubmitOtp)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:max-w-1/2 mx-auto gap-4 mt-6">
                          {/* OTP Input */}
                          <div>
                            <TextInput
                              label="Enter OTP"
                              type="text"
                              name="otp"
                              placeholder="Enter 6-digit OTP"
                              register={otpRegister}
                              error={otpErrors.otp}
                            />
                          </div>
                          <div className="md:col-span-1 ">
                            <Button
                              type="submit"
                              text="Confirm Withdrawal"
                              className="w-full
rounded-[14px]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
text-[11px]
font-semibold
text-black"
                              disableStyle
                              isLoading={confirmWithdrawalPending}
                            />
                          </div>
                          {/* Cancel Button */}
                          <div className="md:col-span-1">
                            <Button
                              type="button"
                              text="Cancel"
                              className="w-full bg-gray-500 text-white p-3 rounded-full"
                              onClick={() => setShowOtp(false)}
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
              <MyWithdwralRequestList2 />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Withdrawl;