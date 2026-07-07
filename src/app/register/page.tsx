import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
import RegisterBasicForm from '@/components/auth/RegisterBasic'
export default function Page() {
  return (
    <HomeLayout>
          <RegisterBasicForm sponsorCode='' isReadOnly={false} />
    </HomeLayout>
  )
}
