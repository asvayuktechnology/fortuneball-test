import React from 'react'
import GainLossListCard from "@/components/cards/GainLossListCard"
import { StaticImageData } from 'next/image';

type Props = {
    data: {
        logoUrl?: string | StaticImageData;
        symbol: string;
        volume: number;
        price: number;
        changePercent: number;
    }[]
};
const NotFounRow = () => {
    return (
        <div className='w-full flex items-center justify-center py-6 text-white'>
            <span>No records</span>
        </div>
    )
}
export default function CoinListTable(props: Props) {
    const { data } = props;
    const isPostive = (price: number): boolean => price < 0 ? false : true;
    return (
        <div className='mb-16'>
            <div className="listhead mb-2 flex justify-between items-center text-slate-300">
                <div className="flex items-center space-x-5 w-full md:w-1/2 mb-0 ">
                    <div className='text-[11px] '>

                        Name
                    </div>
                    <div className='text-[11px] '>
                        Volume
                    </div>
                </div>
                <div className="flex justify-end items-center w-full md:w-1/2 space-x-9 mb-0 ">
                    <div className="text-[11px] font-medum ">
                        Price
                    </div>
                    <span className=' text-[11px] pr-6' >
                        24h
                    </span>
                </div>
            </div>
            {data?.length > 1 ? data?.map((coin, key) => {
                return (
                    <GainLossListCard
                        key={key}
                        logoUrl={coin?.logoUrl}
                        symbol={coin?.symbol}
                        volume={coin?.volume}
                        price={coin?.price}
                        changePercent={coin?.changePercent}
                        isPositive={isPostive(coin?.changePercent)}
                    />
                )
            }) : <NotFounRow />}
        </div>
    )
}
