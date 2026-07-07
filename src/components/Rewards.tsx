"use client";

import { useFetchAffiliateIncome } from "@/services/TransactionService";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Loader from "./ui/common/Loader";
const Rewards = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const { data, isLoading } = useFetchAffiliateIncome({
    page,
    limit,
  });
  useEffect(() => {
    if (!data?.transactions) return;

    setAllTransactions((prev) => {
      if (page === 1) {
        return data.transactions;
      }

      const existingIds = new Set(
        prev.map((item) => item._id)
      );

      const newTransactions = data.transactions.filter(
        (item: any) => !existingIds.has(item._id)
      );

      return [...prev, ...newTransactions];
    });
  }, [data, page]);
  const rewardStats = [
    {
      title: "Total Rewards",
      value: Number(data?.summary?.totalReward || 0).toFixed(2),
      unit: "MTHT",
      icon: "/images/total-rewards.svg",
    },
    {
      title: "Last 24h Rewards",
      value: Number(data?.summary?.last24HoursReward || 0).toFixed(2),
      unit: "MTHT",
      icon: "/images/onedayreward.svg",
    },
    {
      title: "Last 7 days Rewards",
      value: Number(data?.summary?.last7DaysReward || 0).toFixed(2),
      unit: "MTHT",
      icon: "/images/7dayreward.svg",
    },
    {
      title: "Last 30 days Rewards",
      value: Number(data?.summary?.last30DaysReward || 0).toFixed(2),
      unit: "MTHT",
      icon: "/images/30daysrewards.svg",
    },
  ];
  const rewardActivities = allTransactions.map((item) => ({
    id: item._id,
    name: item?.customerName || "Unknown",
    message: "Affiliate Reward Credited",
    amount: `+${Number(item.amount).toFixed(2)} MTHT`,
    time: moment(item.createdAt).fromNow(),
    avatar: "/images/person-icon.svg",
  }));
  const hasMore =
    allTransactions.length < (data?.totalCount || 0);
  return (
    <>

      <div className="mx-auto max-w-md px-[24px]">
        <div className="relative">
          <h1 className="my-4 text-center text-[21px] font-bold text-white">
            Rewards
          </h1>
        </div>
        <div className="mb-[20px]">
          <h6 className="text-[10px] text-[#c0becc] mb-[12px]">
            REWARDS OVERVIEW
          </h6>
          <div className="mt-[8px] grid grid-cols-2 gap-1.5">
            {rewardStats.map((item) => (
              <div
                key={item.title}
                className="
        rounded-2xl
        border border-[#9a4cee]
        bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)]
        py-[15px] px-[10px]
      "
              >
                <div className="flex items-center gap-3">
                  <Image
                    alt={item.title}
                    width={65}
                    height={55}
                    src={item.icon}
                    className="-ml-[4px] min-[400px]:w-[65px] w-[40px]"
                  />

                  <div className="min-w-0">
                    <p className="mb-[11px] text-[10px] leading-3 text-white/80 ">
                      {item.title}
                    </p>


                  </div>
                </div>
                <h3
                  className={`mb-0 text-[16px] md:text-[20px] font-bold text-[#ffc928] whitespace-normal break-words `}
                >
                  {item.value}
                </h3>

                <p className={`text-[10px] font-semibold text-white/80`}>
                  {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <h6 className="text-[10px] text-[#c0becc] mb-[12px]">
            MY AFFILIATION TRANSACTION
          </h6>
          {rewardActivities.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="
        flex items-center justify-between gap-3
        rounded-2xl
        border border-[#9a4cee]
        bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
        px-[15px] py-2
        shadow-[0_0_20px_rgba(124,86,255,0.15)]
      "
            >
              <div className="flex min-w-0 w-full items-center gap-3 sm:gap-5">
                {/* Avatar */}
                <Image
                  alt={item.name}
                  width={46}
                  height={46}
                  src={item.avatar}
                  className="shrink-0"
                />

                {/* Name + message */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[11px] font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="truncate text-[9px] text-white/60">
                    {item.message}
                  </p>
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  <h4 className="text-[11px] font-bold text-[#00ff2b]">
                    {item.amount}
                  </h4>
                </div>

                {/* Vertical divider */}
                <Image
                  alt=""
                  width={3}
                  height={36}
                  src="/images/hr.svg"
                  className="shrink-0"
                />

                {/* Time */}
                <div className="flex min-w-0 flex-col items-center">
                  <Image
                    alt="Time"
                    width={15}
                    height={15}
                    src="/images/time.svg"
                  />

                  <p className="mt-0.5 whitespace-normal break-words text-[8px] text-white">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center pt-4">
            {isLoading && page > 1 ? (
              <Loader />
            ) : (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="h-10 w-10 rounded-full bg-[#57356f] border border-[#795190] flex items-center justify-center m-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

    </>
  );
};

export default Rewards;
