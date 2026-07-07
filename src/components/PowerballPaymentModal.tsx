"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useFetchCustomerWallet } from "@/services/customerService";

type PurchaseResult = {
  drawNumber: string;
  drawDate: string;
  tickets: number;
};

type Props = {
  open: boolean;
  paymentStep: "confirm" | "processing" | "success";
  totalFilledTickets: number;
  totalPrice: number;
  selectedWallet: string;
  purchaseResult?: PurchaseResult | null;
  onWalletChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  onGoToMyTickets?: () => void;
};

type WalletOptionDef = {
  key: string;
  value: string;
  title: string;
};

const fortuneBallWallets: WalletOptionDef[] = [
{ key: "biddepositwallet", value: "biddeposit", title: "MTHT Wallet" },
// { key: "bidaffiliatewallet", value: "bidaffiliate", title: "Affiliate Reward" },
{ key: "bidrewardwallet", value: "bidreward", title: "Reward Wallet" },
{ key: "bidbnbwallet", value: "bidbnb", title: "BNB Wallet" },
{ key: "bidusdtwallet", value: "bidusdt", title: "USDT Wallet" },
// { key: "bidbtcashwallet", value: "bidbtcash", title: "BTCASH Wallet" },
];

const fortuneNftWallets: WalletOptionDef[] = [
{ key: "depositwallet", value: "deposit", title: "MTHT Wallet" },
{ key: "stakingwallet", value: "staking", title: "Staking Wallet" },
{ key: "affiliatewallet", value: "affiliate", title: "Affiliate Wallet" },
{ key: "boosterwallet", value: "booster", title: "Booster Wallet" },
{ key: "royaltywallet", value: "royalty", title: "Reward Wallet" },
{ key: "USDTWallet", value: "usdt", title: "USDT Wallet" },
{ key: "BNBWallet", value: "bnb", title: "BNB Wallet" },
// { key: "BTMETAWallet", value: "btmeta", title: "BTMETA Wallet" },
];

export function SpinnerLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="loader">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            style={{
              transform: `rotate(${i * 30}deg)`,
              opacity: 1 - i * 0.08,
            }}
          />
        ))}
      </div>
      <style jsx>{`
.loader {
  width: 50px;
  height: 50px;
  position: relative;
  animation: spin 1s steps(12) infinite;
}

.loader span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 14px;
  margin-left: -2px;
  margin-top: -24px;

  border-radius: 999px;
  background: rgba(255,255,255,.8);

  transform-origin: center 24px;
}

.loader span:nth-child(1)  { transform: rotate(0deg);   opacity: 1; }
.loader span:nth-child(2)  { transform: rotate(30deg);  opacity: .80; }
.loader span:nth-child(3)  { transform: rotate(60deg);  opacity: .70; }
.loader span:nth-child(4)  { transform: rotate(90deg);  opacity: .60; }
.loader span:nth-child(5)  { transform: rotate(120deg); opacity: .50; }
.loader span:nth-child(6)  { transform: rotate(150deg); opacity: .40; }
.loader span:nth-child(7)  { transform: rotate(180deg); opacity: .30; background:#000;}
.loader span:nth-child(8)  { transform: rotate(210deg); opacity: .25; background:#000; }
.loader span:nth-child(9)  { transform: rotate(240deg); opacity: .20; background:#000; }
.loader span:nth-child(10) { transform: rotate(270deg); opacity: .15; background:#000;}
.loader span:nth-child(11) { transform: rotate(300deg); opacity: .10; background:#000; }
.loader span:nth-child(12) { transform: rotate(330deg); opacity: .5; background:#000 }

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
      `}</style>
    </div>
  );
}

