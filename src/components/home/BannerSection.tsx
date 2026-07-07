import Image from 'next/image'
import React from 'react'

const BannerSection = () => {
    return (
        <>
            <div className=" w-full pb-5 min-h-[425px] relative overflow-hidden">
                <div className='bg-[radial-gradient(circle,rgba(217,12,192,1)_0%,rgba(255,255,255,0)_75%)] z-0 w-full h-full absolute -top-15 -right-15 blur-3xl'/>
                <Image
                    src="/images/fball.png"
                    alt="banner"
                    className="h-[90%] w-[90%] object-cover mx-auto relative z-2"
                    width={500}
                    height={500}
                />
                

            </div>
        </>
    )
}

export default BannerSection