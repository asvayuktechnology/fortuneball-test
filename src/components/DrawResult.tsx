"use client";

import React, { useState, useCallback, useRef } from "react";
import { MdSearch, MdFilterAlt, MdRefresh, MdExpandMore } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { GiTrophyCup } from "react-icons/gi";
import { useFetchBidSummary, useFetchDrawResult, useFetchDrawResultById } from "@/services/ticket";
import { dateFormat, getMatchedNumbers, prizeLevelLabel } from "@/utils";
import { DrawRecord, GetAllDrawParams, Prize, PrizeBreakdown } from "@/types/ticket";
import CelebrationConfetti from "./CelebrationConfetti";
import Image from "next/image";
import { colorBalls, winningballs } from "@/utils/constant";
import PreviousDraws from "./PreviousDraws";
import WinningTicketsModal, { WinningTicket } from "./WinningTicketsModal";

const PAGE_SIZE = 5;

/* ─────────────────────────── helpers ─────────────────────────── */
function prizeColor(prize: string): string {
  const map: Record<string, string> = {
    "1st Prize": "from-yellow-400 to-yellow-600",
    "2nd Prize": "from-slate-300 to-slate-400",
    "3rd Prize": "from-amber-600 to-amber-700",
    "4th Prize": "from-[#7c56ff] to-[#4d2db8]",
    "5th Prize": "from-[#7c56ff] to-[#4d2db8]",
  };
  return map[prize] ?? "from-[#7c56ff] to-[#4d2db8]";
}

/* ─────────────────────────── sub-components ─────────────────────────── */
function WinningDigit({ ch }: { ch: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#7c56ff_0%,#4d2db8_100%)] text-sm font-bold text-white shadow-lg">
      {ch}
    </div>
  );
}

function PrizeBadge({ prize }: { prize: Prize }) {
  const gradient = prizeColor(prize.prize);
  return (
    <div
      className={`flex items-center justify-between rounded-xl bg-gradient-to-r ${gradient} px-3 py-1.5 shadow`}
    >
      <span className="text-[11px] font-semibold text-white/90 min-w-[64px]">
        {prize.prize}
      </span>
      <span className="mx-2 font-mono text-xs text-white/70 tracking-wider">
        {prize.winningNumber}
      </span>
      <span className="text-xs font-bold text-white whitespace-nowrap">
        ${prize.amount}
      </span>
    </div>
  );
}

