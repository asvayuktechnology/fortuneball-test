import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
// import Profile from '@/components/profile/Profile'
import Transaction from '@/components/transaction/Transaction'
export default function Page() {
  return (
    <HomeLayout>
      <Transaction />
    </HomeLayout>
  )
}