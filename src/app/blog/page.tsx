import React from 'react'
import ComingSoon from '@/components/ui/common/ComingSoon'
import HomeLayout from '@/components/layouts/HomeLayout'
import BlogCard from '@/components/cards/BlogCard'
export default function Page() {
  return (
    <HomeLayout>
      <BlogCard type="blog" />
    </HomeLayout>
  );
}
