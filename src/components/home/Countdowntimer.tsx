import { useFetchActiveBid } from '@/services/ticket';
import { getCountdown } from '@/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface CountdowntimerProps {
    ticketPurchased?: number;
    onComplete?: (value:boolean)=>void;
}

const Countdowntimer = ({ ticketPurchased, onComplete }: CountdowntimerProps) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);

    const { data: bidData, isLoading, error } = useFetchActiveBid();

    useEffect(() => {
        if (!bidData?.data?.drawTime) return;

        const interval = setInterval(() => {
            const countdown = getCountdown(bidData.data.drawTime);

            setTimeLeft(countdown);
           

            // timer end check
            if (
                countdown === "" ||
                countdown === "00h : 00m : 00s"
            ) {
                setIsCompleted(true);
                onComplete?.(true);
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [bidData]);


    return (
        <>
            <div className="flex items-center justify-between w-full">

                {/* Timer / Closed */}
                        <div
                            className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${
                                isCompleted
                                    ? "bg-gradient-to-t from-red-600 to-red-400"
                                    : "bg-gradient-to-t from-[#b25cff] to-[#7c56ff]"
                            }`}
                        >
                    {isLoading ? (
                        <p className="text-[18px] font-bold">
                            Loading...
                        </p>

                    ) : error ? (

                        <p className="text-[13px] font-medium">
                            Draw info unavailable
                        </p>

                    ) : isCompleted ? (

                        <p className="text-[12px] font-bold px-2 py-0.5">
                            Closed
                        </p>

                    ) : (

                        <p className="text-[12px] font-bold text-white flex items-center px-2 py-0.5 mb-0">

                            <Image
                                src="/images/timericon.svg"
                                width={22}
                                height={22}
                                alt=""
                                className="mr-2"
                            />

                            {timeLeft}

                        </p>
                    )}

                </div>


                {/* Sold */}
                <p className="mt-2 text-[12px] text-white/60">
                    Sold
                    <span className="px-1 font-semibold text-yellow-300">
                        {ticketPurchased?.toLocaleString() || 0}
                    </span>
                    tickets
                </p>

            </div>


            {/* Completed task only after timer end */}
            {/* {isCompleted && (
                <div className="mt-2 text-[12px] text-red-500 text-center">
                    Completed Task
                </div>
            )} */}

        </>
    );
};

export default Countdowntimer;