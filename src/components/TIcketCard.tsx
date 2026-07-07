"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useFetchActiveBid, useFetchTicket } from "@/services/ticket";
import { colorBalls } from "@/utils/constant";
import { dateTimeFormat, getCountdown } from "@/utils";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type TabType = "All" | "Active" | "History";

const TicketCard = () => {
  const auth = useAuth();
  const isLoggedIn = auth?.isLoggedIn ?? false;

  const [activeTab, setActiveTab] =
    useState<TabType>("All");

  const [timeLeft, setTimeLeft] = useState("");
  const { data: bidData } = useFetchActiveBid();

  useEffect(() => {
    if (!bidData?.data?.drawTime) return;

    const interval = setInterval(() => {
      setTimeLeft(getCountdown(bidData.data.drawTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [bidData]);


  /* -------------------------------------------------------------------------- */
  /*                                   STATUS                                   */
  /* -------------------------------------------------------------------------- */

  const status = useMemo(() => {
    if (activeTab === "Active") return "active";

    if (activeTab === "History") return "completed";

    return "";
  }, [activeTab]);

  /* -------------------------------------------------------------------------- */
  /*                                   API                                      */
  /* -------------------------------------------------------------------------- */

  const [page, setPage] = useState(1);

  const limit = 5;

  const { data, isLoading } = useFetchTicket(
    {
      page,
      limit,
      status,
    },
    { enabled: isLoggedIn }
  );

  const [allTickets, setAllTickets] = useState<any[]>([]);

  React.useEffect(() => {
    if (!isLoggedIn) {
      setAllTickets([]);
      return;
    }

    if (!data?.data) return;

    setAllTickets((prev) => {
      if (page === 1) {
        return data.data;
      }

      const existingIds = new Set(
        prev.map((item) => item._id)
      );

      const newTickets = data.data.filter(
        (item: any) => !existingIds.has(item._id)
      );

      return [...prev, ...newTickets];
    });
  }, [data, page, isLoggedIn]);

  const totalPages =
    (data as any)?.pagination?.totalPages ||
    (data as any)?.totalPages ||
    1;

  const hasMore =
    data?.data?.length === limit ||
    page < totalPages;

  /* -------------------------------------------------------------------------- */
  /*                              GET BALL IMAGE                                */
  /* -------------------------------------------------------------------------- */

  const getBallImage = (digit: string) => {
    return (
      colorBalls.find(
        (ball) => ball.digit.toString() === digit
      )?.color || "/images/gray-ball.svg"
    );
  };

  return (
    <div className="flex items-start justify-center  px-[24px] min-h-screen">
      <div className="w-full max-w-sm text-white">
        {/* Heading */}
        <h1 className="text-lg font-bold text-center mb-[30px]">
          My Tickets
        </h1>

        {/* Tabs */}
        <div className="flex justify-between text-sm font-semibold border-b border-white/30 mb-5">
          {["All", "Active", "History"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as TabType);
                setPage(1);
              }}
              className={`pb-3 w-full transition cursor-pointer ${activeTab === tab
                ? "text-white border-b-2 border-white"
                : "text-white/50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {!isLoggedIn && (
          <div className="rounded-2xl bg-white/10 px-5 py-10 text-center">
            <p className="text-sm font-semibold text-white">
              Login to view your tickets
            </p>
            <p className="mt-2 text-xs text-white/70">
              Sign in to see your purchased tickets, active draws, and history.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#4B239B] shadow-md transition hover:scale-105"
            >
              Login
            </Link>
          </div>
        )}

        {isLoggedIn && isLoading && (
          <div className="text-center py-10">
            Loading tickets...
          </div>
        )}

        {isLoggedIn && !isLoading && allTickets.length === 0 && (
          <div className="text-center py-10">
            No tickets found
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          <div className="rounded-[18px] border border-[#9a4cee] bg-[#17003d]/95 p-3 py-[16px] shadow-[0_0_40px_rgba(124,86,255,0.25)]">
            {isLoggedIn &&
              !isLoading &&

              allTickets.map((ticket: any, index: number) => {
                const balls = ticket?.ticketNumber?.split("") || [];

                return (
                  <div
                    key={ticket._id}
                    className={`flex items-center justify-between py-5 ${index !== allTickets.length - 1
                      ? "border-b border-[#7c56ff]/30"
                      : ""
                      }`}
                  >
                    {/* LEFT TICKET */}
                    <div className="flex-shrink-0 px-1">
                      <img
                        src="/images/ticketthumb.png"
                        alt="ticket"
                        className="w-[65px] object-contain"
                      />
                    </div>

                    {/* CENTER */}
                    <div className="flex-1 px-4 border-l border-r border-dashed border-[#7c56ff]/65">
                      <h3 className="text-white font-bold text-[14px] leading-none">
                        Draw {ticket?.bidId?.bidNo}
                      </h3>

                      <p className="text-[#c8baf9] text-[10px] mt-1">
                        {dateTimeFormat(ticket?.createdAt)}
                      </p>

                      <div className="flex items-center gap-1.5 mt-0 flex-wrap">
                        {balls.map((digit: string, idx: number) => {
                          const ballData = colorBalls.find(
                            (ball) => ball.digit.toString() === digit
                          );

                          return (
                            <div
                              key={idx}
                              className="relative h-6 w-6"
                            >
                              <img
                                src={
                                  ballData?.color ||
                                  "/images/yellow-ball.svg"
                                }
                                alt=""
                                className="h-9 w-9 object-contain"
                              />

                              {/* <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white">
                              {digit}
                            </span> */}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="min-w-[50px] pl-4 ">
                      <h4 className="text-white text-[13px] font-bold">
                        {ticket?.ticketPrice || 0} USDT
                      </h4>

                      <p className="text-[#c8baf9] text-xs mt-3">
                        Status
                      </p>

                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold mt-1 ${ticket?.status === "active"
                          ? "bg-[#083f4c] text-[#44ffd1]"
                          : "bg-[#3a3a3a] text-white"
                          }`}
                      >
                        {ticket?.status}
                      </div>

                      {ticket?.isWinner && (
                        <div className="mt-2">
                          <div className="inline-flex rounded-full bg-[#FEDB1E] px-3 py-1 text-[11px] font-bold text-black">
                            Winner
                          </div>

                          <p className="text-[#FEDB1E] font-bold text-sm mt-1">
                            +{ticket?.prizeAmount} MTHT
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            }

            {/* Load More */}
            {isLoggedIn && !isLoading && hasMore && (
              <div className="flex justify-center pt-4 border-t border-[#2f1a65]">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="h-10 w-10 rounded-full bg-[#57356f] border border-[#795190]  flex items-center justify-center cursor-pointer"
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
              </div>
            )}
          </div>
        </div>

        <div className="mt-[18px] rounded-[18px] relative overflow-hidden border border-[#9a4cee] bg-[#17003d]/95 p-5 shadow-[0_0_40px_rgba(124,86,255,0.2)]">
         <div className="bg-[#5b0682] absolute -top-1/2 left-6 w-28 h-28 blur-xl z-0 rounded-full"/>
          <div className="flex items-center justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-center gap-4 relative z-2">
              <div className="flex flex-1 h-16 w-16 items-center justify-center ">
               
                <img
                  src="/images/calendericon.png"
                  alt="countdown"
                  className="h-full w-full object-contain z-1"
                />
              </div>

              <div>
                <p className="text-[10px] text-[#c7bfff]">
                  Live Draw Countdown
                </p>

                <h3 className="mt-1 text-[14px] font-bold text-white leading-none">
                  {timeLeft || "✨ Stay Tuned"}
                </h3>
              </div>
            </div>

            {/* BUTTON */}
            <Link
              href={`/purchase`}
              className="
              whitespace-nowrap
              rounded-xl
              border
              border-[#a56ee9]
              bg-[linear-gradient(180deg,#560480_0%,#27035b_100%)]
              px-6
              py-3
              text-[10px]
              font-semibold
              text-white
              shadow-[0_0_20px_rgba(124,86,255,0.4)]
              transition
              hover:scale-105
              max-w-[125px]
            "
                  >
              View Live Draw
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;