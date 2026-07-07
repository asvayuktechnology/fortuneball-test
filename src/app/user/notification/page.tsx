"use client"
import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import NotificationList from '@/components/notification/NotificationList'
export default function Page() {
 return (
    <HomeLayout>
      <NotificationList/>
    </HomeLayout>
  )
}
