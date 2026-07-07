import React from 'react'

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({title}) => {
    return (
        <div className="pagetitle  w-full">
            <h1 className='md:text-4xl text-lg font-medium sm:mb-2 mb-0.5 text-slate-200'>
                {title}
            </h1>
        </div>
    )
}

export default PageTitle