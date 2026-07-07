"use client"
import React, { useEffect } from 'react';
import useCookie from "@/hooks/useCookies";
import { useRouter } from 'next/navigation';
import Loader from '../ui/common/Loader';
type Props = {
    token: string;
}
export default function LoginWithToken(prop: Props) {
    const { token } = prop;
    const router = useRouter();
    const { setCookie } = useCookie<string>("authToken");
    const handdelSetToken = () => {
        setCookie(token, {
            expires: 7,
            secure: false,
            sameSite: "strict",
        });
        router.push("/user/dashboard");
    };
    useEffect(() => {
        handdelSetToken()
    }, [])
    return (
        <Loader />
    )
}
