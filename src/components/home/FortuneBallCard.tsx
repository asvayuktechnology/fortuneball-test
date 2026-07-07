import { useFetchActiveBid, useFetchBidSummary, useFetchLatestBid } from "@/services/ticket";
import { dateFormat, dateTimeFormat, getCountdown } from "@/utils";
import { colorBalls } from "@/utils/constant";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoTime } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Countdowntimer from "./Countdowntimer";

export default function FortuneBallCard() {

    // const [timeLeft, setTimeLeft] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    // const router = useRouter();
    // const auth = useAuth();
    // const isLoggedIn = auth?.isLoggedIn ?? false;
    const { data: bidSummary } = useFetchBidSummary({ refetchInterval: 5000 });
    const { data: bidData, isLoading, error } = useFetchActiveBid();
    const activeDraw = bidSummary?.data?.activeBid;



    return (
        <div
            className="
    relative
    overflow-hidden
    rounded-2xl
    border
    border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_12%,#0c0239_46%,#140642_81%,#1b0949_100%)]
    p-5 px-8
    shadow-[0_0_30px_rgba(124,86,255,0.2)]
    m-4 mx-[24px]
  "
        >
            {/* Live Badge */}
            <div className="absolute right-3 top-3">
                <span className="rounded-full bg-[#4b2b00] px-3 py-1 text-[10px] font-semibold text-[#FEDB1E]">
                    Live
                </span>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
                <img
                    src="/images/fball2.png"
                    alt="Fortune Ball"
                    className="w-[200px] object-contain"
                />
            </div>

            {/* Draw Info */}
            <div className="my-2 text-start">
                <h2 className="text-[21px] font-medium text-white">
                    Fortune Ball Draw {bidData?.data?.bidNo || "-"}
                </h2>
                <div className="flex items-center gap-1.5">


                    <p className="text-[14px] text-[#c7bfff]">
                        {bidData?.data?.drawDate
                            ? dateFormat(bidData?.data?.drawDate)
                            : "Date To Be Announced"}
                    </p>

                    {isCompleted && (
                        <span className="text-[10px] font-medium text-white/65 pl-2 border-l border-white/65 italic">
                            (The results will be announced at 8:00 PM)
                        </span>

                    )}

                </div>
            </div>


            <div className="">

                <Countdowntimer
                    ticketPurchased={activeDraw?.totalTicketsPurchased}
                    onComplete={setIsCompleted}
                />

            </div>
        </div>
    );
}