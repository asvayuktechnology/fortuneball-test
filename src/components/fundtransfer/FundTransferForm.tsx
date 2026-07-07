import React, { useEffect, useState } from "react";
import Button from "../ui/common/input/Button";
import TextInput from "../ui/common/input/TextInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchCustemerWalletList } from "@/services/customerService";
import { useVerifyEmail, useConfirmTransfer, useFundTransfer } from "@/services/funndtransferService";
import SelectInput from "../ui/common/input/Select";
import moment from "moment";
import toast from "react-hot-toast";



type VerifyEmailFormProps = {
    setIsEmailVerifyed: (status: boolean) => void;
    setCurrentEmail: (status: string) => void;
}

const verifyEmailSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
});
type VerifyEmailFormdata = z.infer<typeof verifyEmailSchema>;

const fundTransferSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    walletType: z.string().min(1, "Wallet type is required"),
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type FundTransferData = z.infer<typeof fundTransferSchema>;

const handdeShowFormError = (err: any) => {
    const message = err?.response?.data?.mesage || "Email verification failed.";
    toast.error(message)
}
const EmailVerifyForm = (props: VerifyEmailFormProps) => {
    const { setIsEmailVerifyed, setCurrentEmail } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: zodResolver(verifyEmailSchema),
    });
    const { mutate, isPending } = useVerifyEmail({
        onError: handdeShowFormError,
        onSuccess: () => {
            toast.success('Email verifyed.');
            setIsEmailVerifyed(true);
            setCurrentEmail(getValues('email'))
        }
    })
    const onSubmit = (values: VerifyEmailFormdata) => mutate(values)
    return (
        <div>
            <form onSubmit={() => handleSubmit(onSubmit)}>
                <div className="lg:flex gap-3 items-end">
                    <div className="basis-2/3">

                        <TextInput
                            label="Email"
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
                            type="submit"
                            text="Verify"
                            className="w-full h-14 rounded-r-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 mb-4"
                            isLoading={isPending}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

const FundTransferForm = () => {
    const [isEmailVerifyed, setIsEmailVerifyed] = useState(false);
    const [currentEmail, setCurrentEmail] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const { data: walletList, isLoading, refetch } = useFetchCustemerWalletList()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(fundTransferSchema),
        defaultValues: {
            amount: '',
            walletType: '',
            otp: 'xxxxxx',
        }
    });
    const { mutate: mutateFundtransfer, isPending: isPendingFundtransfer } = useFundTransfer({
        onError: handdeShowFormError,
        onSuccess: () => { }
    });

    const { mutate: mutateConfirmFundtransfer, isPending: isPendingConfirmFundtransfer } = useConfirmTransfer({
        onError: handdeShowFormError,
        onSuccess: () => { }
    });
    const onSubmit = (values: FundTransferData) => showOtp ? mutateConfirmFundtransfer({ otp: values?.otp }) : mutateFundtransfer({ ...values, isVerified: true, email: currentEmail })
    return (
        <div className="space-y-4">
            <EmailVerifyForm setIsEmailVerifyed={setIsEmailVerifyed} setCurrentEmail={setCurrentEmail} />
            {isEmailVerifyed && (
                <form onSubmit={() => handleSubmit(onSubmit)}>
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
                            <SelectInput
                                name="walletType"
                                label="Select Wallet"
                                options={walletList ?? []}
                                register={register}
                                error={errors.walletType}
                                className="text-slate-800"
                            />
                        </div>
                    </div>
                    {
                        showOtp && (
                            <div>
                                <TextInput
                                    label="OTP"
                                    type="text"
                                    name="otp"
                                    register={register}
                                    error={errors.otp}
                                    className="w-full flex-grow rounded-md border border-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter OTP"
                                />
                            </div>
                        )
                    }
                    <Button
                        type="submit"
                        text={showOtp ? 'Confirm Transfer' : 'Send OTP'}
                        className="w-full rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                        isLoading={isPendingConfirmFundtransfer || isPendingFundtransfer}
                    />
                </form>
            )}
        </div>
    )
}
