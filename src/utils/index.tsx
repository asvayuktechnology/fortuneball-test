import toast from "react-hot-toast";
import moment from 'moment';

import Ambassador from '../../public/rank/AMBASSADOR.png'
import Champion from '../../public/rank/CHAMPION.png'
import Crown from '../../public/rank/CROWN-AMBASSADOR.png'
import Executive from '../../public/rank/EXECUTIVE.png'
import Navigator from '../../public/rank/NAVIGATOR.png'
import Pioneer from '../../public/rank/PIONEER.png'
import { StaticImageData } from "next/image";

export type RankKey = "Executive" | "Manager" | "Zonal Manager" | "Director" | "VP";
 
 
export interface RankDetails {
  name: string;
  image: string | StaticImageData; // Adjust to 'StaticImageData' if using Next.js with 'next/image'
}

export const rankBadges: Record<RankKey, RankDetails> = {
  Executive: { name: "Executive", image: Executive },
  Manager: { name: "Manager", image: Champion },
  "Zonal Manager": { name: "Zonal Manager", image: Navigator },
  Director: { name: "Director", image: Pioneer },
  VP: { name: "VP", image: Ambassador },
};

export function getRankDetails(rankKey: string): RankDetails | null {
  return rankBadges[rankKey as RankKey] || null;
}

export type Captcha = {
  question: string;
  answer: number;
};

export function generateCaptcha(): Captcha {
  const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10

  const question = `${num1} + ${num2}`;
  const answer = num1 + num2;

  return { question, answer };
}

export const isOver18YearsOld = (dateString: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dateString);

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copy successfully");
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

export function formatAmountToMillions(amount: number): string {
  const inMillions = amount / 1_000_000;

  // Format to 2 decimal places and include commas
  const formatted = inMillions.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formatted}M`;
}

export function dateTimeFormat(value: string): string {
  return moment(value).format('D MMMM YYYY, h:mm A');
}
export function dateFormat(value: string): string {
  return moment(value).format('DD MMMM YYYY');
}

export const getCountdown = (targetDate?: string): string => {
  if (!targetDate) return "Invalid date";

  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();

  const distance = target - now;

  if (distance <= 0) {
    return "Expired";
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  // OPTIONAL FORMATTING
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnailUrl = (videoId: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  // Show first 2 characters, mask the rest (at least 2 *)
  const visibleLength = Math.min(2, localPart.length);
  const visible = localPart.slice(0, visibleLength);
  const maskedLength = Math.max(2, localPart.length - visibleLength);
  const masked = "*".repeat(maskedLength);

  return `${visible}${masked}@${domain}`;
};

export const maskWallet = (text: string): string => {
  if (!text || text.length <= 10) return text; // Return as-is if too short to mask
  
  const firstFive = text.slice(0, 5);
  const lastFive = text.slice(-5);
  
  return `${firstFive}****${lastFive}`; // Always shows exactly 4 stars in middle
};


export const checkDivisibleBy10 = (value: string | number): boolean => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num % 10 === 0;
};


export const EXCLUDED_WALLETS = new Set([
  "bnb",
  // "usdt",
  // add more wallet values here
]);

// utils/prize.ts

export const getMatchedNumbers = (prizeLevel?: number) => {
  const map: Record<number, number> = {
    1: 6,
    2: 5,
    3: 4,
    4: 3,
    5: 2,
  };

  return map[prizeLevel || 0] || 0;
};

export const prizeLevelLabel: Record<number, string> = {
  1: "Jackpot!!!",
  2: "Grand Prize",
  3: "Major Prize",
  4: "Lucky Prize",
  5: "Consolation Prize",
};