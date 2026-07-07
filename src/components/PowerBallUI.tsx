"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TbCopyPlus } from "react-icons/tb";
import { MdDeleteOutline, MdRefresh, MdAddCircleOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import PowerballPaymentModal from "@/components/PowerballPaymentModal";
import { useAuth } from "@/hooks/useAuth";
import { useBuyTicketMutation, useFetchActiveBid, useFetchLatestBid, useFetchStakingSettings } from "@/services/ticket";
import { TicketBall, TicketType } from "@/types/ticket";
import { colorBalls, leastSelectedColors, mostSelectedColors } from "@/utils/constant";
import { dateFormat, EXCLUDED_WALLETS, getCountdown } from "@/utils";
import {
  BULK_TICKET_OPTIONS,
  BULK_TICKETS_PAGE_SIZE,
  generateRandomTicketBalls,
  generateRandomTickets,
  getValidTicketStrings,
  createEmptyTickets,
  isLastTicketBatchComplete,
  TICKETS_PER_ROW_BATCH,
} from "@/utils/ticket";
import { useRouter } from "next/navigation";
import { useFetchCustemerWalletList } from "@/services/customerService";
import BannerSection from "./home/BannerSection";
import FortuneBallCard from "./home/FortuneBallCard";
import { ChevronDown } from "lucide-react";
// import { Link } from "lucide-react";





const initialTickets: TicketType[] = [
  { id: 1, numbers: [] },
  { id: 2, numbers: [] },
  { id: 3, numbers: [] },
  { id: 4, numbers: [] },
  { id: 5, numbers: [] },
];

export default function PowerballUI() {
  const router = useRouter();
  const auth = useAuth();
  const isLoggedIn = auth?.isLoggedIn ?? false;

  const { mutate, isPending } = useBuyTicketMutation();

  const queryClient = useQueryClient();

  const { data: bidData, isLoading, error } = useFetchActiveBid();
  const { data: latestbidData, isLoading: latestLoading, error: latestBidError } = useFetchLatestBid();
  const { data: settingData, isLoading: settingLoading, error: settingError } = useFetchStakingSettings();


  const latestDraw = latestbidData?.data;

  const winningDigits =
    latestDraw?.winningNumber?.split("") || [];

  const { data: walletList, refetch: refetchWalletList } = useFetchCustemerWalletList({ enabled: isLoggedIn });

  // const filteredWalletList = useMemo(  () =>   walletList?.filter((wallet) =>!EXCLUDED_WALLETS.has(wallet.value.trim().toLowerCase())) ?? [],
  //   [walletList]
  // );

  const [tickets, setTickets] =  useState<TicketType[]>(initialTickets);

  const [activeTicket, setActiveTicket] = useState(1);
  const [editingBallIndex, setEditingBallIndex] = useState<number | null>(null);

  const [visibleTicketCount, setVisibleTicketCount] = useState(
    BULK_TICKETS_PAGE_SIZE
  );

  const [isBulkMode, setIsBulkMode] = useState(false);

  const [timeLeft, setTimeLeft] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [selectedWallet, setSelectedWallet] = useState("");

  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success">("confirm");

  const [purchaseResult, setPurchaseResult] = useState<{
    drawNumber: string;
    drawDate: string;
    tickets: number;
  } | null>(null);




  /* -------------------------------------------------------------------------- */
  /*                                CALCULATIONS                                */
  /* -------------------------------------------------------------------------- */

  const validTickets = useMemo(
    () => getValidTicketStrings(tickets),
    [tickets]
  );

  const visibleTickets = isBulkMode
    ? tickets.slice(0, visibleTicketCount)
    : tickets;

  const hasMoreTickets =
    isBulkMode && visibleTicketCount < tickets.length;

  const showAddRowsButton =
    !isBulkMode && isLastTicketBatchComplete(tickets);

  const totalFilledTickets = validTickets.length;
const mthtValue = bidData?.data?.mthtValue ?? 2;
const totalPrice =  totalFilledTickets * mthtValue || 2;
  const canBuy = totalFilledTickets > 0;

  /* -------------------------------------------------------------------------- */
  /*                               SELECT BALL                                  */
  /* -------------------------------------------------------------------------- */

  const findNextIncompleteTicket = (
    list: TicketType[],
    afterId?: number
  ): TicketType | undefined => {
    if (afterId !== undefined) {
      const nextAfter = list.find(
        (t) => t.id > afterId && t.numbers.length < 6
      );
      if (nextAfter) return nextAfter;
    }

    return list.find((t) => t.numbers.length < 6);
  };

  const handleSelectBall = (ball: TicketBall) => {
    const active = tickets.find((t) => t.id === activeTicket);

    if (active && editingBallIndex !== null) {
      // Edit mode: replace the ball at editingBallIndex
      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.id !== activeTicket) return ticket;

          const newNumbers = [...ticket.numbers];
          if (editingBallIndex < newNumbers.length) {
            newNumbers[editingBallIndex] = ball;
          }
          return {
            ...ticket,
            numbers: newNumbers,
          };
        })
      );
      setEditingBallIndex(null); // Clear editing index after replacing
      return;
    }

    // Normal mode: append ball to active ticket if not full, or to next incomplete ticket
    const target =
      active && active.numbers.length < 6
        ? active
        : findNextIncompleteTicket(tickets);

    if (!target) return;

    let nextActiveId: number | null = null;

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== target.id) return ticket;

        const newNumbers = [...ticket.numbers, ball];

        if (newNumbers.length === 6) {
          const nextTicket = findNextIncompleteTicket(
            prev,
            ticket.id
          );

          nextActiveId = nextTicket?.id ?? ticket.id;
        } else {
          nextActiveId = ticket.id;
        }

        return {
          ...ticket,
          numbers: newNumbers,
        };
      })
    );

    if (nextActiveId !== null) {
      setActiveTicket(nextActiveId);
    }
  };

  const handleBulkTicketCount = (count: number) => {
    setIsBulkMode(true);
    setTickets(generateRandomTickets(count));
    setVisibleTicketCount(BULK_TICKETS_PAGE_SIZE);
    setActiveTicket(1);
    setEditingBallIndex(null);
  };

  const handleAddMoreRows = () => {
    setTickets((prev) => {
      const maxId = Math.max(...prev.map((t) => t.id), 0);
      const newRows = createEmptyTickets(
        maxId + 1,
        TICKETS_PER_ROW_BATCH
      );
      setActiveTicket(maxId + 1);
      setEditingBallIndex(null);
      return [...prev, ...newRows];
    });
  };

  const handleShowMoreTickets = () => {
    setVisibleTicketCount((prev) =>
      Math.min(prev + BULK_TICKETS_PAGE_SIZE, tickets.length)
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               REMOVE TICKET                                */
  /* -------------------------------------------------------------------------- */

  const removeTicket = (id: number) => {
    setTickets((prev) => {
      const deletedIdx = prev.findIndex((t) => t.id === id);
      if (deletedIdx === -1) return prev;

      const remaining = prev.filter((t) => t.id !== id);
      const reindexed = remaining.map((t, idx) => ({
        ...t,
        id: idx + 1,
      }));

      // Adjust active ticket
      let nextActiveId = activeTicket;
      if (activeTicket === id) {
        if (reindexed.length > 0) {
          const newActiveIdx = Math.min(deletedIdx, reindexed.length - 1);
          nextActiveId = reindexed[newActiveIdx].id;
        } else {
          nextActiveId = 1;
        }
      } else {
        const activeIdxInRemaining = remaining.findIndex((t) => t.id === activeTicket);
        if (activeIdxInRemaining !== -1) {
          nextActiveId = reindexed[activeIdxInRemaining].id;
        } else {
          nextActiveId = reindexed[0]?.id ?? 1;
        }
      }

      setTimeout(() => {
        setActiveTicket(nextActiveId);
        setEditingBallIndex(null);
      }, 0);

      return reindexed;
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                             DUPLICATE TICKET                               */
  /* -------------------------------------------------------------------------- */

  const duplicateTicket = (id: number) => {
    const current = tickets.find((t) => t.id === id);

    if (!current || current.numbers.length !== 6) {
      toast.error("Only complete tickets can be duplicated");
      return;
    }

    setTickets((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;

      const newTicket: TicketType = {
        id: -1,
        numbers: [...current.numbers],
      };

      const updated = [
        ...prev.slice(0, idx + 1),
        newTicket,
        ...prev.slice(idx + 1),
      ];

      const reindexed = updated.map((t, index) => ({
        ...t,
        id: index + 1,
      }));

      let nextActiveId = activeTicket;
      const oldActiveIdx = prev.findIndex((t) => t.id === activeTicket);
      if (oldActiveIdx !== -1) {
        if (oldActiveIdx >= idx + 1) {
          nextActiveId = oldActiveIdx + 2;
        } else {
          nextActiveId = oldActiveIdx + 1;
        }
      }

      setTimeout(() => {
        setActiveTicket(nextActiveId);
        setEditingBallIndex(null);
      }, 0);

      return reindexed;
    });

    toast.success("Ticket duplicated below");
  };

  /* -------------------------------------------------------------------------- */
  /*                                EDIT TICKET                                 */
  /* -------------------------------------------------------------------------- */

  const editTicket = (id: number) => {
    setActiveTicket(id);
    const ticket = tickets.find((t) => t.id === id);
    if (ticket && ticket.numbers.length > 0) {
      setEditingBallIndex(0); // Auto-select the first ball for editing
    } else {
      setEditingBallIndex(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              RANDOMIZE TICKET                              */
  /* -------------------------------------------------------------------------- */

  const randomizeTicket = (id: number) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
            ...ticket,
            numbers: generateRandomTicketBalls(),
          }
          : ticket
      )
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                MODAL LOGIC                                 */
  /* -------------------------------------------------------------------------- */

  const closeModal = () => {
    setOpenModal(false);
    setPurchaseResult(null);

    setTimeout(() => {
      setPaymentStep("confirm");
    }, 300);
  };

  const handleGoToMyTickets = () => {
    closeModal();
    setTickets(initialTickets);
    setVisibleTicketCount(BULK_TICKETS_PAGE_SIZE);
    setIsBulkMode(false);
    setActiveTicket(1);
    router.push("/user/my-tickets");
  };

  const handleBuyTickets = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to buy tickets");
      return;
    }

    if (!canBuy) {
      toast.error(
        "Please complete at least one ticket"
      );
      return;
    }

    setOpenModal(true);
  };


  const handleConfirm = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to buy tickets");
      return;
    }

    setPaymentStep("processing");
    // console.log(selectedWallet, validTickets)
    // return false
    mutate(
      {
        walletType: selectedWallet,
        tickets: validTickets,
      },
      {
        onSuccess: (res: any) => {
          setPaymentStep("success");
          setPurchaseResult({
            drawNumber: res?.drawNumber ?? "",
            drawDate: res?.drawdate ?? "",
            tickets: res?.tickets ?? totalFilledTickets,
          });

          toast.success(
            res?.message ||
            "Tickets purchased successfully"
          );


          queryClient.invalidateQueries({ queryKey: ["all_tickets"] });
          queryClient.invalidateQueries({ queryKey: ["customer_wallet"] });
          refetchWalletList();

          setTimeout(() => {
            handleGoToMyTickets();
          }, 5000);
        },



        onError: (err: any) => {
          setPaymentStep("confirm");

          toast.error(
            err?.response?.data?.message ||
            "Failed to buy tickets"
          );
        },
      }
    );
  };

  useEffect(() => {
    if (!bidData?.data?.drawTime) return;

    const interval = setInterval(() => {
      setTimeLeft(getCountdown(bidData.data.drawTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [bidData]);



  return (
    <div className="flex justify-center relative ">
      <div className="max-w-md w-full overflow-hidden  shadow-xl relative">
        {/* Banner */}
        <div className="relative">
          {/* <BannerSection /> */}
          <FortuneBallCard />




        </div>

        {/* CONTENT */}
        <div className="px-[24px] py-4 pb-0">





          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[15px] text-white">
              Select your combinations
            </p>

          </div>

          {/* SELECTABLE BALLS */}
          <div className="grid grid-cols-5 gap-1 place-items-center">
            {colorBalls.map((item) => (
              <button
                key={item.digit}
                onClick={() => handleSelectBall(item)}
                className="transition hover:scale-110 cursor-pointer"
              >
                <img
                  src={item.color}
                  alt={`ball-${item.digit}`}
                  className="h-20 w-20 object-contain"
                />
              </button>
            ))}
          </div>

          {/* STATS */}
          <div className="mt-4 px-1">
            <div className="rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_12%,#0c0239_46%,#140642_81%,#1b0949_100%)] p-[15px]">
              <div className="grid grid-cols-2 divide-x divide-[#7c56ff]/30">

                {/* MOST SELECTED */}
                <div className="pr-3">
                  <p className="mb-3 text-center text-[11px] font-medium text-[#d5c8ff]">
                    Most selected colors today
                  </p>

                  <div className="flex justify-center gap-2">
                    {mostSelectedColors.map((ball, index) => (
                      <img
                        key={index}
                        src={ball}
                        alt=""
                        className=" w-8 object-contain transition hover:scale-110"
                      />
                    ))}
                  </div>
                </div>

                {/* LEAST SELECTED */}
                <div className="pl-3">
                  <p className="mb-3 text-center text-[11px] font-medium text-[#d5c8ff]">
                    Least selected colors
                  </p>

                  <div className="flex justify-center gap-2">
                    {leastSelectedColors.map((ball, index) => (
                      <img
                        key={index}
                        src={ball}
                        alt=""
                        className=" w-8 object-contain transition hover:scale-110"
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


       <div className="relative mx-[24px] my-3">
  <img
    src="/images/purchase-thumb2.png"
    alt=""
    className="absolute left-3 top-1/2 h-auto w-10 -translate-y-1/2 pointer-events-none"
  />

  <select
    value=""
    onChange={(e) => {
      const count = Number(e.target.value);
      if (count) handleBulkTicketCount(count);
    }}
    className="
      appearance-none
      w-full
      rounded-2xl
      border border-[#231553]
      bg-transparent
      pl-16 
      pr-10
      py-4
      text-[16px]
      text-white
      cursor-pointer
    "
  >
    <option value="" disabled>
      Generate Tickets
    </option>

    {BULK_TICKET_OPTIONS.map((count) => (
      <option
        key={count}
        value={count}
        className="bg-[#231553]"
      >
        Generate {count} Tickets
      </option>
    ))}
  </select>

  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
    <ChevronDown className="text-white"/>
  </div>
</div>
<div className="mx-[24px] mb-3 flex items-center justify-between">
  <p className="text-[13px] font-medium text-white">
    Your selected tickets
  </p>

  <div className="flex items-center gap-3 text-[#b8a7ef]">

    {/* Duplicate */}
    <button
      onClick={() => duplicateTicket(activeTicket)}
      className="cursor-pointer hover:text-white transition"
    >
      <TbCopyPlus size={18} />
    </button>

    {/* Delete */}
    <button
      onClick={() => removeTicket(activeTicket)}
      className="cursor-pointer hover:text-white transition"
    >
      <MdDeleteOutline size={18} />
    </button>

    {/* Edit */}
    <button
      onClick={() => editTicket(activeTicket)}
      className="cursor-pointer hover:text-white transition"
    >
      <FiEdit2 size={18} />
    </button>

    {/* Random */}
    <button
      onClick={() => randomizeTicket(activeTicket)}
      className="cursor-pointer hover:text-white transition"
    >
      <MdRefresh size={18} />
    </button>

  </div>
</div>
        {/* TICKETS */}
         {/* <p className="mb-3 mx-[24px] text-[13px] font-medium text-white ">
            Your selected tickets
          </p> */}
        <div className=" mx-[24px] rounded-2xl border border-[#7c56ff]/40 bg-[linear-gradient(180deg,#1f0055_0%,#120032_100%)]  px-4 pb-6 pt-7 text-white">

          {/* <p className="mb-1.5 text-[10px] font-medium">
            Your selected tickets
          </p> */}

          <div>
            {visibleTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  setActiveTicket(ticket.id);
                  setEditingBallIndex(null);
                }}
                className={`rounded-xl p-2 cursor-pointer transition
${
  activeTicket === ticket.id
    ? "bg-[#4f1da3]/40 border border-[#8e62ff]"
    : "opacity-70"
}`}
              >
                {/* LEFT */}
               <div className="flex items-center">
                  <span className="w-5 text-xs text-[#b8a7ef]">
                    #{ticket.id}
                  </span>

                 <div className="flex flex-1 justify-between ml-3">
                    {Array.from({ length: 6 }).map(
                      (_, index) => {
                        const selectedBall =
                          ticket.numbers[index];
                        const isActive = activeTicket === ticket.id;
                        const isEditable = isActive && index < ticket.numbers.length;
                        const isEditingThisBall = isActive && editingBallIndex === index;

                        return (
                          <div
                            key={index}
                            onClick={(e) => {
                              if (isEditable) {
                                e.stopPropagation();
                                setEditingBallIndex(index);
                              }
                            }}
                            className={`h-9 w-9 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-200 bg-white/15
                              ${isEditable ? "cursor-pointer hover:scale-110" : ""}
                              ${isEditingThisBall
                                ? "border-yellow-400 ring-2 ring-yellow-400/50 scale-105"
                                : "border-[#9f88e4]"
                              }`}
                          >
                            {selectedBall && (
                              <img
                                src={selectedBall.color}
                                alt={`ball-${selectedBall.digit}`}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

               
             
              </div>
            ))}

            <div className="flex items-center justify-center my-4">

              {hasMoreTickets && (
                <button
                  type="button"
                  onClick={handleShowMoreTickets}
                  className="max-w-[125px] mx-auto rounded-full px-6 py-2 text-sm font-semibold shadow-lg transition bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,rgba(228,138,6,1)_)100%)] hover:scale-105 cursor-pointer
                "
                >
                  See more
                </button>
              )}
            </div>

            {showAddRowsButton && (
              <button
                type="button"
                onClick={handleAddMoreRows}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#9f88e4] bg-[#5a2eb8] py-2.5 text-sm font-medium text-[#e8deff] transition hover:bg-[#6a2cff] cursor-pointer"
                aria-label="Add 5 more ticket rows"
              >
                <MdAddCircleOutline size={22} />
                Add more rows
              </button>
            )}
          </div>

          {/* FOOTER */}
          {/* SUMMARY CARD */}
          <div className=" relative

rounded-2xl
border
border-[#7c56ff]/40
bg-[linear-gradient(180deg,#1f0055_0%,#120032_100%)]">


            <div className="grid grid-cols-2">

              {/* TOTAL TICKETS */}
              <div className="relative py-5 text-center">
                {/* Glow Layer */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div
                    className="
        absolute
        left-0
        top-0
        -translate-x-1/2
        -translate-y-1/2
        h-15
        w-15
        rounded-full
        bg-[#d90cc0]
        opacity-90
        blur-[25px]
      "
                  />
                </div>

                {/* Heading Pill */}
                <div
                  className="
      absolute
      -top-3
      left-1/2
      z-20
      -translate-x-1/2
      rounded-full
      bg-[linear-gradient(180deg,#8f2cff_0%,#5a00e6_100%)]
      px-5
      py-1.5
      text-[12px]
      w-[75%]
      font-semibold
      text-white
      shadow-lg
    "
                >
                  No of Tickets
                </div>

                {/* Content */}
                <h3 className="relative z-10 mt-2 text-[16px] font-bold text-white">
                  {totalFilledTickets}
                </h3>
              </div>

              {/* TOTAL VALUE */}
              <div className="relative border-l border-[#7c56ff]/30 py-5 text-center">

                <div
                  className="
          absolute
          -top-3
          left-1/2
          -translate-x-1/2
          rounded-full
          bg-[linear-gradient(180deg,#8f2cff_0%,#5a00e6_100%)]
          px-5
          py-1.5
          w-[75%]
          text-[12px]
          font-semibold
          text-white
          shadow-lg
        "
                >
                  Total Value
                </div>

                <h3 className="mt-2 text-[16px] font-bold text-white">
                  {totalFilledTickets ? totalPrice : 0} MTHT
                </h3>
              </div>

            </div>
          </div>
          <div className="mt-8 ">
            <div>
              <button
                disabled={!canBuy || isPending}
                onClick={handleBuyTickets}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition text-black ${canBuy
                  ? "bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,#ee8102_)100%)] hover:scale-105 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {isPending ? "Processing..." : "Buy Ticket"}
              </button>

              {/* {!isLoggedIn && (
                <p className="mt-2 max-w-[140px] text-[10px] leading-tight text-[#b8a7ef]">
                  Please login first to buy tickets
                </p>
              )} */}
            </div>


          </div>
        </div>
      </div>

      {/* MODAL */}
      <PowerballPaymentModal
        open={openModal}
        paymentStep={paymentStep}
        totalFilledTickets={totalFilledTickets}
        totalPrice={totalPrice}
        selectedWallet={selectedWallet}
        purchaseResult={purchaseResult}
        onWalletChange={setSelectedWallet}
        onClose={closeModal}
        onConfirm={handleConfirm}
        onGoToMyTickets={handleGoToMyTickets}
      />
    </div>
  );
}