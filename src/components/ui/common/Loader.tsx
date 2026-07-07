import React from 'react'
import SpinnerLoader from './Spinner'
export default function Loader() {
    return (
        <div className='w-full min-h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4 text-white'>
                <SpinnerLoader />
                {/* <img src="/layerexsm.png" width={100} height={100} className='loadinganimate'/> */}
                <span className='text-[#ffc428]'>Please wait...</span>
            </div>
        </div>
    )
}
