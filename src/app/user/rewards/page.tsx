import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import Profile from '@/components/profile/Profile'
import Rewards from '@/components/Rewards'
export default function Page() {
  return (
    <HomeLayout>
      <Rewards />
    </HomeLayout>
  )
}