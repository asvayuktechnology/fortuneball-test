"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { colorBalls } from "@/utils/constant";

import "swiper/css";
import "swiper/css/navigation";
import { DrawRecord } from "@/types/ticket";
import { dateFormat } from "@/utils";
import Link from "next/link";

interface DrawBall {
    digit: number;
    color: string;
}

interface Draw {
    id: string;
    date: string;
    balls: DrawBall[];
}

const getBall = (digit: number): DrawBall => colorBalls[digit];


interface PreviousDrawsProps {
  draws: DrawRecord[];
  onSelect: (id: string) => void;
}
export default function PreviousDraws({ draws, onSelect }: PreviousDrawsProps) {
  const previousDraws = draws.map((draw) => ({
  id: draw.bidNo,
  date: dateFormat(draw.drawDate),
  balls: String(draw.winningNumber || "")
    .split("")
    .map((digit) => ({
      digit: Number(digit),
      color:
        colorBalls.find(
          (ball) => ball.digit === Number(digit)
        )?.color || "/images/blue-ball.svg",
    })),
}));
  return (
    <section className="relative w-full overflow-hidden bg-[#19093d] pb-6">
      <div className="relative z-10 mx-auto max-w-[605px]">
        {/* Header */}
        <div className="mb-[8px] flex items-center justify-between px-[30px]">
          <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2px] text-[#ddd7ed]">
            <Image
              src="/images/ticketthumb.png"
              width={23}
              height={23}
              alt="Ticket"
              className="h-auto"
            />

                        <span>Previous Draws</span>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-1 text-[11px] text-[#ddd7ed] transition hover:text-white"
                    >
                        View All Draws
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

        {/* Slider */}
        <div className="flex items-center gap-[4px]">
          {/* Left Arrow */}
          <button
            type="button"
            className="previous-draws-prev shrink-0 cursor-pointer"
            aria-label="Previous draws"
          >
            <Image
              src="/images/resultslider-leftarrow.svg"
              width={25}
              height={25}
              alt="Previous"
            />
          </button>
          
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".previous-draws-prev",
              nextEl: ".previous-draws-next",
            }}
            slidesPerView={3}
            spaceBetween={8}
            slidesPerGroup={1}
            loop={false}
            className="w-full"
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 8,
              },
              420: {
                slidesPerView: 3,
                spaceBetween: 8,
              },
            }}
            
          >
            {previousDraws.map((draw) => (
              <SwiperSlide key={draw.id} >
                <Link href={"#jackpot"}>
                <div   onClick={() => onSelect(draw.id)}  className="min-h-[95px] w-full rounded-[12px] border-[1.5px] border-[#9a4cee] bg-[linear-gradient(180deg,rgba(72,18,130,0.28)_0%,rgba(28,6,74,0.45)_100%)] px-[12px] py-[12px] shadow-[inset_0_0_12px_rgba(160,50,255,0.12),0_0_7px_rgba(133,23,255,0.2)] cursor-pointer">
                  <p className="mb-1 mt-[7px] text-center text-[9px] font-semibold text-[#b6a9c7]">
                    # {draw.id}
                  </p>

                                        <p className="mb-[5px] text-center text-[6px] text-[#b6a9c7]">
                                            {draw.date}
                                        </p>

                                        <div className="grid grid-cols-3 justify-items-center gap-x-[6px] gap-y-[2px]">
                                            {draw.balls.map((ball, ballIndex) => (
                                                <div
                                                    key={`${draw.id}-${ball.digit}-${ballIndex}`}
                                                    className="relative h-[20px] w-[20px]"
                                                >
                                                    <Image
                                                        src={ball.color.trim()}
                                                        alt={`Number ${ball.digit}`}
                                                        fill
                                                        sizes="20px"
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                </Link>
                                
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Right Arrow */}
                    <button
                        type="button" 
                        className="previous-draws-next shrink-0 cursor-pointer"
                        aria-label="Next draws"
                    >
                        <Image
                            src="/images/resultslider-rightarrow.svg"
                            width={25}
                            height={25}
                            alt="Next"
                        />
                    </button>
                    </div>

                </div>
    
        </section>
    );
}