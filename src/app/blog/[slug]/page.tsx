import React from 'react';
import HomeLayout from '@/components/layouts/HomeLayout';
import BlogDetails from '@/components/blog/BlogDetails';
export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;


  return (
    <main>
      <HomeLayout>
        <BlogDetails slug={slug} />
      </HomeLayout>
    </main>
  );
}
