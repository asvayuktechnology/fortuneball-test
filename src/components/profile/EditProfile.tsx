"use client"
import React, { useRef, useState } from 'react';
import TextInput from '../ui/common/input/TextInput';
import Button from '../ui/common/input/Button';
import PageTitle from '../ui/common/pagetitle/PageTitle';
import { useForm, Controller, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendProfileUpdateOtp, updateCustomerProfile } from "@/services/customerService";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useFetchAuthprofile } from '@/services/authService';
import Loader from '../ui/common/Loader';
import moment from 'moment';
import ResendOtpButton from '../ui/common/input/OtpSendButton';
import { FaCopy, FaPaste } from 'react-icons/fa6';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ImageCropper from '../ImageCropper';
import Image from 'next/image';
import Avatar from '../ui/common/Avtar';
import { UPLOAD_PATH_URL, UPLOAD_URL } from '@/libs/api/const';
import FileInput from '../ui/common/input/FileInput';
import PhoneNumberInput from '../ui/common/input/PhoneNumberInput';

const validationSchema = z.object({
  firstname: z.string().min(1, "First name is required."),
  nationalId: z.string().optional(),
  lastname: z.string().min(1, "Last name is required."),
  // nationalDoc: z
  //   .any()
  //   .refine((files) => files?.length === 1, "Document is required.")
  //   .refine(
  //     (files) =>
  //       ["image/png", "image/jpeg", "image/jpg"].includes(files?.[0]?.type),
  //     "Only PNG, JPG, or JPEG files are allowed."
  //   ),
  profileimage: z.string(),
  emailAddress: z.string().email("Invalid email.").optional(),
  phone: z.string().min(10, "Phone number is required."), // simplified for intl
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  walletaddress: z.string().min(1, "Wallet address is required."),
  otp: z.string().length(6, "OTP must be 6 digits."),

  nationalDoc: z.string().optional(),
});

type FormData = z.infer<typeof validationSchema>;

