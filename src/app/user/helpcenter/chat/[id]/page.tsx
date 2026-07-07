import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import HelpChat from '@/components/helpcenter/HelpChat';


export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;


  return (
    <main>
      <HomeLayout>
        <HelpChat chatId={id} />
      </HomeLayout>
    </main>
  );
}
