import React, { Children } from 'react';
import Link from 'next/link';
import HomeLayout from '@/components/layouts/HomeLayout';
const ComingSoon = ({ children }: { children: any }) => {
    return (
        <HomeLayout>
            
            <div className="innerwrapper  text-white text-[16px] ">
                {children}
            </div>

        </HomeLayout>
    );
};

export default ComingSoon;