const EditForm = ({ defaultValues }: { defaultValues: FormData }) => {
  const router = useRouter();
  const [otpSendStatus, setOtpSendStatus] = useState(false);
  const [btnLoader, setBtnLoader] = useState({ otp: false, formSubmit: false });

  // 🖼️ Image states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nationsDocImg, setNationsDocImg] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = () => { fileInputRef.current?.click(); };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const sendOtp = async () => {
    try {
      setBtnLoader(prev => ({ ...prev, otp: true }));
      await sendProfileUpdateOtp();
      toast.success('OTP sent to your email.');
      setOtpSendStatus(true);
    } catch {
      toast.error('Failed to send OTP.');
    } finally {
      setBtnLoader(prev => ({ ...prev, otp: false }));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setBtnLoader((prev) => ({ ...prev, formSubmit: true }));
      const formData = new FormData();

      // Append normal text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "nationalDoc") formData.append(key, value);
      });

      // Append cropped profile image (if any)
      if (profileImage?.startsWith("data:image")) {
        const blob = await fetch(profileImage).then((res) => res.blob());
        formData.append("profileImage", blob, "profile.jpg");
      }

      // Append National Document image in binary form
      if (nationsDocImg?.startsWith("data:image")) {
        const blob = await fetch(nationsDocImg).then((res) => res.blob());
        formData.append("nationalDoc", blob, "nationalDoc.jpg");
      }

      await updateCustomerProfile(formData);
      toast.success("Profile updated successfully!");
      reset();
      router.push("/user/profile");
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Failed to update profile.";
      toast.error(message);
    } finally {
      setBtnLoader((prev) => ({ ...prev, formSubmit: false }));
    }
  };


  return (
    <div className="flex min-h-full w-full justify-center px-4">
      <div className="flex w-full flex-col items-center">
        <div className="formwrapper py-7 w-full">
          <div className='flex items-center justify-between relative'>

            <div>

              <PageTitle title="Edit Profile" />
              <p className='text-[9px]'>Update Your Personal Information</p>
            </div>

            <Image src="/images/profile-cardicon.png" width={150} height={150} alt='' className='absolute right-0 -top-12' />
          </div>

          <div className=' mt-5  rounded-2xl   bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee]   p-[15px]   '>

            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-5">
              {/* 🖼️ Profile Image Upload */}
              <div className="mb-4 flex items-center justify-center flex-col ">
                {profileImage || defaultValues.profileimage ? (

                  <img
                    src={
                      profileImage ||
                      `${UPLOAD_PATH_URL}${defaultValues.profileimage}`
                    }
                    alt="Profile Preview"
                    width={100}
                    height={100}
                    className="rounded-full object-cover mb-2 cursor-pointer border border-[#a56ee9] shadow-[0_0_20px_rgba(124,86,255,0.4)]"
                    onClick={triggerFileInput}
                  />
                ) : (
                  <div
                    className="w-[100px] h-[100px] mb-2 cursor-pointer "
                    onClick={triggerFileInput}
                  >
                    {/* 👇 Replace with your Avatar component */}
                    <Avatar image={defaultValues.profileimage} size={100} />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className='text-[9px] text-white'>Click on the image to upload the profile photo</p>
              </div>
              {showCropper && selectedImage && (
                <ImageCropper
                  image={selectedImage}
                  onCancel={() => setShowCropper(false)}
                  onCropComplete={(cropped) => {
                    setProfileImage(cropped);
                    // setNationsDocImg(cropped);
                    setShowCropper(false);
                  }}
                />
              )}
              <div className='flex items-center gap-4'>
                <div className='relative'>

                  <TextInput
                    label="First Name"
                    name="firstname"
                    placeholder="Enter first name"
                    register={register}
                    error={errors.firstname}
                    icon
                  />
                  <Image src="/images/usericon-outline.png" width={25} height={25} alt='' className='absolute top-[24px] left-[15px] -translate-y-1/2 z-2' />
                </div>
                <div className="relative">
                  <TextInput
                    label="Last Name"
                    name="lastname"
                    placeholder="Enter last name"
                    register={register}
                    error={errors.lastname}
                    icon
                  />
                  <Image src="/images/usericon-outline.png" width={25} height={25} alt='' className='absolute top-[24px] left-[15px] -translate-y-1/2 z-2' />
                </div>
              </div>
              {/* Phone with country code */}
              {/* <Controller
              name="phone"
              control={control as any}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country="in"
                  onChange={field.onChange}
                  inputClass="countrycodeinput !w-full !py-7  !pl-12 !pr-2 "
                  containerClass="!w-full"
                  placeholder="Enter phone number"
                />
              )}
            /> */}
              <div className='relative'>
                <PhoneNumberInput
                  name="phone"
                  control={control as Control<any>}
                  error={errors.phone}
                  placeholder="Enter phone number"
                />
                <Image src="/images/phoneicon.png" width={25} height={25} alt='' className='absolute top-[24px] left-[15px] -translate-y-1/2 z-2' />
              </div>
              <div className='relative'>
                <TextInput
                  label="DOB"
                  type="date"
                  name="dateOfBirth"
                  placeholder="Enter date of birth"
                  register={register}
                  error={errors.dateOfBirth}
                  icon
                />
                <Image src="/images/calandericon.png" width={25} height={25} alt='' className='absolute top-[24px] left-[15px] -translate-y-1/2 z-2' />
              </div>

              {/* <TextInput
              label="Enter National Id No."
              name="nationalId"
              type="number"
              placeholder="Enter National Id No."
              register={register}
              error={errors.nationalId}
            /> */}
              {/* <div className="mb-4">
              <label className="text-white block mb-2">
                Upload National ID
              </label>
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setNationsDocImg(reader.result as string);
                    setValue("nationalDoc", reader.result as string); // update react-hook-form value
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-white border border-[#9a4cee] p-2 rounded-[12px] h-14"
              />

              {(nationsDocImg || defaultValues?.nationalDoc) && (
                <Image
                  src={
                    nationsDocImg ||
                    `${UPLOAD_PATH_URL}/docs/${defaultValues.nationalDoc}`
                  }
                  alt="National Doc Preview"
                  width={120}
                  height={80}
                  className="rounded mt-2 border border-gray-500"
                />
              )}
            </div> */}

              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
              {/* <div className="relative mt-4">
              <FaPaste
                className="absolute text-[18px] right-4 z-10 -top-[3.5rem] text-white cursor-pointer"
                onClick={async () => {
                  try {
                    const clipboardText = await navigator.clipboard.readText();
                    setValue("walletaddress", clipboardText);
                    toast.success("Pasted from clipboard!");
                  } catch (error) {
                    toast.error("Failed to read clipboard.");
                    console.error(error);
                  }
                }}
              /> */}
              {/* <TextInput
                label="Wallet Address"
                name="walletaddress"
                placeholder="Enter wallet address"
                register={register}
                error={errors.walletaddress}
              /> */}
              {/* </div> */}

              {otpSendStatus && (
                <TextInput
                  label="OTP"
                  name="otp"
                  type="number"
                  placeholder="Enter OTP"
                  register={register}
                  error={errors.otp}
                />
              )}
              {otpSendStatus && (
                <Button
                  text="Update"
                  btnStyle="btn-normal"
                  type="submit"
                  className="w-full"
                  isLoading={btnLoader.formSubmit}
                />
              )}
              <ResendOtpButton onResend={sendOtp} isLoading={btnLoader.otp} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfile = () => {
  const { data, isLoading } = useFetchAuthprofile();

  return isLoading ? (
    <Loader />
  ) : (
    <EditForm
      defaultValues={{
        firstname: data?.data?.firstName || "",
        nationalDoc: data?.data?.nationalDoc || "",
        lastname: data?.data?.lastName || "",
        emailAddress: data?.data?.emailAddress || "",
        nationalId: data?.data?.nationalId || "",
        phone: data?.data?.phoneNumber || "",
        dateOfBirth: moment(data?.data?.dateOfBirth).format("YYYY-MM-DD") || "",
        walletaddress: data?.data?.walletAddress || "",
        profileimage: data?.data?.profileimage || "",


        otp: "",
      }}
    />
  );
};

export default EditProfile;
