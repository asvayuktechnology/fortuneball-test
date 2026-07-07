// app/register/[sponsorCode]/page.tsx

import Register from '@/components/auth/Register';
import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';

export default async function SponserRegPage(props: {
  params: Promise<{ tokenId: string }>;
}) {
  const params = await props.params;
  const { tokenId } = params;


  return (
    <main>
      <HomeLayout>
        <Register tokenId={tokenId} />
      </HomeLayout>
    </main>
  );
}
