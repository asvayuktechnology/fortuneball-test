"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import ActivePurchaseCard from "./ActivePurchaseCard";
import {
  useFetchAutoPurchaseDetails,
  useCancelAutoPurchase,
  useSaveAutoPurchase,
  useFetchCustomerWallet,
} from "@/services/customerService";
type WalletOptionDef = {
  key: string;
  value: string;
  title: string;
};

const fortuneBallWallets: WalletOptionDef[] = [
  { key: "biddepositwallet", value: "biddeposit", title: "MTHT Wallet" },
  // { key: "bidaffiliatewallet", value: "bidaffiliate", title: "Affiliate Reward" },
  { key: "bidrewardwallet", value: "bidreward", title: "Reward Wallet" },
  // { key: "bidbnbwallet", value: "bidbnb", title: "BNB Wallet" },
  // { key: "bidusdtwallet", value: "bidusdt", title: "USDT Wallet" },
  // { key: "bidbtcashwallet", value: "bidbtcash", title: "BTCASH Wallet" },
];

const fortuneNftWallets: WalletOptionDef[] = [
  { key: "depositwallet", value: "deposit", title: "MTHT Wallet" },
  { key: "stakingwallet", value: "staking", title: "Staking Wallet" },
  { key: "affiliatewallet", value: "affiliate", title: "Affiliate Wallet" },
  { key: "boosterwallet", value: "booster", title: "Booster Wallet" },
  { key: "royaltywallet", value: "royalty", title: "Reward Wallet" },
  // { key: "USDTWallet", value: "usdt", title: "USDT Wallet" },
  // { key: "BNBWallet", value: "bnb", title: "BNB Wallet" },
  // { key: "BTMETAWallet", value: "btmeta", title: "BTMETA Wallet" },
];

type AutoPurchaseData = {
  _id?: string;
  noOfTickets?: number;
  walletType?: string;
  enabledOn?: string;
  createdAt?: string;
};

