// components/GainLossListCard.tsx

import Image, { StaticImageData } from 'next/image';
import React from 'react';
import {  IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';
import { formatAmountToMillions } from '@/utils';

interface GainLossListCardProps {
    logoUrl?: string | StaticImageData;
    symbol: string;
    volume: number;
    price: number;
    changePercent: number;
    isPositive?: boolean;
}

const GainLossListCard: React.FC<GainLossListCardProps> = ({
    logoUrl,
    symbol,
    volume,
    price,
    changePercent,
    isPositive = false,
}) => {
    const removeMinusSign = (num: number): number => {
        // console.log('num price:' , num);
        return Math.abs(num);
    }
    const filredPrice = isPositive ? price?.toFixed(2) : removeMinusSign(price)?.toFixed(2);
    return (
        <div className="w-full bg-[linear-gradient(90deg,rgba(79,128,164,0.17)_0%,rgba(148,182,207,0.15)_99%)] py-2 px-2 rounded-md  mb-2">

            <div className="flex justify-between items-center ">
                {/* Left Column */}
                <div className="flex items-center space-x-4 w-full md:w-1/2 mb-0 md:mb-0">
                    <Image
                        src={logoUrl && logoUrl !== '' ? logoUrl : '/images/coinicon.png'}
                        alt={`${symbol} logo`}
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                    <div>
                        <div className="text-sm font-meium text-slate-300">{symbol}</div>
                        <div className="text-slate-300 text-sm">{formatAmountToMillions(volume)}</div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex justify-end items-center w-full md:w-1/2 space-x-4 ">
                    <div className="text-sm font-medum text-slate-300">${price?.toFixed(2)}</div>
                    <span
                        className={` flex items-center gap-1 px-1 py-0.5 rounded-sm text-slate-300 text-[12px] ${isPositive ? 'bg-green-700' : 'bg-rose-700'
                            }`}
                    >
                        {isPositive ? <IoArrowUpOutline /> : <IoArrowDownOutline />} {isPositive ? changePercent?.toFixed(2) : removeMinusSign(changePercent)?.toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GainLossListCard;
