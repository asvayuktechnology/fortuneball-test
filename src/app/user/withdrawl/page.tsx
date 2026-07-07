import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import Withdrawl from '@/components/withdrawl/Withdrawl'

export default function Page() {
  return (
    <HomeLayout>
      {/* <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-4xl text-white">Coming Soon......</h1>
      </div> */}
      <Withdrawl />
    </HomeLayout>
  )
}
