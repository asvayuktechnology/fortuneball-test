"use client";
import React, { useEffect, useState, useRef } from "react";
import Button from "../ui/common/input/Button";
import TextInput from "../ui/common/input/TextInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchCustomerWallet } from "@/services/customerService";
import SelectWalletInput from "../ui/common/input/SelectWalletInput";
import {
  useVerifyEmail,
} from "@/services/customerService";
import {
  useFundTransfer,
  useConfirmTransfer,
} from "@/services/TransactionService";
import toast from "react-hot-toast";
import { MyFundTransferList } from "./FundTransferTableList";
import PageTitle from "../ui/common/pagetitle/PageTitle";
import Loader from "../ui/common/Loader";
const fundTransferSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  amount: z.string().min(1, "Amount is required"),
  walletType: z.string().min(1, "Wallet type is required"),
});

const OtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});



const Fundtransfer: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const fundListRef = useRef<{ refetchList: () => void }>(null);

  const handleManualRefetch = () => {
    fundListRef.current?.refetchList();
  };
  const {
    data: wallet,
    refetch: refetchWallet,
    isLoading,
  } = useFetchCustomerWallet();

  const { mutate: verifyEmail, isPending: pendingVerifyEmail } = useVerifyEmail();
  const { mutate: fundtransfer, isPending: pendingFundtransfer } = useFundTransfer();
  const { mutate: confirmTransfer, isPending: pendingConfirmTransfer } = useConfirmTransfer();

  const dynamicWalletList = [

    {
      label: "Affiliate Wallet",
      value: "affiliatewallet",
      amount: wallet?.affiliatewallet.toFixed(2) ?? 0,
    },
    {
      label: `MTHT Wallet`,
      value: "mtht",
      amount: wallet?.depositwallet?.toFixed(2) ?? 0,
    },
    {
      label: `Reward Wallet`,
      value: "royalty",
      amount: wallet?.royaltywallet?.toFixed(2) ?? 0,
    },
    {
      label: `USDT Wallet`,
      value: "usdt",
      amount: wallet?.USDTWallet?.toFixed(2) ?? 0,
    },
    {
      label: `BNB Wallet`,
      value: "bnb",
      amount: wallet?.BNBWallet?.toFixed(2) ?? 0,
    },
    ...(wallet?.isDepositSend
      ? [
        {
          label: "Deposit Wallet",
          value: "depositwallet",
          amount: wallet?.depositwallet ?? 0,
        },
      ]
      : []),
  ];


  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(fundTransferSchema),
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    reset: resetOtp,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(OtpSchema),
  });

  // Verify email
  const onEmailVerify = () => {
    const email = getValues("email");
    if (!email) return toast.error("Please enter email");
    verifyEmail(
      { email },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Email verified successfully");
          setEmailVerified(true);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Verification failed");
        },
      }
    );
  };

  // Send OTP and initiate fund transfer
  const onSendOtp = () => {
    const formData = {
      ...getValues(),
      isVerified: true, // Add the required property
    };

    if (!emailVerified) return toast.error("Email not verified");

    fundtransfer(formData, {
      onSuccess: (res: any) => {
        toast.success(res.message || "OTP sent successfully");
        setShowOtp(true);
      },
      onError: (err: any) => {
        console.log(err, 'err')
        toast.error(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to send OTP");
      },
    });
  };

  // Confirm OTP and complete transfer
  const onOtpConfirm = (data: { otp: string }) => {
    confirmTransfer(data, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Transfer completed successfully");
        setIsVerified(true);
        setShowOtp(false);
        setEmailVerified(false);
        resetOtp();
        handleManualRefetch()
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Invalid OTP");
      },
    });
  };

  useEffect(() => {
    refetchWallet();
  }, []);


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative min-h-screen">
          <div className="max-w-md mx-auto mt-10 px-[24px]">
            <div className="md:grid  ">
              <div className="md:mb-0 mb-3 text-white rounded-xl md:p-6 md:py-6 px-3">
                <h1 className="mb-5 text-center text-[21px] font-bold text-white">
                  Fund Transfer
                </h1>
                {/* <h3 className="text-xl font-semibold"></h3> */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold">
                    <br />
                    <div className="pt-2 text-sm font-normal">
                      Total Balance:{" "}
                      <span className="font-semibold">
                        {wallet?.mainbalance?.toFixed(2)}{" "}
                      </span>
                      <span>MTHT</span>
                    </div>
                  </h4>
                </div>

                <div
                  className="
mt-[24px]
rounded-[18px]
border
border-[#9a4cee]
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
p-[18px]
">

                  <div className="space-y-4">
                    {/* Email input */}
                    <div className="items-end">
                      <div className="basis-2/3">
                        <TextInput
                          label="To Email"
                          type="email"
                          name="email"
                          register={register}
                          error={errors.email}
                          className="w-[full] flex-grow rounded-l-md border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Recipient's Email"
                        />
                      </div>
                      <div className="basis-1/3">
                        <Button
                          type="button"
                          text="Verify"
                          onClick={onEmailVerify}
                          className="w-full
rounded-[14px]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
text-[11px]
font-semibold
text-black"
                          disableStyle
                          isLoading={pendingVerifyEmail}
                        />
                      </div>
                    </div>

                    {emailVerified && (
                      <>
                        <div>
                          <TextInput
                            label="Amount"
                            type="number"
                            name="amount"
                            register={register}
                            error={errors.amount}
                            className="w-full text-slate-900 flex-grow rounded-md border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter amount"
                          />
                        </div>

                        {/* Wallet dropdown */}
                        <div className="flex w-full">
                          <div className="md:col-span-1 flex-grow">
                            <SelectWalletInput
                              name="walletType"
                              label="Select Wallet"
                              options={dynamicWalletList}
                              register={register}
                              error={errors.walletType}
                              className="text-slate-800"
                            />
                          </div>
                        </div>

                        {!showOtp && (
                          <Button
                            type="button"
                            text="Send OTP"
                            onClick={onSendOtp}
                            className="w-full
rounded-[14px]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
text-[11px]
font-semibold
text-black"
                            disableStyle
                            isLoading={pendingFundtransfer}
                          />
                        )}

                        {showOtp && (
                          <>
                            <div>
                              <TextInput
                                label="OTP"
                                type="text"
                                name="otp"
                                register={otpRegister}
                                error={otpErrors.otp}
                                className="w-full flex-grow rounded-md border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter OTP"
                              />
                            </div>
                            <Button
                              type="button"
                              text="Confirm Transfer"
                              onClick={handleOtpSubmit(onOtpConfirm)}
                              className="w-full
rounded-[14px]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
text-[11px]
font-semibold
text-black"
                              disableStyle
                              isLoading={pendingConfirmTransfer}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="
mt-[28px]
rounded-[18px]
border
border-[#9a4cee]
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
p-[15px]
">

                  <MyFundTransferList ref={fundListRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Fundtransfer;
