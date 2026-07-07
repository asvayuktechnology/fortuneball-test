import BannerSection from '@/components/home/BannerSection'
import HomeLayout from '@/components/layouts/HomeLayout'
import TicketCard from '@/components/TIcketCard'
import MyTicketsPage from '@/components/TIckets/MyTicketsPage'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <>
            <HomeLayout>
                <div className="flex items-start justify-between px-4 pt-4 relative max-w-md mx-auto">
                    <div className='bg-[radial-gradient(circle,rgba(217,12,192,1)_0%,rgba(255,255,255,0)_65%)] opacity-55 absolute top-[200px] left-1/2 -translate-1/2 -z-1 min-w-full min-h-[480px]' />
                    {/* LEFT LOGO AREA */}
                    <div className="flex-1 max-w-[70%]">
                        <img
                            src="/images/fball.png"
                            alt="Powerball"
                            className="w-full object-contain"
                        />

                        {/* <img
                            src="/images/win2000x_animated.gif"
                            alt="Win2000x"
                            className="-mt-20 md:-mt-20 w-full object-contain "
                        /> */}
                    </div>

                    {/* RIGHT BUTTON */}
                    <div className="ml-3 pt-2">
                        <Link
                            href="/purchase"
                            className=" 
        flex
        items-center
        gap-2
        rounded-full
        border
        border-[#8f66ff]
        bg-[linear-gradient(45deg,#55009c_0%,#18024d_100%)]
        px-3
        py-2.5
        text-white
        
        shadow-[0_0_20px_rgba(124,86,255,.45)]
        whitespace-nowrap
      "
                        >
                            <span className="text-2xl leading-none">+</span>
                            <span className="text-xs font-semibold">Buy Tickets</span>
                        </Link>
                    </div>
                </div>
                <MyTicketsPage />
            </HomeLayout>
        </>
    )
}

export default page