export default function AutoPurchase() {
  const [tickets, setTickets] = useState(5);
  const [paymentType, setPaymentType] = useState<"fortune-ball" | "fortune-nft">("fortune-ball");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setSelectedWallet(activeWallets[0]?.value ?? "");
  }, [paymentType]);

  const { data: walletData } = useFetchCustomerWallet();
  const walletRecord = walletData as unknown as Record<string, number> | undefined;

  const activeWallets =
    paymentType === "fortune-ball" ? fortuneBallWallets : fortuneNftWallets;

  const walletOptions = activeWallets.map((w) => {
    const balance = walletRecord?.[w.key] ?? 0;
    return {
      value: w.value,
      label: `${w.title} (${balance.toFixed(2)})`,
    };
  });

  const {
    data: autoPurchaseData,
    isLoading,
    refetch,
  } = useFetchAutoPurchaseDetails();
  console.log("autoPurchaseData", autoPurchaseData);

  const { mutate: cancelMutate, isPending: isCancelling } =
    useCancelAutoPurchase();
  const { mutate: saveMutate, isPending: isSaving } = useSaveAutoPurchase();

  const details: AutoPurchaseData | undefined =
    autoPurchaseData?.data ?? autoPurchaseData;

  const handleSave = () => {
    saveMutate(
      { noOfTickets: tickets, walletType: selectedWallet },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Auto purchase saved successfully");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to save auto purchase");
        },
      }
    );
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    cancelMutate(undefined, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Auto purchase cancelled successfully");
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to cancel auto purchase");
      },
    });
  };

  const hasActive = !!details?.noOfTickets;

  return (
    <div className="relative min-h-screen">
      <div className="max-w-md mx-auto mt-10 px-[24px] pb-10">
        {/* Header */}
        <div className="relative mb-7">
          <h1 className="text-center text-[21px] font-bold text-white">
            Auto Purchase
          </h1>
          <Image
            src="/images/settingsicon.svg"
            alt=""
            loading="lazy"
            width="30"
            height="30"
            className="cursor-pointer absolute right-0 -top-2.5"
          />
        </div>

        {/* Setup Card */}
        <div className="rounded-2xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)] p-5">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-[#7c56ff]/20 flex items-center justify-center">
              <Image
                src="/images/ticketthumb.png"
                alt=""
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-white">
                Set Up Auto Purchase
              </h2>
              <p className="text-[10px] text-white/60 mt-1">
                Configure your automatic ticket purchase.
              </p>
            </div>
          </div>

          {/* Ticket */}
          <div className="mt-6">
            <label className="text-[10px] text-[#d5c8ff] mb-2 block">
              Number of Tickets
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#9a4cee] bg-[#2c135d]/50 px-4 py-3">
              <Image
                src="/images/ticketthumb.png"
                alt=""
                width={20}
                height={20}
              />
              <input
                type="number"
                min={5}
                value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                className="w-full bg-transparent outline-none text-white text-[15px] font-semibold"
              />
            </div>
            <p className="mt-2 text-[8px] text-white/50">
              Minimum 5 tickets per purchase
            </p>
          </div>

          {/* Wallet */}
          <div className="mt-5">
            <label className="text-[10px] text-[#d5c8ff] mb-2 block">
              Select Wallet
            </label>

            {/* Radio Toggle */}
            <div className="flex rounded-xl border border-[#9a4cee] bg-[#2c135d]/50 p-1 mb-3">
              <button
                onClick={() => setPaymentType("fortune-ball")}
                className={`flex-1 py-2.5 text-[11px] font-semibold cursor-pointer rounded-lg transition ${
                  paymentType === "fortune-ball"
                    ? "bg-[#7c56ff] text-white shadow"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Fortune Ball Wallet
              </button>
              <button
                onClick={() => setPaymentType("fortune-nft")}
                className={`flex-1 py-2.5 text-[11px] font-semibold cursor-pointer rounded-lg transition ${
                  paymentType === "fortune-nft"
                    ? "bg-[#7c56ff] text-white shadow"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Fortune NFT Wallet
              </button>
            </div>

            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full rounded-xl border border-[#9a4cee] bg-[#9a4cee]/25 px-4 py-4 text-white text-[11px] outline-none"
            >
              {walletOptions.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  className="bg-[#2b0d63]"
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-7 w-full cursor-pointer rounded-xl bg-[linear-gradient(180deg,#b54dff_0%,#7b16f5_100%)] py-3.5 flex items-center justify-center gap-2 font-semibold text-white shadow-[0_0_20px_rgba(150,80,255,0.35)] transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Auto Purchase"}
          </button>
        </div>

        {/* Active */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-white">
              Enabled Auto Purchase
            </h2>
            <p className="text-[10px] text-white/60 mt-1">
              Your currently active auto purchase setup.
            </p>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-[#9a4cee] py-8 text-center text-[11px] text-white/50">
              Loading...
            </div>
          )}

          {!isLoading && hasActive ? (
            <ActivePurchaseCard
              tickets={details!.noOfTickets!}
              wallet={
                [...fortuneBallWallets, ...fortuneNftWallets].find(
                  (w) => w.value === details!.walletType
                )?.title ?? details!.walletType ?? ""
              }
              address={details!.walletType ?? ""}
              enabledOn={
                details!.enabledOn ??
                (details!.createdAt
                  ? new Date(details!.createdAt).toLocaleString()
                  : "") ??
                ""
              }
              onCancel={handleCancel}
              isCancelling={isCancelling}
            />
          ) : !isLoading ? (
            <div className="rounded-2xl border border-dashed border-[#9a4cee] py-8 text-center text-[11px] text-white/50">
              No Active Auto Purchase
            </div>
          ) : null}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-[28px] border border-[#9a39e8] bg-[linear-gradient(180deg,#2a0a68_0%,#16053f_100%)] shadow-[0_0_30px_rgba(154,57,232,0.35)] p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-2">Cancel Auto Purchase</h2>
            <p className="text-sm text-[#cbb8ff] mb-8">Are you sure you want to cancel your auto purchase?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-full border border-[#9a39e8] py-3 font-semibold text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 rounded-full bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)] py-3 font-semibold text-black cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
