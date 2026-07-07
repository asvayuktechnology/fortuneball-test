import Image from 'next/image';
import React from 'react';
// import Button from '../ui/common/input/Button';
import { DepositPackage } from "@/types/customer";
import { Logo, mthtImage } from '@/config/constants';
interface StakingCardProps {
  logoUrl?: string;
  companyName?: string;
  status: string;
  amount: number | string;
  date: string;
  time: string;
}

type StakingPackageCardProps = DepositPackage & {
  handdePurchnage: (packageId: string) => void;
};

const StakingCard: React.FC<StakingCardProps> = ({
  logoUrl,
  status,
  amount,
  date,
  time,
}) => {
  return (
    <div className="bg-[#29292f] text-white p-4 pr-2 pt-8 rounded-md relative">
      {/* Status badge in top-right corner */}
      <div className="absolute top-2 right-2 bg-[#FFC428] text-black text-[11px] font-medium px-2 py-1 rounded-md">
        {status}
      </div>

      <div className="flex items-center justify-between mt-3 mb-1">
        <div className="stakename gap-.5 leading-4">
          <p className="text-[12px]">Total active</p>
          <p className="text-[12px]">Staking Amount</p>
        </div>

        <div className="text-end">
          <div className="stakingamt text-lg font-medium self-end tracking-wider leading-4 mb-2">
            ${amount} USDT
          </div>
          <div className="stakingamt text-[11px] font-medium self-end tracking-wider mt-2 text-gray-300 flex justify-end gap-4">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StakingPackageCard: React.FC<StakingPackageCardProps> = (props: StakingPackageCardProps) => {
  return (
    <div className="bg-[#29292f] text-white p-4  pr-1 rounded-md relative">
      <div className="flex items-center justify-between mt-3 mb-1">
        <div className="stakename flex items-center gap-2">
          <h6>Total active   </h6>
          <h6>Staking Amount  </h6>
        
          <span className="text-lg text-white">{props?.packageName}</span>
        </div>
        <div className="text-end">
          <div onClick={props?.handdePurchnage ? () => props?.handdePurchnage(props?._id) : () => { }} className="status p-0.5 px-4  text-xs bg-teal-500 rounded-full mb-2 w-fit ms-auto absolute top-1 right-4 cursor-pointer">
            Purchase
          </div>
          <div className="stakingamt text-2xl font-medium self-end tracking-wider">
            {props?.depositAmount}
          </div>
          <div className="stakingamt text-2xl font-medium self-end tracking-wider">
            {props?.depositAmount}
          </div>
          <div className="datentime flex items-center gap-10 absolute bottom-0.5 right-5">
            <div className="text-xs date">Daily reward {props?.dailyReward}</div>
            <div className="text-xs time">Maximum reward expiryDays {props?.maximumRewardExpiryDays}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StakingCard;