export default function PowerballPaymentModal({
  open,
  paymentStep,
  totalFilledTickets,
  totalPrice,
  selectedWallet,
  purchaseResult,
  onWalletChange,
  onClose,
  onConfirm,
  onGoToMyTickets,
}: Props) {
  const [paymentType, setPaymentType] = useState<"fortune-ball" | "fortune-nft">(
    "fortune-ball"
  );

  const { data: wallet } = useFetchCustomerWallet();

  const walletRecord = wallet as unknown as Record<string, number> | undefined;

  const activeWallets =
    paymentType === "fortune-ball" ? fortuneBallWallets : fortuneNftWallets;

  const options = activeWallets.map((w) => {
    const balance = walletRecord?.[w.key] ?? 0;
    return {
      value: w.value,
      label: `${w.title} (${balance.toFixed(2)})`,
    };
  });

  const isSelectedValid = options.some((o) => o.value === selectedWallet);
  const displayWallet = isSelectedValid ? selectedWallet : options[0]?.value ?? "";

  useEffect(() => {
    if (!isSelectedValid && options.length > 0) {
      onWalletChange(options[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-[24px]">
      {paymentStep === "confirm" && (
        <div className="w-full rounded-2xl bg-[linear-gradient(175deg,#441772_20%,#210655_100%)] border border-[#7c56ff]/50 p-8 relative">
          <IoClose
            onClick={onClose}
            size={34}
            className="absolute right-4 top-4 bg-[#57356f] border p-1 border-[#795190] rounded-full cursor-pointer"
          />
          <h2 className="text-[21px] font-bold text-white mt-5 mb-2">
            Confirm Purchase
          </h2>

          <div className="space-y-1 text-[18px]">
            <p className="text-white text-[17px]">
              No of Tickets :{" "}
              <span className="font-bold">{totalFilledTickets}</span>
            </p>

            <p className="text-white text-[17px]">
              Total Value :{" "}
              <span className="font-bold">{totalPrice} MTHT</span>
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-[15px] text-white">Pay With</p>

            {/* Radio Options */}
            <div className="mb-5 flex items-center gap-8">
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  className={`flex h-7 w-7.5 items-center justify-center rounded-full border-3 transition ${
                    paymentType === "fortune-ball"
                      ? "border-[#ff9800]"
                      : "border-[#5a23b4]"
                  }`}
                  onClick={() => setPaymentType("fortune-ball")}
                >
                  {paymentType === "fortune-ball" && (
                    <div className="h-4.5 w-4.5 rounded-full bg-[#ffd000]" />
                  )}
                </div>

                <span className="text-[16px] font-semibold text-white">
                  Fortune Balls
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <div
                  className={`flex h-7 w-7.5 items-center justify-center rounded-full border-3 transition ${
                    paymentType === "fortune-nft"
                      ? "border-[#ff9800]"
                      : "border-[#5a23b4]"
                  }`}
                  onClick={() => setPaymentType("fortune-nft")}
                >
                  {paymentType === "fortune-nft" && (
                    <div className="h-4.5 w-4.5 rounded-full bg-[#ffd000]" />
                  )}
                </div>

                <span className="text-[16px] font-semibold text-white">
                  Fortune NFT
                </span>
              </label>
            </div>

            {/* Wallet Select */}
            <div className="relative">
              <select
                key={paymentType}
                value={displayWallet}
                onChange={(e) => onWalletChange(e.target.value)}
                className="
        w-full
        appearance-none
        rounded-2xl
        border
        border-[#652fa8]
        bg-[linear-gradient(340deg,#130743_0%,#2d0e61_69%,#43147b_100%)]
        px-20
        py-7
        text-lg
        font-semibold
        text-white
        cursor-pointer
      "
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#43147b]">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Wallet Icon */}
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Image src={"/images/shape-1.png"} width={50} height={50} alt="" />
              </div>

              <ChevronDown className="pointer-events-none absolute right-5 top-1/2  w-8 -translate-y-1/2 text-white" />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#54326c] border border-[#785494] rounded-full py-3 font-semibold text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 rounded-full bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,#ee8102_)100%)] py-3 font-semibold text-black cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {paymentStep === "processing" && (
        <div className="w-full rounded-2xl bg-[linear-gradient(175deg,#441772_20%,#210655_100%)] border border-[#7c56ff]/50 p-8 relative text-center">
          <div className="flex items-center justify-center">
            <Image
              alt=""
              src={"/images/ticketthumb.png"}
              width={200}
              height={200}
              className="mb-3"
            />
          </div>
          <h2 className="text-[18px] font-bold text-white">
            Processing Payment
          </h2>

          <div className="my-4 mt-6.5 flex justify-center">
            <SpinnerLoader />
          </div>

          <p className="text-[15px] leading-[20px] font-medium text-white">
            Please wait while we process your payment
          </p>
        </div>
      )}

      {paymentStep === "success" && (
        <div className="w-full relative rounded-2xl overflow-hidden bg-[linear-gradient(-88.7deg,#022720_0%,#011917_80%)] border border-[#34743b] p-8 py-5 text-center">
          <div className="absolute left-0 -top-1/2 rounded-full z-0 opacity-40 blur-2xl w-full h-full bg-[radial-gradient(circle,rgba(0,255,48,1)_0%,rgba(0,255,42,0)_100%)]" />

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full ">
            <Image
              className="absolute w-full top-8 z-1"
              src={"/images/confetti.png"}
              width={100}
              height={100}
              alt=""
            />
            <Image
              className="relative z-2"
              src={"/images/ticker.png"}
              width={100}
              height={100}
              alt=""
            />
          </div>

          <h2 className="relative z-2 mt-2.5 text-[18px] font-bold leading-[24px] text-white px-4">
            Ticket Purchased Successfully!
          </h2>

          <div className="mt-2.5 text-[16px] text-white">
            <Image
              src={"/images/ticketthumb.png"}
              className="mx-auto"
              width={150}
              height={150}
              alt=""
            />
            <p className="font-medium text-[#319429]">
              {purchaseResult?.tickets ?? totalFilledTickets} Ticket
            </p>
            <p>
              {purchaseResult?.drawNumber ?? "—"} .{" "}
              {purchaseResult?.drawDate
                ? new Date(purchaseResult.drawDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>

          <button
            onClick={onGoToMyTickets}
            className="mt-4 rounded-full w-full bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,#ee8102_)100%)] px-10 py-2.5 text-[14px] text-md font-semibold text-black cursor-pointer"
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
}