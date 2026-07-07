"use client";

import Image from "next/image";
import {
    CalendarDays,
    CreditCard,
    Ticket,
    Trash2,
    CircleCheckBig,
} from "lucide-react";

interface ActivePurchaseCardProps {
    tickets: number;
    wallet: string;
    address: string;
    enabledOn: string;
    onCancel: () => void;
    isCancelling?: boolean;
}

export default function ActivePurchaseCard({
    tickets,
    wallet,
    address,
    enabledOn,
    onCancel,
    isCancelling,
}: ActivePurchaseCardProps) {
    return (
        <div
            className="
      relative
      overflow-hidden
      rounded-[22px]
      border
      border-[#9a4cee]
      bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
      p-[18px]
      shadow-[0_0_30px_rgba(124,86,255,.18)]
    "
        >
            {/* Decorative Glow */}

            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#8f47ff]/20 blur-3xl" />

            <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#ffb800]/10 blur-3xl" />

            {/* Header */}

            <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
            h-14
            w-14
            rounded-full
            border
            border-[#9a4cee]
            bg-[#7c56ff]/15
            flex
            items-center
            justify-center
          "
                    >
                        <Image
                            src="/images/ticketthumb.png"
                            alt=""
                            width={28}
                            height={28}
                        />
                    </div>

                    <div>

                        <div className="flex items-center gap-2">

                            <h3 className="text-white text-[15px] font-semibold">
                                Auto Purchase
                            </h3>

                            <span
                                className="
                rounded-full
                bg-[#13d26b]
                px-2
                py-[2px]
                text-[8px]
                font-bold
                uppercase
                text-black
              "
                            >
                                Active
                            </span>

                        </div>

                        <p className="mt-1 text-[9px] text-white/55">
                            Purchases tickets automatically every draw.
                        </p>

                    </div>

                </div>

                <div className="relative">
                    <button
                        onClick={onCancel}
                        disabled={isCancelling}
                        className="
      h-10
      w-10
      rounded-xl
      border
      border-red-500/30
      bg-red-500/10
      flex
      items-center
      justify-center
      transition
      hover:bg-red-500/20
      cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    "
                    >
                        {isCancelling ? (
                          <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={17} className="text-red-400" />
                        )}
                    </button>
                </div>

            </div>

            {/* Divider */}

            <div className="my-5 h-px bg-white/10" />

            {/* Information */}

            <div className="grid grid-cols-2 gap-3">

                {/* Tickets */}

                <div
                    className="
          rounded-xl
          border
          border-[#7b56ff]/25
          bg-[#1d1046]/70
          p-3
        "
                >
                    <div className="flex items-center gap-2">

                        <Image src="/images/ticketthumb.png" alt="Ticket" width={26} height={26} />

                        <span className="text-[9px] text-white/55">
                            Tickets
                        </span>

                    </div>

                    <h3 className="mt-2 text-[22px] font-bold text-white">
                        {tickets}
                    </h3>

                    <p className="text-[8px] text-white/40">
                        Every Draw
                    </p>

                </div>

                {/* Wallet */}

                <div
                    className="
          rounded-xl
          border
          border-[#7b56ff]/25
          bg-[#1d1046]/70
          p-3
        "
                >
                    <div className="flex items-center gap-2">

                        <Image src="/images/wallet-2.svg" alt="Wallet" width={26} height={26} />

                        <span className="text-[9px] text-white/55">
                            Wallet
                        </span>

                    </div>

                    <h3 className="mt-2 text-[11px] font-semibold text-white">
                        {wallet}
                    </h3>

                    <p className="mt-1 text-[8px] text-white/35">
                        {address}
                    </p>

                </div>

            </div>

            {/* Enabled */}

            <div
                className="
        mt-4
        rounded-xl
        border
        border-[#7b56ff]/25
        bg-[#1d1046]/70
        p-3
      "
            >
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <Image src="/images/calandericon.png" alt="Wallet" width={26} height={26} />

                        <div>

                            <p className="text-[8px] text-white/45">
                                Enabled On
                            </p>

                            <h4 className="text-[11px] text-white mt-1">
                                {enabledOn}
                            </h4>

                        </div>

                    </div>

                    <CircleCheckBig
                        size={24}
                        className="text-[#00ff84]"
                    />

                </div>

            </div>

            {/* Footer */}

            {/* <div
                className="
        mt-5
        rounded-xl
        border
        border-[#f7c646]/25
        bg-[linear-gradient(180deg,#ffcf2d10,#ffcf2d05)]
        px-4
        py-3
      "
            >
                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-[8px] text-white/45">
                            Next Purchase
                        </p>

                        <h3 className="mt-1 text-[14px] font-semibold text-[#ffd24b]">
                            Next Draw
                        </h3>

                    </div>

                    <Image
                        src="/images/ticketthumb.png"
                        alt=""
                        width={36}
                        height={36}
                    />

                </div>
            </div> */}
        </div>
    );
}