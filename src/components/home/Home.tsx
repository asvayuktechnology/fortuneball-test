"use client";

import HomeLayout from "@/components/layouts/HomeLayout";
import BannerSection from "@/components/home/BannerSection";
import { useFetchBidSummary, useFetchRecentActivity } from "@/services/ticket";
import { dateFormat, getCountdown } from "@/utils";
import { colorBalls } from "@/utils/constant";
import { RecentActivityItem } from "@/types/ticket";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFetchAuthprofile } from "@/services/authService";
import { useRedeemReward } from "@/services/customerService";
import toast from "react-hot-toast";

const slideInStyle = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    max-height: 0;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 80px;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
.slide-in {
  animation: slideIn 0.4s ease-out forwards;
  overflow: hidden;
}
`;

const rewardcoupon = [
    {
        image: "/images/coupon-mtht.png",
        title: "10 MTHT Off Coupon",
        value: "10 OFF",
        link: "/purchase?coupon=5OFF",
        conditionKey: "welcomebonus",
    },
    {
        image: "/images/coupon-2.png",  
        title: "$10 Off Coupon",
        value: "$10 OFF",
        link: "/purchase?coupon=10OFF",
        conditionKey: "premiumUser",
    },
    {
        image: "/images/coupon-5.png",
        title: "$5 Off Coupon",
        value: "🎁",
        link: null,
        conditionKey: "loyaltyReward",
    },
    {
        image: "/images/coupon-4.png",
        title: "$5 Off Coupon",
        value: "VIP",
        link: "/redeem-vip",
        conditionKey: "vipMember",
    },
];


export default function Home() {
    const [timeLeft, setTimeLeft] = useState("");
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [newIds, setNewIds] = useState<Set<string>>(new Set());
    const knownIdsRef = useRef<Set<string>>(new Set());
    const { data: profileResponse, refetch: refetchProfile } = useFetchAuthprofile();
    const profileData = profileResponse?.data;
    const { mutate: redeemCoupon } = useRedeemReward();

    const handleRedeemSubmit = (conditionKey: string) => {
        redeemCoupon(conditionKey, {
            onSuccess: (data: any) => {
                if (data?.success) {
                     toast.success(data.message);
                    refetchProfile();
                }else{
                     toast.error(data.message);
                }
            },
        });
    };

    const { data: bidSummary } = useFetchBidSummary({ refetchInterval: 5000 });
    const { data: recentActivity } = useFetchRecentActivity({ page: 1, limit: 5 }, { refetchInterval: 5000 });

    const activeDraw = bidSummary?.data?.activeBid;
    const completedDraw = bidSummary?.data?.lastCompletedBid;

    const isCompletedDrawExpired = completedDraw?.drawTime
      ? new Date(completedDraw.drawTime).getTime() <= Date.now()
      : false;

 

    const winningDigits = completedDraw?.winningNumber?.split("") || [];
    const isDrawClosed = activeDraw?.drawTime
      ? new Date(activeDraw.drawTime).getTime() <= Date.now()
      : false;

    useEffect(() => {
        if (!activeDraw?.drawTime) return;

        const updateCountdown = () => {
            setTimeLeft(getCountdown(activeDraw.drawTime));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [activeDraw?.drawTime]);

    useEffect(() => {
        if (!recentActivity?.data) return;

        const incoming = recentActivity.data;
        const freshIds = new Set(incoming.map(i => i._id));
        const brandNew = incoming.filter(i => !knownIdsRef.current.has(i._id));

        if (brandNew.length > 0) {
            setNewIds(new Set(brandNew.map(i => i._id)));
            setActivities(incoming);
            setTimeout(() => setNewIds(new Set()), 600);
        } else {
            setActivities(incoming);
        }

        knownIdsRef.current = freshIds;
    }, [recentActivity]);

    return (
        <section className="mx-auto max-w-md">
            <BannerSection />
            <div className="-mt-10 px-[24px] ">

                {/* RECENT DRAWS */}
                <section>
                    <h2 className="mb-3 text-lg font-medium text-white">
                        Recent Draws
                    </h2>

                    <div className="space-y-3">
                        {/* Active Draw */}
                        <Link href="/purchase" className="block rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)] p-3 backdrop-blur-md relative overflow-hidden">
                            <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-[10px] font-semibold text-yellow-300 absolute right-2 top-2">
                                Live
                            </span>
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-4 self-stretch flex items-center bg-[#0d072f]/40 rounded-[12px] relative">
                                    <Image width={100} height={100} alt=""
                                        src="/images/fball.png"
                                        className="h-auto w-full object-contain max-w-[90%] mr-auto  rounded-[12px]"
                                    />
                                    <div className="w-[1px] h-[47px] bg-[linear-gradient(-90deg,#1d0d49_0%,#392343_50%,#0f0831_100%)] opacity-90 absolute right-0 top-1/2 -translate-y-1/2" />
                                </div>

                                <div className="col-span-8 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-white">
                                                Draw {activeDraw?.bidNo}
                                            </h3>
                                        </div>

                                        <p className="text-xs text-[#c7bfff]">
                                            {activeDraw?.drawDate
                                                ? dateFormat(activeDraw.drawDate)
                                                : "-"}
                                        </p>

                                            {isDrawClosed ? (
                                                <div className="mt-2 inline-flex items-center rounded-full bg-gradient-to-t from-red-600 to-red-400 px-3 py-1 text-xs font-medium text-white">
                                                    Closed
                                                </div>
                                            ) : (
                                                <div className="mt-2 inline-flex items-center rounded-full bg-gradient-to-t from-[#b25cff] to-[#7c56ff] px-3 py-1 text-xs font-medium text-white">
                                                    <Image
                                                        src="/images/timericon.svg"
                                                        width={20}
                                                        height={20}
                                                        alt=""
                                                        className="mr-2"
                                                    />
                                                    {timeLeft}
                                                </div>
                                            )}

                                        <p className="mt-2 text-[12px] text-white/60">
                                            Sold
                                            <span className="px-1 font-semibold text-yellow-300">
                                                {activeDraw?.totalTicketsPurchased?.toLocaleString() || 0}
                                            </span>
                                            tickets
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="text-[#877ea3]" />
                                </div>
                            </div>
                        </Link>

                        {isCompletedDrawExpired && (
                        <Link href={"/user/draw-result"} className="block rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)] p-3 backdrop-blur-md relative">
                            <span className="rounded-full bg-green-500/20 px-2 py-1 text-[10px] font-semibold text-green-300 absolute right-2 top-2">
                                Completed
                            </span>
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-4 self-stretch flex items-center bg-[#0d072f]/40 rounded-[12px] relative">
                                    <Image width={100} height={100} alt=""
                                        src="/images/fball.png"
                                        className="h-auto w-full object-contain max-w-[90%] mr-auto  rounded-[12px]"
                                    />
                                    <div className="w-[1px] h-[47px] bg-[linear-gradient(-90deg,#1d0d49_0%,#392343_50%,#0f0831_100%)] opacity-90 absolute right-0 top-1/2 -translate-y-1/2" />
                                </div>

                                <div className="col-span-8 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-white">
                                                Draw {completedDraw?.bidNo || '-'}
                                            </h3>
                                        </div>

                                        <p className="text-xs text-[#c7bfff]">
                                            {completedDraw?.drawDate
                                                ? dateFormat(completedDraw.drawDate)
                                                : "-"}
                                        </p>

                                        {winningDigits.length > 0 && (
                                            <>
                                                <p className="mt-2 text-[10px] text-white/70">
                                                    Winning Number
                                                </p>

                                                <div className="mt-1 flex gap-1">
                                                    {winningDigits.map((digit, index) => {
                                                        const ballData = colorBalls.find(
                                                            (ball) => ball.digit === Number(digit)
                                                        );

                                                        return (
                                                            <div key={index} className="relative">
                                                                <img
                                                                    src={
                                                                        ballData?.color ||
                                                                        "/images/blue-ball.svg"
                                                                    }
                                                                    className="w-8"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <ChevronRight size={18} className="text-[#877ea3]" />
                                </div>
                            </div>
                        </Link>
                        )}
                    </div>
                </section>

                {/* REWARDS */}
                <section className="mt-6">
                    <h2 className="mb-3 text-lg font-medium text-white">
                        Your Rewards 
                    </h2>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {rewardcoupon.map((coupon, index) => {
                            // ✅ profileData se check kar (profile.data.welcomebonus)
                            const isActive = 
                                coupon.conditionKey === "welcomebonus" 
                                    ? profileData?.welcomebonus 
                                    : profileData?.[coupon.conditionKey as keyof typeof profileData];

                            return (
                                <div
                                    key={index}
                                    className="min-w-[65px] rounded-xl border border-[#653d49] bg-[#1a0845]/80 p-2 text-center flex flex-col justify-between"
                                >
                                    <Image
                                        src={coupon.image}
                                        alt={coupon.title}
                                        width={80}
                                        height={80}
                                        className="mx-auto mb-2"
                                    />
                                    <div>
                                        <p className="text-[10px] text-white leading-tight">
                                            {coupon.title}
                                        </p>

                                        {isActive ? (
                                            <button
                                                onClick={() => handleRedeemSubmit(coupon.conditionKey)}
                                                className="mt-2 w-full rounded-full cursor-pointer bg-gradient-to-b from-[#FEDB1E] to-[#E48A06] py-1 text-[10px] font-bold text-black hover:scale-105 transition"
                                            >
                                                Redeem
                                            </button>
                                        ) : (
                                            <button className="opacity-50 mt-2 w-full rounded-full bg-gray-400 py-1 text-[10px] font-bold text-gray-600 cursor-not-allowed">
                                                Coming Soon
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* RECENT ACTIVITY */}
                <section className="mt-6 ">
                    <style>{slideInStyle}</style>
                    <h2 className="mb-3 text-lg font-medium text-white">
                        Recent Activity
                    </h2>

                    <div className="opacity-70 rounded-2xl border border-[#7c56ff]/30 bg-[#1a0845]/80 p-3">
                        <div className="space-y-3">
                            {activities.length === 0 && (
                                <p className="text-sm text-white/50 text-center py-4">
                                    No recent activity
                                </p>
                            )}
                            {activities.map((item) => {
                                const name = `${item.customerId.firstname} ${item.customerId.lastname}`;
                                const isEarned = item.activity.toLowerCase().includes("earned");
                                const isNew = newIds.has(item._id);

                                return (
                                    <div
                                        key={item._id}
                                        className={`flex items-center gap-3 border-b border-white/10 pb-3 last:border-none ${isNew ? "slide-in" : ""}`}
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7c56ff] to-[#4d2db8] shrink-0">
                                            <Image
                                                src={
                                                    isEarned
                                                        ? "/images/winning-thumb.png"
                                                        : "/images/purchase-thumb2.png"
                                                }
                                                alt={isEarned ? "winning" : "purchase"}
                                                width={36}
                                                height={36}
                                                className="h-9 w-9 object-contain"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">
                                                <span className="text-[#a56ee9]">{name}</span>{" "}
                                                {item.activity.replace(name, "").trim()}
                                            </p>

                                            <p className="text-xs text-white/70">
                                                Draw {item.drawNumber} •{" "}
                                                {item.activityDateTime
                                                    ? dateFormat(item.activityDateTime)
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

            </div>
        </section>
    );
}