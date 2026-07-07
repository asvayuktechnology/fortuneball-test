"use client";
import { useEffect, useState } from "react";
import { UserInfo } from "./UserInfo";
import {
  useFetchAuthprofile,
  useFetchCustomerList,
} from "@/services/authService";
import { DownlineApiParams } from "@/types/auth/";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "../ui/common/Loader";
import TeamdetailCard from "../cards/TeamdetailCard";
import Button from "../ui/common/input/Button";
import { dateTimeFormat } from "@/utils";
import { useFetchCustomerWallet } from "@/services/customerService";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Profile() {
  const [params, setParams] = useState<DownlineApiParams>({
    name: "",
    email: "",
    level: "",
    page: 1,
    limit: 5,
  });
  const debouncedQuery = useDebounce(params, 500);
  const { data: userData, isLoading, refetch } = useFetchAuthprofile();
  const {
    data: teamList,
    isLoading: isLoadingTeamList,
    refetch: refetchTeamList,
  } = useFetchCustomerList(debouncedQuery);
  const { data: userWallet, refetch: refetchWallet } = useFetchCustomerWallet();

  // const handdePageChange = (page: number) => setParams(current => ({ ...current, page }))
  // console.log('teamList', teamList)
  const handdleSearch = (name: string) =>
    setParams((current) => ({ ...current, name }));
  const handdeLabelChnage = (level: string) =>
    setParams((current) => ({ ...current, level }));
  const handdeLoadMore = (limit: number) =>
    setParams((current) => ({ ...current, limit }));
  useEffect(() => {
    refetch();
    refetchWallet();
  }, []);
  useEffect(() => {
    refetchTeamList();
  }, [debouncedQuery]);
  // console.log("teamlist", teamList?.data)
  const [expandedMember, setExpandedMember] = useState<string | number | null>(null);

  const toggleMember = (id: string | number) => {
    setExpandedMember((prev) => (prev === id ? null : id));
  };
  return (
    <>
      <div className="max-w-md mx-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <UserInfo
            data={userData?.data}
            userWallet={
              userWallet ?? {
                mainbalance: 0,
                mainbalanceamount: 0,
                todayStakingReward: 0,
                lastmonthstaking: 0,
                stakingwallet: 0,
                todayAffiliateReward: 0,
                lastmonthaffiliate: 0,
                affiliatewallet: 0,
                communityusers: 0,
                totalholding: 0,
                alltimestaking: 0,
                alltimeaffiliate: 0,
              }
            }
            totalDownline={teamList && teamList?.totalCount}
          />
        )}
        {/* Team Section */}
        <div className="mx-[24px] rounded-2xl bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee] p-5 ">
          <div className="row mb-[16px]">
            <div className="col-12 mb-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-white">
                  My Community
                </h2>

                <select
                  className="
      bg-transparent
      text-white/80
      text-[8px]
      outline-none
      cursor-pointer
    "
                  onChange={(e) => handdeLabelChnage(e.target.value)}
                >
                  <option value="">All Levels</option>

                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1} className="bg-[#2b0d63]">
                      L{i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter Inputs */}
          <div className="mb-7">
            <div className="flex items-center gap-[5px] rounded-xl bg-transparent p-1">
              <svg
                className="h-5 w-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search member by name or email..."
                onChange={(e) => handdleSearch(e.target.value)}
                className="
        w-full
        bg-transparent
        text-white
        placeholder:text-white/40
        outline-none
        text-[8px]
      "
              />
            </div>
          </div>
          <div className="">
            <div
              className="
   
    border-b
    border-[#5b25a8]
    pb-1.5
    text-[#b76eff]
    text-[8px]
    font-medium
    flex
    justify-between
    px-1
    
  "
            >
              <p>User</p>
              <p className="text-right">Level</p>
              {/* <p >Reg. Date</p> */}
              {/* <p className="text-right">Sponsor</p> */}
            </div>
            <div className="">
              {isLoadingTeamList ? (
                <Loader />
              ) : (
                teamList?.data?.map((dt: any, index: number) => (
                  <div key={index} onClick={() => toggleMember(dt.customerId)}>
                    <div
                      className={`
   
    items-center
    border
    border-[#44207f]
    border-t-0
    flex
    justify-between
    py-2
    px-1
    text-white
    cursor-pointer
    ${expandedMember === dt.customerId ? "border-1 border-b-0 border-x-[#5b25a8] " : "border-x-transparent"}
  `}
                    >

                      {/* USER */}
                      <div>
                        <p className="text-[8px] font-medium">
                          {dt.firstName} {dt.lastName}
                        </p>

                        {/* <p
                          title={dt.emailAddress}
                          className="line-clamp-2 break-all text-[8px] leading-[12px] text-white/60 pr-3"
                        >
                          {dt.emailAddress}
                        </p> */}
                      </div>

                      {/* LEVEL */}
        <p
  className={`
    justify-self-end
    pr-2
    
    text-[8px] font-semibold text-[#c260ee] 
    cursor-pointer hover:text-[#f3c14d] transition-colors
    ${dt.level === 1 ? "text-cyan-400" : ""}
    ${dt.level === 2 ? "text-blue-400" : ""}
    ${dt.level === 3 ? "text-purple-400" : ""}
  `}
>
  L{dt.level}
</p>

                      {/* DATE */}
                      {/* <p className=" text-[8px] text-white/80">
                        {new Date(dt.joinDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p> */}
                      {/* SPONSOR */}
                      {/* <p

                        className="text-[8px] text-right text-[#c260ee] cursor-pointer hover:text-[#f3c14d] transition-colors"
                      >
                        {dt?.sponsor?.firstName || "-"}
                      </p> */}


                    </div>
                    {expandedMember === dt.customerId && (
                      <div className="col-span-4">
                        <div
                          className="
        relative
        mb-2
        border  border-[#5b25a8]
        bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)]
        px-2
        py-3
        text-[8px]
        text-white
      "
                        >
                          <div className="space-y-1 pr-20">
                            {/* <div className="text-[11px]">
                              <span className="text-[#c260ee] ">Total Staking :</span>{" "}
                              {dt?.stakingData?.totalActiveAmount ?? 0} USDT
                            </div>

                            <div>
                              <span className="text-[#c260ee]">Email :</span>{" "}
                              {dt.emailAddress}
                            </div>

                            <div>
                              <span className="text-[#c260ee]">Phone :</span>{" "}
                              {dt.phoneNumber}
                            </div> */}

                            <div>
                              <span className="text-[#c260ee]">Sponsor :</span>{" "}
                              {dt?.sponsor?.firstName || "-"}
                            </div>
                          </div>

                          {dt.rankimage && (
                            <div className="absolute right-4 top-4 text-center">
                              {/* <Image
            src={dt.rankimage}
            alt={dt.rank}
            width={42}
            height={42}
            className="mx-auto"
          /> */}

                              {/* <p className="mt-1 text-[8px]">
                                {dt.rank}
                              </p> */}
                            </div>
                          )}

                          <div
    
  className="
    inline-block
    rounded-full
    bg-[#5b25a8]
    px-3
    py-1
    text-[8px]
    text-white/80
    absolute right-4 top-2
  "
>
                       
                            Join Date :{" "}
                            {new Date(dt.joinDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                ))

              )}
            </div>
          </div>
          {teamList?.totalCount && teamList?.totalCount > params?.limit ? (
            <div className="text-center">
              <Button
                className="text-[8px] text-[#c260ee] hover:text-[#c260ee]  relative flex items-center justify-center mx-auto pt-4 pb-0"
                disableStyle
                text=""
                onClick={() => handdeLoadMore(params?.limit + 10)}
              >
                <span className="text-[#c260ee] group-hover:!text-white">
                  View All Members
                </span>{" "}
                <ChevronDown
                  className=" text-[#c260ee] group-hover:!text-white"
                  size={15}
                />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
