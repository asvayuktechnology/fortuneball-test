// Tooltip.tsx
import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const HoverTooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-300 text-black text-[10px] px-3 py-1 rounded-xs whitespace-nowrap z-10">
                {text}
            </div>
        </div>
    );
};

export default HoverTooltip;
