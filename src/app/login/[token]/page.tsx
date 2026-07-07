
import React from 'react';
import LoginWithToken from '@/components/auth/LoginWithToken';
import HomeLayout from '@/components/layouts/HomeLayout';
export default async function SponserRegPage(props: {
    params: Promise<{ token: string }>;
}) {
    const params = await props.params;
    const { token } = params;
    return (
        <HomeLayout>
            <LoginWithToken token={token} />
        </HomeLayout>
    );
}
