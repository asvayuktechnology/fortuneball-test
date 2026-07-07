'use client';
import { useState } from 'react';

type TeamdetailCardProps = {
  customerId: string;
  count: number;
  name: string;
  level: number;
  email: string;
  phone: string;
  sponsor: string;
  joinDate: string;
  rank: string;
};

import { useFetchCustomerStaking } from '@/services/authService';
import Image from 'next/image';
import Link from 'next/link';
import { getRankDetails } from '@/utils';

const DownlineTeamCard: React.FC<TeamdetailCardProps> = ({
  customerId,
  count,
  name,
  level,
  email,
  phone,
  sponsor,
  joinDate,
  rank
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Only fetch when showTeamData is true
  const { data: stakingData, isLoading, isError } = useFetchCustomerStaking(
    showDetails ? customerId : undefined
  );

  // const handleViewTeam = () => {
  //   if (showDetails && showTeamData) {
  //     // If both are open, close both
  //     setShowDetails(false);
  //     setShowTeamData(false);
  //   } else {
  //     // Open both panels
  //     setShowDetails(true);
  //     setShowTeamData(true);
  //   }
  // };
  const rankDetails = rank ? getRankDetails(rank) : null;



    const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="border border-white/10 rounded-md mb-2 bg-[#2d1b69] text-white">
      <div className="grid grid-cols-2 px-4 py-2 cursor-pointer">
        <div>
          <span className="inline-block w-6 h-6 bg-white rounded-full content-center text-[#08155e] font-bold text-[14px] text-center  mr-3">
            {count}
          </span>
          <span 
            className='text-[12px] font-bold' 
            onClick={toggleDetails}
          >
            {name}
          </span>
        </div>
        {/* <div className='md:text-center text-center'>
          <span className="text-[12px] px-3">{rank}</span>
        </div> */}
        {/* <div className='text-center'>
          
        </div> */}
        <div className='text-end'>
          <Link href={`/user/downline/${customerId}`}>
            <span className=" bg-white text-[#08155e] rounded-full font-bold text-[12px] px-3 py-1 "> View Team</span>
          </Link>
          <span className="text-[12px] px-3 py-1 rounded-sm font-bold ">
            Level: {level}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="relative py-3  text-[10px] text-white px-4   space-y-1 bg-[#2d1b69]">
          <div className="relative flex justify-between items-center">
            <div className="space-y-1">
                                {/* <div className="space-y-1 text-sm font-bold">
                    <div>Total Staking: {stakingData ? stakingData.data.totalActiveAmount : 0.00} USDT</div>
                  </div> */}
                            {rankDetails && (
                              <div className="absolute right-1 -top-2 text-center">
                                <Image
                                  src={rankDetails.image}
                                  alt={rankDetails.name}
                                  height={50}
                                  width={50}
                                />
                                {rankDetails.name}
                              </div>
                            )}
                  {/* <div className='absolute right-0 top-0 text-center'>
                          <Image className='mx-auto' src={"/images/rankbadge.png"} alt='' width={35} height={35}  />
                          Ambassador
                          </div> */}

              <div>Email: {email}</div>
              <div>Phone: {phone}</div>
              <div>Sponsor: {sponsor}</div>
              
               <div className="absolute right-4 bottom-3.5 bg-[#29292f] text-white/100 rounded-full px-2 py-.5">Join Date: {joinDate}</div>
            </div>
            

          </div>
        </div>
      )}
    </div>
  );
};

export default DownlineTeamCard;