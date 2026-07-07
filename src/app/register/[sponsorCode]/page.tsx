// app/register/[sponsorCode]/page.tsx

import Register from '@/components/auth/Register';
import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import RegisterBasicForm from '@/components/auth/RegisterBasic';

export default async function SponserRegPage(props: {
  params: Promise<{ sponsorCode: string }>;
}) {
  const params = await props.params;
  const { sponsorCode } = params;


  return (
    <main>
      <HomeLayout>
        <RegisterBasicForm sponsorCode={sponsorCode} isReadOnly={true} />
      </HomeLayout>
    </main>
  );
}
