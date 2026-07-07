import React from 'react'
type Props = {
    content: string
}
export default function ToolTip({ content }: Props) {
    return (
        <div className='z-10 h-[100px] w-[300px] border-2 border-solid border-black bg-white'>
            <div className='relative left-4 top-[-11px] aspect-square w-[20px] rotate-45 border-l-2 border-t-2 border-solid border-black bg-white'></div>
            <div className=' m-2 overflow-y-auto'>
                <p className='text-left'>{content}</p>
            </div>
        </div>
    )
}
