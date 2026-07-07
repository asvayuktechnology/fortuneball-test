
import React from 'react';
import ResetForm from '@/components/auth/ResetPassword';
import HomeLayout from '@/components/layouts/HomeLayout';

export default async function ResetPasswordPage(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const { token } = params;


  return (
    <main>
       <HomeLayout>
      <ResetForm tokenId={token} />
    </HomeLayout>
    </main>
  );
}
