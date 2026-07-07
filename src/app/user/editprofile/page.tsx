import React from 'react'
import HomeLayout from '@/components/layouts/HomeLayout'
// import EditProfile from '@/components/profile/EditProfile'
import Tabs from '@/components/tabs/Tabs'
import EditProfile from '@/components/profile/EditProfile'
import ChangePassword from '@/components/profile/ChangePassword';
export default function Page() {

  const tabData = [
    {
      label: `Edit Profile`,
      content: <EditProfile />,
      typeValue: -1
    },
    {
      label: "Change Password ",
      content: <ChangePassword />,
      typeValue: 0
    }
  ];
  return (
    <HomeLayout>
      <div className='mt-8 max-w-md mx-auto'>

        <Tabs tabs={tabData} />
      </div>
    </HomeLayout>
  )
}