function DrawCard({ draw }: { draw: DrawRecord }) {
  const [expanded, setExpanded] = useState(false);
  const digits = draw.winningNumber ? String(draw.winningNumber).split("") : [];
  const hasPrizes = draw.prizes.length > 0;

  return (
    <div
      id="jackpot"
      className="relative overflow-hidden rounded-[24px] border border-[#7c56ff]/25 bg-[linear-gradient(160deg,#3a2485_0%,#26155f_100%)] p-5 shadow-2xl flex flex-col gap-4"
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,214,78,0.18),transparent_55%)]" />

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest  text-white">
            Draw Number
          </p>
          <h3 className="text-lg font-bold text-white">{draw.bidNo}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-[#b8a7ef]">
            Draw Date
          </p>
          <p className="text-sm font-medium text-white">
            {dateFormat(draw.drawDate)}
          </p>
        </div>
      </div>

      {/* winning number */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-[#b8a7ef]">
          Winning Number
        </p>
        {digits.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap">
            {digits.map((ch, i) => (
              <WinningDigit key={i} ch={ch} />
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-[#b8a7ef]">Not announced yet</p>
        )}
      </div>

      {/* winners badge */}
      <div className="flex items-center gap-2">
        <GiTrophyCup className="text-yellow-400" size={16} />
        <span className="text-xs text-[#c7bfff]">
          {draw.totalWinners} Winner{draw.totalWinners !== 1 ? "s" : ""}
        </span>
      </div>

      {/* prizes */}
      {hasPrizes && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-[#7c56ff]/30 px-3 py-2 text-xs font-medium text-[#c7bfff] hover:border-[#7c56ff]/60 transition"
          >
            <span>View Prize Table ({draw.prizes.length} prizes)</span>
            <MdExpandMore
              size={18}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {expanded && (
            <div className="mt-2 flex flex-col gap-1.5">
              {draw.prizes.map((p, i) => (
                <PrizeBadge key={i} prize={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {!hasPrizes && (
        <p className="text-xs italic text-[#b8a7ef]">No prize data available</p>
      )}
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */
export default function DrawResult() {
  // filter state
  const [bidNo, setBidNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // applied params (only updated on Search click)
  const [appliedParams, setAppliedParams] = useState<
    Omit<GetAllDrawParams, "page" | "limit">
  >({});

  // pagination
  const [page, setPage] = useState(1);
  const [allDraws, setAllDraws] = useState<DrawRecord[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const didInitLoad = useRef(false);

  const params: GetAllDrawParams = {
    page,
    limit: PAGE_SIZE,
    ...appliedParams,
  };
  const jackpotRef = React.useRef<HTMLDivElement>(null);
  const { data, isFetching, refetch } = useFetchDrawResult(params, {
    enabled: true,
  });

  // Sync API data into accumulated list
  React.useEffect(() => {
    if (!data?.data) return;
    const incoming: DrawRecord[] = data.data as DrawRecord[];
    if (page === 1) {
      setAllDraws(incoming);
    } else {
      setAllDraws((prev) => [...prev, ...incoming]);
    }
    setHasMore(allDraws.length + incoming.length < (data.totalCount ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // re-compute hasMore after allDraws changes
  React.useEffect(() => {
    if (data?.totalCount != null) {
      setHasMore(allDraws.length < data.totalCount);
    }
  }, [allDraws, data]);

  const handleSearch = useCallback(() => {
    const newParams: Omit<GetAllDrawParams, "page" | "limit"> = {};
    if (bidNo.trim()) newParams.bidNo = bidNo.trim();
    if (fromDate) newParams.fromDate = fromDate;
    if (toDate) newParams.toDate = toDate;
    setAppliedParams(newParams);
    setAllDraws([]);
    setPage(1);
    didInitLoad.current = true;
  }, [bidNo, fromDate, toDate]);

  const handleReset = () => {
    setBidNo("");
    setFromDate("");
    setToDate("");
    setAppliedParams({});
    setAllDraws([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const isEmpty = !isFetching && allDraws.length === 0;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWinningTicketsModalOpen, setIsWinningTicketsModalOpen] = useState(false);


  // const winningDigits = completedDraw?.winningNumber?.split("") || [];

  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);

  const currentDraw = allDraws.find((d) => d.bidNo === selectedDrawId) || allDraws?.[0];

  const activeDrawId = currentDraw?._id || data?.data?.[0]?._id;
  const { data: drawResultById } = useFetchDrawResultById(activeDrawId);
  // console.log("drawResultById", drawResultById);
  const hasWinningTickets = (drawResultById?.data?.summary?.winningTickets ?? 0) > 0;
  const winningTickets: WinningTicket[] = drawResultById?.data?.tickets || [];

  // const winningDigits = String(currentDraw?.winningNumber || "").split("");
  const winningDigits = currentDraw?.winningNumber
    ? String(currentDraw.winningNumber).split("")
    : [];
  const prizeBreakdown =
    drawResultById?.data?.prizeBreakdown?.map((item: PrizeBreakdown, index: number) => ({
      title: item.prizeName,
      match: item.match,
      numbers: item.winningNumber,
      prize: `$${item.prizeAmount}`,
        winnercount: `${item.winnerCount}`,
      icon:
        index === 0 ? "/images/jackpot.png" : `/images/prize-${index + 1}.png`,
      won: item.won,
    })) || [];


  const prizeStyles = [
    {
      text: "text-[#f4e95d]",
      bg: "/images/prize1bg.svg",
      border: "border-[#cda029]",
    },
    {
      text: "text-[#a09caf]",
      bg: "/images/prize2bg.svg",
      border: "border-[#827d9f]",
    },
    {
      text: "text-[#d59165]",
      bg: "/images/prize3bg.svg",
      border: "border-[#762e17]",
    },
    {
      text: "text-white",
      bg: "/images/prize4bg.svg",
      border: "border-[#5ed929]",
    },
    {
      text: "text-white",
      bg: "/images/prizecommonbg.svg",
      border: "border-[#460c88]",
    },
  ];

  const hasWon = currentDraw?.customerWin?.won;

  const firstWinningTicket = currentDraw?.customerWin?.tickets?.[0];

  const winningPrizeIndex =
    firstWinningTicket?.prizeLevel != null
      ? firstWinningTicket.prizeLevel - 1
      : -1;

  const jackpotLabel =
    hasWon && firstWinningTicket
      ? prizeLevelLabel[firstWinningTicket.prizeLevel]
      : "";

  const matchedNumbers = getMatchedNumbers(firstWinningTicket?.prizeLevel);

  React.useEffect(() => {
    if (!selectedDrawId) return;

    setTimeout(() => {
      jackpotRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [currentDraw?._id]);

  const statsCards = [
    {
      title: "Tickets Purchased",
      value: drawResultById?.data?.summary.purchasedTickets.toFixed(2) || 0,
      icon: "/images/ticketthumb.png",
      valueColor: "text-white",
      border: "border-[#9a4cee]",
    },
    {
      title: "Winning Tickets",
      value: drawResultById?.data?.summary.winningTickets || 0,
      icon: "/images/prosicon3.png",
      valueColor: "text-[#ffc928]",
      border: "border-[#ffc928]",
    },
    {
      title: "Total Prize Won",
      value: `${drawResultById?.data?.summary.totalWon.toFixed(2)} MTHT` || 0,
      icon: "/images/coins.svg",
      valueColor: "text-[#fff]",
      border: "border-[#9a4cee]",
    },
    {
      title: "Wallet Balance",
      value: `${drawResultById?.data?.customer.walletBalance.toFixed(2)} MTHT` || 0,
      icon: "/images/wallet-2.svg",
      valueColor: "text-white",
      border: "border-[#9a4cee]",
    },
  ];

  return (
    <section className="w-full py-8">
      {/* <CelebrationConfetti /> */}

      <div className="mx-auto max-w-md px-[24px]">
        <div className="relative">
          <h1 className="mb-5 text-center text-[21px] font-bold text-white">
            Results
          </h1>
          <Image
            src={"/images/settingsicon.svg"}
            width={30}
            height={30}
            alt=""
            className="cursor-pointer absolute right-0 -top-2.5"
          />
        </div>

        <div
          ref={jackpotRef}
          id="jackpot"
          className="relative overflow-hidden rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_12%,#0c0239_46%,#140642_81%,#1b0949_100%)]
    py-[30px] px-6 shadow-[0_0_30px_rgba(124,86,255,0.2)]  mb-[30px]">
          {hasWinningTickets && (
            <>
              <Image
                src={"/images/celebration.svg"}
                width={500}
                height={200}
                alt=""
                className="cursor-pointer  absolute right-[-38px] -top-2.5 max-w-[unset] w-[408px] z-0 max-[410]:w-full max-[410]:-right-2"
              />
              {/* Live Badge */}
              <div className="absolute right-3 top-3">
                <span className="rounded-full bg-[#4b2b00] px-3 py-1 text-[10px] font-semibold text-[#FEDB1E]">
                  {currentDraw?.drawDate ? dateFormat(currentDraw.drawDate) : "-"}
                </span>
              </div>
              <div className="flex -ml-3 mt-[65px] ">
                {/* Logo */}
                <div className="flex justify-center relative">
                  <img
                    src="/images/resultfortunelogo.png"
                    alt="Fortune Ball"
                    className="max-[410px]:max-w-[30vw] min-[410px]:max-w-[150px] object-contain z-2 "
                  />
                  <div
                    className=" max-[410px]:max-w-[55vw] max-[410px]:w-[300px] max-[410px]:bottom-2.5
              min-[410px]:min-w-[280px] 
              absolute left-14 max-[410px]:left-[70%]   bottom-5 z-1"
                  >
                    <img
                      src="/images/winnerticketbg.svg"
                      alt="Fortune Ball"
                      className="  object-contain"
                    />

                    <div className="absolute text-center right-[58px] -top-20 max-[410px]:right-[28px]">
                      <p className="text-[14px] text-[#ffcd38]">CONGRATULATIONS</p>
                      <p className="text-[13px] text-white">You Won</p>
                      <div className="relative">
                        <Image
                          src="/images/wheat-left.svg"
                          width={40}
                          height={40}
                          alt="Fortune Ball"
                          className="  object-contain absolute -left-4 top-0"
                        />
                        <h6 className="text-[#ffcd38] text-[27px]">
                          {drawResultById?.data?.highestPrize?.prizeName}
                        </h6>
                        <Image
                          src="/images/wheat-right.svg"
                          width={40}
                          height={40}
                          alt="Fortune Ball"
                          className="  object-contain absolute -right-4 top-0"
                        />
                      </div>
                    </div>

                    <div className="text-center absolute top-1/2 right-[50px] -translate-y-1/2">
                      <p className="text-[13px] max-[410]:text-[9px] text-white leading-1.5">You Won</p>
                      <h5 className="text-[#ffcd38] text-[19px] max-[410]:text-[13px] font-bold">
                        {drawResultById?.data?.highestPrize?.prizeAmount.toFixed(2)} MTHT
                       
                      </h5>
                    </div>
                  </div>
                </div>
              </div>


              <div className="rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_12%,#0c0239_46%,#140642_81%,#1b0949_100%)] p-[15px] pt-[10px] px-0 mt-2 divide-y divide-[#6715cb]/30">
                <div className="grid grid-cols-2 divide-x divide-[#7c56ff]/30 pb-2.5 px-[15px]">
                  <div className="pr-3">
                    <p className="mb-3 text-center text-[6px] font-medium text-[#d5c8ff]">
                      Your Tickets
                    </p>
                    <div className="flex justify-center gap-1.5 ">
                      {(() => {
                        const congratulation = drawResultById?.data?.congratulation;
                        const winningTicket = congratulation?.winningTicket;
                        const matchedDigits = congratulation?.matchedDigits || 0;
                        if (!winningTicket) {
                          return (
                            <p className="text-center text-[9px] text-white/70">
                              You didn't purchase a ticket for this draw.
                            </p>
                          );
                        }
                        return winningTicket.split("").map((digit: string, i: number) => {
                          const isMatched = i >= winningTicket.length - matchedDigits;
                          return (
                            <div
                              key={i}
                              className={`flex h-[18px] w-[18px] items-center justify-center flex-wrap rounded-full text-[10px] font-bold text-white bg-cover bg-no-repeat bg-center`}
                              style={{
                                backgroundImage: `url(${isMatched ? "/images/greenball-bg.svg" : "/images/redball-bg.svg"})`,
                              }}
                            >
                              {digit}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  <div className="pl-3">
                    <p className="mb-3 text-center text-[6px] font-medium text-[#d5c8ff]">
                      Winning Numbers
                    </p>
                    <div className="grid grid-cols-3 place-items-center min-[420px]:flex justify-center gap-1.5 flex-wrap ">
                      {drawResultById?.data?.bid?.winningNumber
                        ?.split("")
                        .map((digit: any, index: number) => {
                          const ball = colorBalls.find(
                            (item) => item.digit === Number(digit)
                          );
                          return (
                            <img
                              key={index}
                              src={ball?.color}
                              alt={digit}
                              className="w-[18px] object-contain transition hover:scale-110"
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>

                {(() => {
                  const c = drawResultById?.data?.congratulation;
                  const totalDigits = c?.winningNumber?.length || 6;
                  const matchedDigits = c?.matchedDigits || 0;
                  return (
                    <div className="flex items-center justify-center mt-2.5 gap-4 px-[15px]">
                      <div className="text-[#b3ff7b] text-center border border-[#b3ff7b] rounded-full w-10 h-10 content-center shadow-[0_0_20px_#62ff00cf] ">
                        <span className="text-[17px]">{matchedDigits}/</span>
                        <span className="text-[13px]">{totalDigits}</span>
                        <div className="text-[5px] -mt-1">Matched</div>
                      </div>
                      <div>
                        <p className="text-[8px] text-[#c4c4c4]">
                          {c?.hasWon
                            ? `Amazing! You Matched ${drawResultById?.data?.bid?.matchedDigits} Numbers`
                            : "Better luck next time."}
                          <br />
                          {c?.hasWon && matchedDigits > 0 && (
                            <>
                              Only {totalDigits - matchedDigits} numbers away from the
                              <span className="text-[#ffcd38] ml-1">Jackpot</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>


              <div className="grid grid-cols-4 max-[410]:grid-cols-2 gap-[5px] mt-3 mb-[11px]">
                {statsCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={index === 1 ? () => setIsWinningTicketsModalOpen(true) : undefined}
                    className={`
            relative
            rounded-[10px]
            border
            ${card.border}
            bg-[linear-gradient(180deg,#3d0069_0%,#230047_100%)]
            px-[7px]
            py-[7px]
            flex
            flex-col
            items-center
            justify-center
            text-center
            ${index === 1 ? "cursor-pointer" : ""}
          `}
                  >
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={20}
                      height={16}
                      className="mb-1.5 object-contain w-[20px]"
                    />
                    <h3 className={`text-[9px] font-medium leading-none ${card.valueColor}`}>
                      {card.value}
                    </h3>
                    <p className="mt-[5px] text-[6px] leading-[10px] text-white/65">
                      {card.title}
                    </p>
                  </div>
                ))}
              </div>

            </>
          )}

          {!hasWinningTickets && (
            <>
              <Image src={"/images/celebration.svg"} width={500} height={200} alt="" className="cursor-pointer  absolute right-[-38px] -top-2.5 max-w-[unset] w-[408px] z-0 max-[410]:w-full max-[410]:-right-2" />
              {/* Live Badge */}
              <div className="absolute right-3 top-3">
                <span className="rounded-full bg-[#4b2b00] px-3 py-1 text-[10px] font-semibold text-[#FEDB1E]">
                 {dateFormat(drawResultById?.data?.bid?.drawDate)}
                </span>
              </div>

              <div className="flex  mt-[33px]">

                {/* Logo */}
                <div className="flex justify-center relative">
                  <img
                    src="/images/resultfortunelogo.png"
                    alt="Fortune Ball"
                    className="max-[410px]:max-w-[30vw] min-[410px]:max-w-[150px] object-contain z-2 "
                  />
                  <div className="max-[410px]:max-w-[55vw] max-[410px]:w-[300px] max-[410px]:bottom-2.5
              min-[410px]:min-w-[280px] 
              absolute left-14 max-[410px]:left-[70%]   bottom-5 z-1">

                    <img
                      src="/images/winnerticketbg.svg"
                      alt="Fortune Ball"
                      className="  object-contain "
                    />



                    <div className="flex flex-col items-center absolute -right-[10px] -top-16 w-full">
                      {drawResultById?.data?.bid?.winningNumber && (
                        <p className="mt-2 text-[8px] text-white/90  border border-[#9a4cee] rounded-full text-center w-auto inline-block px-2.5 py-1">
                                                Winning Number
                                              </p>
                      )}
                      

                      <div className="mt-1 flex gap-[3px]">

                        <div className="mt-0 flex gap-[3px]">
                        {drawResultById?.data?.bid?.winningNumber
                        ?.split("")
                        .map((digit: any, index: number) => {
                          const ball = colorBalls.find(
                            (item) => item.digit === Number(digit)
                          );
                          return (
                            <img
                              key={index}
                              src={ball?.color}
                              alt={digit}
                              className="w-[18px] object-contain transition hover:scale-110"
                            />
                          );
                        })}
                        </div>
                      </div>
                    </div>

                    <div className="text-center font-medium absolute top-1/2 right-[65px] max-[410]:right-[45px] -translate-y-1/2">
{drawResultById?.data?.bid?.bidNo ? <> <p className="text-[8px] text-white">Draw Number</p></>:<><p className="text-[8px] text-white max-w-[100px]">
 The results will be announced today at 7:00 PM
</p>
</>}
                      
                      <h5 className="text-[#ffcd38] text-[21px]">{drawResultById?.data?.bid?.bidNo}</h5>
                    </div>
                  </div>
                </div>


              </div>

            </>
          )}

          <div className="mt-[41px] rounded-[16px] min-h-[76px] relative border border-[#a24ec2] bg-[linear-gradient(180deg,rgba(255,0,147,0.45),#450095)]  flex items-center justify-end gap-4">
            <Image
              width={200}
              height={200}
              src="/images/prizetrophy.png"
              alt="trophy"
              className="  object-contain w-[152px] absolute -bottom-6 -left-3 "
            />
            <div className=" pr-[48px] text-center">
              <p className="text-[11px] text-white">Total Winners</p>
              <h5 className="text-[29px] text-white font-bold">
                {" "}
                {Number(currentDraw?.totalWinners || 0).toLocaleString("en-IN")}
              </h5>
            </div>
          </div>



          <div className="flex gap-1.5 mt-[15px]">
            {/* Tickets Sold */}
            <div
              className="
      flex-1
      min-h-[50px]
      rounded-[10px]
      bg-[linear-gradient(175deg,#3b036d_0%,#0f0234_100%)]
      border border-[#9a4cee]
      px-[9px] py-[6px]
      flex items-center
    "
            >
              <div className="flex items-center gap-2">
                <Image src="/images/ticket.svg" width={30} height={30} alt="" />
                <div>
                  <h4 className="text-white font-semibold text-[6px]">
                    Tickets Sold
                  </h4>
                  <p className="text-[#c1c1c1] text-[12px]">
                    {currentDraw?.totalTickets?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Prize Pool */}
            <div
              className="
      flex-1
      min-h-[50px]
      rounded-[10px]
      bg-[linear-gradient(175deg,#3b036d_0%,#0f0234_100%)]
      border border-[#9a4cee]
      px-[9px] py-[6px]
      flex items-center
    "
            >
              <div className="flex items-center gap-2">
                <Image src="/images/prizepool.svg" width={30} height={30} alt="" />
                <div>
                  <h4 className="text-white font-semibold text-[6px]">
                    Total Prize Pool
                  </h4>
                  <p className="text-[#f3c14c] text-[12px]">
                    {currentDraw?.totalPayout?.toFixed(2)} MTHT
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {/* Heading */}
            <div className="flex items-center gap-2.5 mt-[24px] mb-[7px]">
              <Image
                src={"/images/prosicon3.png"}
                alt=""
                width={20}
                height={20}
                className=""
              />
              <h6 className="text-[11px] text-white"> Price Breakdown </h6>
            </div>

            {/* Cards */}
            <div className="space-y-1">
              {prizeBreakdown.length > 0 ? prizeBreakdown.map((item: { title: string; match: string; numbers: string; prize: string; icon: string; won: boolean; winnercount:string }, index: number) => {
                const style = prizeStyles[index];
                const isWinner = item.won;
                return (
                  <div
                    key={index}
                    style={{
                      backgroundImage: `url(${style.bg})`,
                    }}
                    className={` border   ${style.border}    bg-cover    bg-center    bg-repeat    rounded-[8px]    px-[9px]    py-[8px]    flex items-center justify-between  `}
                  >
                    <div className="flex items-center gap-[37px]">
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={35}
                          height={35}
                        />
                        <div>
                          <h4 className={`text-[11px] font-medium ${style.text}`}>
                            {item.title}
                          </h4>
                          <p className={`text-[6px] text-[#e6ddd3] opacity-80`}>
                            {item.match}
                          </p>
                        </div>
                      </div>
                      <p className={`tracking-[3.5px] margin-left text-[11px] ${style.text}`}>
                        {item.numbers}
                        
                      </p>
                    </div>
                    <p className={`text-[11px] font-medium ${style.text} relative text-end`}>
                      {isWinner && (
                        <span className="absolute -left-[46px] top-1/2 -translate-y-1/2 text-[6px] uppercase text-[#37f400] border border-[#37f400] rounded-[4px] p-0.75 ">
                          You Won
                        </span>
                      )}
                      {item.prize}
                      <p className={`text-[8px] -mt-1 text-[#e6ddd3] opacity-80`}>
                           {item.winnercount} Winners
                          </p>
                      
                    </p>
                  </div>
                );
              }) : <><div className="text-white text-center text-xs">No Result Yet</div></>}
            </div>
          </div>
        </div>
        {allDraws.length > 1 && (
          <PreviousDraws
            draws={allDraws.slice(1)}
            onSelect={(id) => setSelectedDrawId(id)}
          />
        )}
      </div>

      <WinningTicketsModal
        open={isWinningTicketsModalOpen}
        onClose={() => setIsWinningTicketsModalOpen(false)}
        tickets={winningTickets}
      />
    </section>
  );
}
