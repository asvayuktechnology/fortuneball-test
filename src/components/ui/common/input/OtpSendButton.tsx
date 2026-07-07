'use client';
import React, { useEffect, useState } from 'react';
import Button from './Button';

type ResendOtpButtonProps = {
  initialSeconds?: number;
  onResend: () => void;
  isLoading?: boolean;
};

const ResendOtpButton: React.FC<ResendOtpButtonProps> = ({
  initialSeconds = 60,
  onResend,
  isLoading = false,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const handleClick = () => {
    if (isActive || isLoading) return;

    setSeconds(initialSeconds);
    setIsActive(true);
    onResend();
  };

  return (
    <Button
      text={
        isActive
          ? `🚫 Resend in ${seconds}s`
          : 'Resend OTP'
      }
      onClick={handleClick}
      disabled={isActive || isLoading}
      isLoading={isLoading}
      disableStyle
      className={`
    rounded-full bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)] px-4   py-2 text-sm font-bold text-[#1a1a2e] transition group-hover:scale-105 w-full
    ${isActive || isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
  `}
    />

  );
};

export default ResendOtpButton;
