'use client';

import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date('2025-06-20T00:00:00'); // ⏳ Change this to your desired target date
    const now = new Date();
    const difference = +targetDate - +now;

    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative top-12">
      <div className="text-center">
        <h1 className="text-white text-[45px]">USDT</h1>
        <h2 className="text-white text-2xl">Token Listing</h2>
      </div>

      <div className="w-full text-center mt-6">
        <div className="inline-flex justify-center gap-4 flex-wrap">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-white/10 px-4 py-2 rounded-md min-w-[80px]"
            >
              <span className="text-3xl font-bold text-white">
                {formatNumber(item.value)}
              </span>
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
