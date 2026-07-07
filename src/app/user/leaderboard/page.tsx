"use client";

import BannerSection from "@/components/home/BannerSection";
import { useFetchActiveBid, useFetchLatestBid } from "@/services/ticket";
import { dateFormat } from "@/utils";
import { colorBalls } from "@/utils/constant";
import Link from "next/link";
import { useEffect, useState } from "react";

const winners = [
  {
    name: "Haneesh Mohan",
    tickets: 50,
  },
  {
    name: "Rahul Sharma",
    tickets: 25,
  },
  {
    name: "Priya Singh",
    tickets: 100,
  },
  {
    name: "Ankit Verma",
    tickets: 75,
  },
  {
    name: "Vikram Patel",
    tickets: 30,
  },
  {
    name: "Aman Kumar",
    tickets: 45,
  },
  {
    name: "Sneha Gupta",
    tickets: 60,
  },
];


export default function LeaderboardPage() {
    const [timeLeft, setTimeLeft] = useState("");

    const { data: bidData, isLoading, error } = useFetchActiveBid();
  const { data: latestbidData, isLoading: latestLoading, error: latestBidError } = useFetchLatestBid();

  const latestDraw = latestbidData?.data;

  const winningDigits =
    latestDraw?.winningNumber?.split("") || [];



  return (
    <section className="mx-auto max-w-md">
      <BannerSection />
      <div className=" px-4">
        {/* Draw Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 font-semibold">
              Draw {latestDraw?.bidNo || "-"}{" "}
              {latestDraw?.drawDate
                ? dateFormat(latestDraw.drawDate)
                : "Date To Be Announced"}
            </p>

            <p className="mb-3 text-sm font-semibold text-white/70">
              Winning Numbers
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {winningDigits.map((digit, index) => {
                const ballData = colorBalls.find(
                  (ball) => ball.digit === Number(digit)
                );

                return (
                  <div
                    key={index}
                    className="transition hover:scale-110"
                  >
                    <div className="relative">
                      <img
                        src={ballData?.color?.trim() || "/images/blue-ball.svg"}
                        alt={`ball-${digit}`}
                        className="h-10 w-10 object-contain drop-shadow-lg"
                      />

                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white">
                        {digit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


        {/* CTA */}
        <div className="my-5">
          <p
            className="text-[#f9ca19] "
          >
            <Link
              href="/user/draw-result"
              className="mt-5 "
            >
              View Past Results
            </Link>
          </p>
        </div>
        </div>
           <div className=" flex flex-col items-start px-4 bottom-8 ">
                    <div className="w-full h-2 border-t border-gray-400"/>
                       <p className="text-white/80 text-center text-lg font-medium mt-2">
                    Draw {bidData?.data?.bidNo}{" "}
                    {bidData?.data?.drawDate
                      ? dateFormat(bidData.data.drawDate)
                      : "📅 Date To Be Announced"}
                  </p>
                    <div className=" inline-block rounded-full bg-[linear-gradient(180deg,rgba(111,20,188,1)_0%,rgba(193,133,240,1)_100%)] px-6 py-2 mt-1">
                      {isLoading ? (
                        <p className="text-[18px] font-bold text-white">
                          Loading...
                        </p>
                      ) : error ? (
                        <p className="text-[13px] font-medium text-white">
                          Draw info unavailable
                        </p>
                      ) : (
                        <p className=" text-[18px] font-bold text-white">
                          {timeLeft || "✨ Stay Tuned"}
                        </p>
                      )}
                    </div>
        
                
                  </div>

                   {/* Winners List */}
        <div className="px-5 pb-6 mt-6">
          <div className="space-y-2">
            {winners.map((winner, index) => (
              <div
                key={index}
                className="
                flex
                items-center
                gap-3
                rounded-full
                border
                border-[#FEDB1E]/70
                bg-[#2a165e]/60
                px-3
                py-2
                backdrop-blur-md
              "
              >
                <div className="h-5 w-5 rounded-full bg-white" />

                <p className="flex-1 text-sm text-white">
                  <span className="font-semibold text-[#FEDB1E]">
                    {winner.name}
                  </span>

                  <span className="ml-1 text-[#c7bfff]">
                    Purchased {winner.tickets} tickets
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}