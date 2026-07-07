"use client";

import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomCarouselProps {
    children: ReactNode[];
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    showArrows?: boolean;
}

export default function CustomCarousel({
    children,
    autoPlay = true,
    interval = 3000,
    showDots = false,
    showArrows = true,
}: CustomCarouselProps) {
    const [current, setCurrent] = useState(0);

    const totalSlides = children.length;

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        if (!autoPlay || totalSlides <= 1) return;

        const timer = setInterval(nextSlide, interval);

        return () => clearInterval(timer);
    }, [current, autoPlay, interval, totalSlides]);

    return (
        <div className="relative overflow-hidden w-full">
            {/* Slides */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        className="w-full shrink-0"
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Arrows */}
            {showArrows && totalSlides > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 text-white"
                    >
                        <ChevronLeft className="text-[#cecece]" size={30} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-white"
                    >
                        <ChevronRight className="text-[#cecece]" size={30} />
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && totalSlides > 1 && (
                <div className="mt-3 flex justify-center gap-2">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-2 w-2 rounded-full transition-all ${current === index
                                ? "bg-[#b24cff] w-5"
                                : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}