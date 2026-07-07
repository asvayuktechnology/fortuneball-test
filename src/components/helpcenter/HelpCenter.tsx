"use client"
import React, { useEffect, useState } from 'react'
import PageTitle from '../ui/common/pagetitle/PageTitle'
import SelectInput from '../ui/common/input/Select'
import TextAreaInput from '../ui/common/input/TextAreaInput'
import Button from '../ui/common/input/Button'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import ImageUploader from '../ui/common/ImageUploader';
import { useSendHelpRequest } from "@/services/helpCenterService";
import HelpRequestList from './HelpCenterList';
import { helpCenterCategories } from '@/config/helpCenterOptions';

const validationSchema = z.object({
    category: z.string().min(1, 'Please select category.'),
    subcategory: z.string().min(1, 'PLease selecet subject category.'),
    message: z.string().min(1, 'Please type a message.'),
})

type Formdata = z.infer<typeof validationSchema>;


const HelpCenter = () => {
    const [subcategories, setSubcategories] = useState<{ label: string, value: string }[]>([]);
    const [refreshHelpList, setRefreshHelpList] = useState(1);
    const [image, setImage] = useState<any | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<Formdata>({
        resolver: zodResolver(validationSchema),
    });
    const SelcetedCategory = watch('category');
    const onSuccess = () => {
        toast.success('help request sended successfully.');
        reset();
        setRefreshHelpList(ct => ct + 1)
    };

    const onError = (err: any) => {
        // console.log('error:', err);
        const message = err?.response?.data?.message ?? "Help request send failed. Please try again."
        toast.error(message);
    };
    const { mutate, isPending } = useSendHelpRequest({ onError, onSuccess })
    const onSubmit = (value: Formdata) => mutate({ ...value, screenshot: image })
    const handdeFileChnage = (file: any) => setImage(file);
    const getSubcategories = () => {
        const category = helpCenterCategories.find(cat => cat.value === SelcetedCategory);
        setSubcategories(category ? category.subcategories : []);
    };
    useEffect(() => { getSubcategories() }, [watch('category')])
    return (
        <>
            <div className="container mx-auto mt-8 px-10">
                <div className='mb-4'>

                    <PageTitle title='Help Center' />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <SelectInput
                            name="category"
                            label="Select Category"
                            options={helpCenterCategories?.map(ct => ({ label: ct?.label, value: ct?.value }))}
                            register={register}
                            error={errors.category}
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="subcategory"
                            label="Select Sub Category"
                            options={subcategories}
                            register={register}
                            error={errors.subcategory}
                        />
                    </div>
                    <div>

                        <TextAreaInput
                            name='message'
                            label="Message"
                            register={register}
                            error={errors.message}
                        />
                    </div>
                    <div>

                        <div className='mb-1 text-[11px] text-white'>Upload</div>
                        <div className='bg-[#29292f] relative w-full min-h-28 rounded-md flex items-center justify-center p-4 mb-4  text-sm'>
                            <ImageUploader handdleImageSelect={handdeFileChnage} />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            text="Submit Ticket"
                            className="w-full h-14 rounded-md bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700"
                            isLoading={isPending}
                        />
                    </div>
                </form>
                <div className='mt-12'>
                    {/* <PageTitle title='Help request list' /> */}
                    <h3 className='text-white text-[12px]'>{"Your Ticket(s)"}</h3>
                    <HelpRequestList refresh={refreshHelpList} />
                </div>
            </div>
        </>
    )
}

export default HelpCenter