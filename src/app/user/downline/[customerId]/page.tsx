import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import DownlineList from '@/components/downlines/downlineList';

export default async function Page(props: {
  params: Promise<{ customerId: string }>;
}) {
  const params = await props.params;
  const { customerId } = params;


  return (
    <main>
      <HomeLayout>
        <DownlineList custId={customerId} />
      </HomeLayout>
    </main>
  );
}
