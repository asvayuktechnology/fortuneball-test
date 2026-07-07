"use client";
import { useState } from "react";

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
import { getRankDetails } from "@/utils";
import { useFetchCustomerStaking } from "@/services/authService";
import Link from "next/link";
import Image from "next/image";
const TeamdetailCard: React.FC<TeamdetailCardProps> = ({
  customerId,
  count,
  name,
  level,
  email,
  phone,
  sponsor,
  joinDate,
  rank,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Fetch staking data only when showDetails is true
  const {
    data: stakingData,
    isLoading,
    isError,
  } = useFetchCustomerStaking(showDetails ? customerId : undefined);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const rankDetails = rank ? getRankDetails(rank) : null;

  return (
    <div className="border border-white/10 rounded-md mb-2 bg-[#2d1b69]  text-white">
      <div className="grid grid-cols-2 px-4 py-2 cursor-pointer">
        <div className="">
          <span className="inline-block w-6 h-6 bg-white rounded-full content-center text-[#08155e] font-bold text-[14px] text-center  mr-3">
            {count}
          </span>

          <span className="text-[12px] font-bold" onClick={toggleDetails}>
            {name}
          </span>
        </div>
        <div className="text-end">
          <Link href={`/user/downline/${customerId}`}>
            <span className=" bg-white text-[#08155e] rounded-full font-bold text-[12px] px-3 py-1 ">
              {" "}
              View Team
            </span>
          </Link>
          <span className=" text-[12px] px-3 py-1 rounded-sm font-bold ">
            Level {level}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="relative py-3  text-[10px] text-white px-4   space-y-1 bg-[#2d1b69]">
          {/* <div className="text-sm font-bold my-2">
            Total Staking:{" "}
            {stakingData ? stakingData.data.totalActiveAmount : 0.0}{" "}
          </div> */}
          <div>Email : {email}</div>
          <div>Phone : {phone}</div>
          <div>Sponsor : {sponsor}</div>
          {rankDetails && (
            <div className="absolute right-4 top-8 text-center">
              <Image
               className='mx-auto'
                src={rankDetails.image}
                alt={rankDetails.name}
                height={35}
                width={35}
              />
              {rankDetails.name}
            </div>
          )}
          {/* <div className='absolute right-4 top-8 text-center'>
            <Image className='mx-auto' src={"/images/rankbadge.png"} alt='' width={35} height={35}  />
            Ambassador
            </div> */}
          <div className="absolute right-4 bottom-3.5 bg-[#2d1b69]  text-white/100 rounded-full px-2 py-.5">
            Join Date: {joinDate}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamdetailCard;
