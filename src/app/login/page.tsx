"use client"
import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import Login from '@/components/auth/Login'
export default function Page() {
  return (
    <HomeLayout>
      <Login />
    </HomeLayout>
  )
}
