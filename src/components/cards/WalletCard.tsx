'use client';

import Image, { StaticImageData } from 'next/image';
import { ChevronRight } from 'lucide-react';



interface WalletCardProps {
  title: string;
  amount?: number;
  usdtAmount?: number;
  wallet?: number;
  unit?: string;
imgsrc?: string | StaticImageData;
  
}



const walletImages: Record<string, string> = {
  "BNB Wallet": '/images/bnb.png',
  "BTCASH Wallet": '/images/bt.png',
  "BTMETA Wallet": '/images/bt.png',
  "Staking Wallet": '/images/staking.png',
  "Reward Wallet": '/images/reward.png',
  "Royalty Wallet": '/images/reward.png',
  "MTHT Wallet": '/images/mtht-tokenicon.png',
  "Deposit Wallet": '/images/mtht-tokenicon.png',
  "Affiliate Wallet": '/images/affiliate-wallet2.png',
  "Affiliate Reward": '/images/affiliate-wallet2.png',
  "USDT Wallet": '/images/usdt-tokenicon.png',
  "Booster Wallet": '/images/booster.png',
};

const WalletCard = ({
  title,
  amount,
  wallet,
  usdtAmount,
  unit = 'MTHT',
  imgsrc
}: WalletCardProps) => {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-2xl
        border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
        px-[12px] py-2
        shadow-[0_0_20px_rgba(124,86,255,0.15)]
      "
    >
      {/* ICON */}

      <Image
        src={walletImages[title] || "/images/shape-1.png"}
        alt={title}
        width={50}
        height={50}
        className="object-contain"
      />


      {/* CONTENT */}
      <div className="flex-1">
        <h3 className="text-[11px] font-semibold text-white">
          {title}
        </h3>

        <p className="text-[9px] text-white/60">
         Binance Smart Chain
        </p>
      </div>

      {/* BALANCE */}
      <div className="text-right">
        <h4 className="text-[11px] font-bold text-[#d69f22]">
          {(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          MTHT
        </h4>

        <p className="text-[9px] text-white/60">
          {(usdtAmount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          USDT
        </p>
      </div>

      {/* ARROW */}
      <ChevronRight
        size={18}
        className="text-white/50 shrink-0"
      />
    </div>
  );
};

export default WalletCard;