"use client"
import React, { useState, ReactNode } from 'react';

type Tab = {
  label: string;
  content?: ReactNode;
};

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  handdetabChange?: (index: number) => void
}

const   Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, handdetabChange }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const setActivetab = (index: number) => {
    setActiveIndex(index)
    if (handdetabChange) handdetabChange(index)
  }
  return (
    <div>
      <div className="px-4 flex text-white pt-3 xl:overflow-x-hidden overflow-x-auto overflow-y-auto">
        <div className='xl:min-w-[850px] min-w-auto min-h-[37px]'>


          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActivetab(idx)}
              className={`text-[10px]    text-white  px-4 cursor-pointer py-2 border-b-2 font-medium text-sm transition-colors duration-500 rounded-md mb-2 ${activeIndex === idx
                ? 'border-[#a56ee9]   bg-[linear-gradient(180deg,#560480_0%,#27035b_100%)]   px-6   py-3     shadow-[0_0_20px_rgba(124,86,255,0.4)]'
                : 'border-transparent hover:text-slate-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">{tabs[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
