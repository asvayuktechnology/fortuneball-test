import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import BlogCard from '@/components/cards/BlogCard'
export default function Page() {
  return (
    <HomeLayout>
      <BlogCard type='news' />
    </HomeLayout>
  )
}
