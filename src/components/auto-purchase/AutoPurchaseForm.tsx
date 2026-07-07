"use client";

import Image from "next/image";
import { Minus, Plus, Wallet, Zap } from "lucide-react";

interface WalletOption {
  label: string;
  value: string;
}

interface Props {
  tickets: number;
  wallet: string;
  walletOptions: WalletOption[];
  autoEnabled: boolean;

  onTicketChange: (value: number) => void;
  onWalletChange: (value: string) => void;
  onToggle: () => void;
  onSave: () => void;
}

const PRICE_PER_TICKET = 1;

export default function AutoPurchaseForm({
  tickets,
  wallet,
  walletOptions,
  autoEnabled,
  onTicketChange,
  onWalletChange,
  onToggle,
  onSave,
}: Props) {
  const total = tickets * PRICE_PER_TICKET;

  return (
    <div
      className="
      rounded-[22px]
      border
      border-[#9a4cee]
      bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
      p-5
      shadow-[0_0_25px_rgba(124,86,255,.18)]
    "
    >
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="h-14 w-14 rounded-full bg-[#7c56ff]/15 border border-[#9a4cee] flex items-center justify-center">
          <Image
            src="/images/ticketthumb.png"
            alt=""
            width={28}
            height={28}
          />
        </div>

        <div>
          <h2 className="text-white font-semibold text-[15px]">
            Configure Auto Purchase
          </h2>

          <p className="text-[10px] text-white/60 mt-1">
            Tickets will be purchased automatically for every draw.
          </p>
        </div>
      </div>

      {/* Ticket Counter */}

      <div className="mb-5">
        <label className="text-[10px] text-[#d8b8ff] block mb-2">
          Number of Tickets
        </label>

        <div className="rounded-xl border border-[#9a4cee] bg-[#281355]/60 px-3 py-3 flex items-center justify-between">

          <button
            onClick={() => onTicketChange(Math.max(1, tickets - 1))}
            className="
            h-9
            w-9
            rounded-lg
            bg-[#7c56ff]/20
            flex
            items-center
            justify-center
            hover:bg-[#7c56ff]/35
            transition
          "
          >
            <Minus size={16} className="text-white" />
          </button>

          <div className="text-center">
            <h3 className="text-white text-[22px] font-bold">
              {tickets}
            </h3>

            <p className="text-[8px] text-white/40">
              Tickets
            </p>
          </div>

          <button
            onClick={() => onTicketChange(tickets + 1)}
            className="
            h-9
            w-9
            rounded-lg
            bg-[#7c56ff]
            flex
            items-center
            justify-center
            hover:scale-105
            transition
          "
          >
            <Plus size={16} className="text-white" />
          </button>

        </div>
      </div>

      {/* Wallet */}

      <div className="mb-5">
        <label className="text-[10px] text-[#d8b8ff] block mb-2">
          Purchase Wallet
        </label>

        <div className="relative">

          <Wallet
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a87dff]"
            size={18}
          />

          <select
            value={wallet}
            onChange={(e) => onWalletChange(e.target.value)}
            className="
            w-full
            rounded-xl
            border
            border-[#9a4cee]
            bg-[#281355]/60
            py-3
            pl-11
            pr-4
            text-[11px]
            text-white
            outline-none
          "
          >
            {walletOptions.map((item) => (
              <option
                key={item.value}
                value={item.value}
                className="bg-[#2d115c]"
              >
                {item.label}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Auto Toggle */}

      <div className="mb-5 rounded-xl border border-[#9a4cee] bg-[#281355]/60 px-4 py-4">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-lg bg-[#7c56ff]/20 flex items-center justify-center">
              <Zap size={18} className="text-[#d5b6ff]" />
            </div>

            <div>
              <h4 className="text-white text-[12px] font-semibold">
                Enable Auto Purchase
              </h4>

              <p className="text-[9px] text-white/45">
                Buy tickets automatically
              </p>
            </div>

          </div>

          <button
            onClick={onToggle}
            className={`relative h-7 w-14 rounded-full transition-all ${
              autoEnabled
                ? "bg-[#8a45ff]"
                : "bg-[#47306b]"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                autoEnabled
                  ? "right-1"
                  : "left-1"
              }`}
            />
          </button>

        </div>

      </div>

      {/* Cost */}

      <div
        className="
        rounded-xl
        border
        border-[#6b3ad3]
        bg-[#201042]
        px-4
        py-4
        mb-6
      "
      >
        <div className="flex justify-between mb-2">
          <span className="text-[10px] text-white/60">
            Ticket Price
          </span>

          <span className="text-[10px] text-white">
            1 MTHT
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[11px] font-semibold text-white">
            Estimated Cost
          </span>

          <span className="text-[18px] font-bold text-[#ffd24b]">
            {total} MTHT
          </span>
        </div>
      </div>

      {/* Save */}

      <button
        onClick={onSave}
        className="
        w-full
        rounded-xl
        py-3.5
        font-semibold
        text-white
        bg-[linear-gradient(180deg,#b14cff_0%,#7b16f5_100%)]
        shadow-[0_0_25px_rgba(124,86,255,.3)]
        transition
        hover:scale-[1.02]
        active:scale-100
      "
      >
        Save Auto Purchase
      </button>
    </div>
  );
}   