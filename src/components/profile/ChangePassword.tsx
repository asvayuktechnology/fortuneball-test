"use client"
import React from 'react'
import Button from '../ui/common/input/Button'
import PageTitle from '../ui/common/pagetitle/PageTitle';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import { useChangePassword } from '@/services/authService';
import PasswordInput from "@/components/ui/common/input/PasswordInput"
const validationSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long.'),
  confirmPassword: z.string().min(1, 'Confirm password is required.'),
}).refine((data) => data.newPassword !== data.currentPassword, {
  path: ['newPassword'],
  message: 'New password must be different from current password.',
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Confirm password must match new password.',
});

type Formdata = z.infer<typeof validationSchema>;

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Formdata>({
    resolver: zodResolver(validationSchema),
  });

  const onSuccess = () => {
    toast.success('Your password has been changed successfully.');
    reset();
  };

  const onError = (err: any) => {
    const message = err?.response?.data?.message ?? "We couldn't update your password. Please try again."
    toast.error(message);
  };
  const { mutate, isPending } = useChangePassword({ onSuccess, onError });

  const onSubmit = (value: Formdata) => mutate({ newPassword: value?.newPassword, currentPassword: value?.currentPassword })
  return (
    <>
      <div className="flex min-h-full w-full justify-center px-4">
        <div className="flex w-full flex-col items-center">
          <div className="formwrapper py-7 w-full">

            <PageTitle title='Change Password' />
            <div className=' mt-5  rounded-2xl   bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee]   p-[15px]   '>

              <form
                className="mx-auto mt-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <PasswordInput
                  label=""
                  placeholder="Current password"
                  name="currentPassword"
                  register={register}
                  error={errors.currentPassword}
                  type='password'

                />
                <PasswordInput
                  label=""
                  placeholder="New password"
                  name="newPassword"
                  register={register}
                  error={errors.newPassword}
                  type='password'

                />
                <PasswordInput
                  label=""
                  placeholder="Confirm password"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                  type='password'

                />
                <Button text='Update' btnStyle="btn-normal" type="submit" className='className={`
    rounded-full bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)] px-4   py-2 text-sm font-bold text-[#1a1a2e] transition group-hover:scale-105 w-full' isLoading={isPending} disableStyle />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword