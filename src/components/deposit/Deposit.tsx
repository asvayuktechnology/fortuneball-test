"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FaCopy, FaChevronDown, FaWallet } from "react-icons/fa";
import { MdClose, MdCheckCircle } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";

import {
  WALLET_OPTIONS,
  WALLET_ADDRESSES,
  QR_CODE_URL,
  ADMIN_WALLET_ADDRESS,
} from "@/libs/api/const";

import { useUploadScreenshot } from "@/services/customerService";
import { StaticImageData } from "next/image";
import PageTitle from "../ui/common/pagetitle/PageTitle";
import { copyToClipboard } from "@/utils";
import PayWithWalletModal from "../ui/Paywithwalletmodal";

/* ─────────────────────── validation schema ─────────────────────── */
const validationSchema = z.object({
  screenshot: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "File is required",
    })
    .refine((files) => files.length > 0, { message: "File is required" })
    .refine(
      (files) =>
        ["image/png", "image/jpg", "image/jpeg"].includes(files[0].type),
      { message: "Only PNG, JPG, and JPEG files are allowed" }
    ),
});

type DepositFormData = z.infer<typeof validationSchema>;
type WalletAddressesType = typeof WALLET_ADDRESSES;
type WalletKey = keyof WalletAddressesType;

interface WalletOption {
  label: string;
  key: WalletKey;
  walletimg: string | StaticImageData;
}

/* ─────────────────────── connect-wallet options (manual deposit banner) ─── */
type ConnectorId = "metamask" | "trustwallet";

const CONNECTORS: {
  id: ConnectorId;
  name: string;
  img: string;
  deeplink?: string;
}[] = [
    {
      id: "metamask",
      name: "MetaMask",
      img: "/wallet/meta-mask.png",
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      img: "/wallet/trustwallet.png",
      deeplink: "https://link.trustwallet.com/open_url?coin_id=20000714&url=",
    },
  ];

/* ─────────────────────── helpers ─────────────────────────────────── */
function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isTrustWallet?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

async function connectMetaMask(): Promise<string> {
  if (!window.ethereum?.isMetaMask) {
    window.open("https://metamask.io/download/", "_blank");
    throw new Error("MetaMask not installed");
  }
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  return accounts[0];
}

async function connectTrustWallet(): Promise<string> {
  // Trust Wallet injects window.ethereum on mobile / browser extension
  const isTrust =
    window.ethereum?.isTrust || window.ethereum?.isTrustWallet;

  if (isTrust || window.ethereum) {
    try {
      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[];
      return accounts[0];
    } catch {
      // fall-through to deep-link
    }
  }

  // Mobile: open deep-link
  const currentUrl = encodeURIComponent(window.location.href);
  window.open(
    `https://link.trustwallet.com/open_url?coin_id=20000714&url=${currentUrl}`,
    "_blank"
  );
  throw new Error("Trust Wallet not installed — opening app");
}

/* ═══════════════════════ Connect Wallet Modal ═══════════════════════ */
interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
  onConnected: (address: string, provider: ConnectorId) => void;
}

function ConnectWalletModal({
  open,
  onClose,
  onConnected,
}: ConnectWalletModalProps) {
  const [connecting, setConnecting] = useState<ConnectorId | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleConnect = async (id: ConnectorId) => {
    setConnecting(id);
    try {
      let address = "";
      if (id === "metamask") address = await connectMetaMask();
      else address = await connectTrustWallet();
      toast.success(`${id === "metamask" ? "MetaMask" : "Trust Wallet"} connected!`);
      onConnected(address, id);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Connection failed");
    } finally {
      setConnecting(null);
    }
  };

  return (
    /* backdrop */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* panel */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1a2e] shadow-2xl p-6">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition cursor-pointer"
          aria-label="Close"
        >
          <MdClose size={22} />
        </button>
        <h2 className="mb-6 text-xl font-bold text-white">Select Wallet</h2>

        <div className="flex flex-col gap-3">
          {CONNECTORS.map((c) => (
            <button
              key={c.id}
              disabled={connecting !== null}
              onClick={() => handleConnect(c.id)}
              className={`flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left transition hover:border-[#7c56ff]/60 hover:bg-[#7c56ff]/10 active:scale-95 cursor-pointer
                ${connecting === c.id ? "opacity-70 animate-pulse" : ""}
              `}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 overflow-hidden shrink-0">
                <Image
                  src={c.img}
                  alt={c.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </div>
              <span className="flex-1 text-base font-semibold text-white">
                {c.name}
              </span>
              {connecting === c.id && (
                <svg
                  className="h-5 w-5 animate-spin text-[#7c56ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-white/30">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════ Deposit Component ══════════════════════════ */
const Deposit: React.FC = () => {
  const [resetKey, setResetKey] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  /* wallet state (manual deposit banner — display only) */
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedProvider, setConnectedProvider] = useState<ConnectorId | null>(null);

  /* NEW: Pay with Wallet (direct on-chain deposit) modal */
  const [payModalOpen, setPayModalOpen] = useState(false);

  const { mutateAsync: uploadScreenshot } = useUploadScreenshot();

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepositFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { screenshot: undefined },
  });

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const onSubmit = async (data: DepositFormData): Promise<void> => {
    const files = data.screenshot;
    if (!files || files.length === 0) { toast.error("No file selected"); return; }

    const formData = new FormData();
    formData.append("screenshot", files[0]);

    try {
      const result = await uploadScreenshot(formData);
      toast.success((result as { message?: string })?.message || "Upload successful");
      reset();
      setResetKey((prev) => prev + 1);
    } catch (error: any) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Upload failed");
    }
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
    setConnectedProvider(null);
    toast.success("Wallet disconnected");
  };

  /* NEW: handle successful on-chain deposit from PayWithWalletModal */
  const handleDepositSuccess = (payload: { txHash: string; amount: string; from: string }) => {
    console.log("[Deposit Page] Deposit completed successfully:", payload);
    // e.g. refetch wallet balance / transaction list here
    // queryClient.invalidateQueries({ queryKey: ["wallet_balance"] });
    // queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const providerLabel =
    connectedProvider === "metamask" ? "MetaMask" :
      connectedProvider === "trustwallet" ? "Trust Wallet" : "";

  return (
    <div className="relative min-h-screen">
      <div className="max-w-md mx-auto mt-10 px-[24px]">
        <ConnectWalletModal
          open={walletModalOpen}
          onClose={() => setWalletModalOpen(false)}
          onConnected={(addr, provider) => {
            setConnectedAddress(addr);
            setConnectedProvider(provider);
          }}
        />

        {/* NEW: direct on-chain deposit modal */}
        <PayWithWalletModal
          open={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          onSuccess={handleDepositSuccess}
        />

        <div className="grid gap-x-8">
          <div className="rounded-md p-6 pt-0 text-slate-200">
            <h1 className="mb-5 text-center text-[21px] font-bold text-white">
              Deposit
            </h1>

            {/* ── NEW: Pay with Wallet — quick CTA ── */}
            <div className="mx-auto max-w-[35rem] mb-4">
              <button
                onClick={() => setPayModalOpen(true)}
                className="group relative
overflow-hidden
rounded-[18px]
border
border-[#9a4cee]
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]
px-[15px]
py-[18px]
shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7c56ff]/15">
                    <HiOutlineLightningBolt className="text-[#c7bfff]" size={22} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Pay with Wallet</p>
                    <p className="text-[11px] text-[#b8a7ef]">
                      Instant USDT (BEP20) deposit via MetaMask / Trust Wallet
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)] px-4
py-2 text-xs font-bold text-[#1a1a2e] transition group-hover:scale-105">
                  Deposit
                </span>
              </button>
            </div>

            {/* divider */}
            <div className="flex items-center my-[24px]">
              <div className="flex-1 h-px bg-[#4b227b]" />

              <span className="px-3 text-[8px] uppercase tracking-[2px] text-[#8b7ca9]">
                Manual Deposit
              </span>

              <div className="flex-1 h-px bg-[#4b227b]" />
            </div>

            {/* ── Wallet Connection Banner (manual / display) ── */}
            {/* <div className="mx-auto max-w-[35rem] mb-6">
            {connectedAddress ? (
              <div className="flex items-center justify-between rounded-xl border border-[#7c56ff]/30 bg-[#1a0d40] px-4 py-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={`/wallet/${connectedProvider === "metamask" ? "meta-mask" : "trustwallet"}.png`}
                    alt={providerLabel}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                  <div>
                    <p className="text-[10px] text-[#b8a7ef] uppercase tracking-widest">
                      {providerLabel} Connected
                    </p>
                    <p className="text-sm font-mono font-semibold text-white">
                      {shortAddress(connectedAddress)}
                    </p>
                  </div>
                  <MdCheckCircle className="text-green-400" size={18} />
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-[#b8a7ef] hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition hover:border-white/30 cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-[#7c56ff]/40 bg-[#1a0d40]/60 py-3.5 text-sm font-semibold text-[#c7bfff] transition hover:border-[#7c56ff] hover:text-white hover:bg-[#1a0d40] cursor-pointer"
              >
                <FaWallet size={15} />
                Connect Wallet
              </button>
            )}
          </div> */}

            {/* ── Deposit Wallet Accordion ── */}
            <div className="mx-auto max-w-[35rem]">
              {(WALLET_OPTIONS as WalletOption[]).map((elm, i) => {
                const walletAddress = WALLET_ADDRESSES[elm.key];
                const isOpen = activeIndex === i;

                return (
                  <div
                    key={elm.key}
                    className="mb-4 rounded-2xl
border
border-[#9a4cee]
overflow-hidden
bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)]"
                  >
                    <h2>
                      <button
                        className={`flex w-full cursor-pointer items-center justify-between px-[12px] py-2 text-left transition-colors hover:bg-white/5 ${isOpen ? "border-b border-white/10" : ""}`}
                        type="button"
                        onClick={() => toggleAccordion(i)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10 p-1.5">
                            <Image
                              src={
                                typeof elm.walletimg === "string"
                                  ? elm.walletimg
                                  : elm.walletimg
                              }
                              width={42}
                              height={42}
                              alt={elm.key}
                              className="w-[42px]
rounded-full
bg-[#ffffff10]
flex
items-center
justify-center object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[12px]
font-semibold uppercase text-white">
                              {elm.key}
                            </p>
                          </div>
                        </div>

                        <FaChevronDown
                          className={`h-4 w-4 shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    </h2>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="p-6">
                        {/* QR Code */}
                        <div className="mx-auto mb-5 flex w-fit justify-center rounded-xl bg-white p-3 shadow-inner">
                          <Image
                            src={`${QR_CODE_URL}/?size=160x160&data=${walletAddress}`}
                            alt={`${elm.label} QR Code`}
                            width={160}
                            height={160}
                            className="h-auto w-auto"
                            unoptimized
                          />
                        </div>

                        <div className="mb-1 text-center text-xs text-[#b8a7ef]">
                          Wallet Address
                        </div>

                        <div className="mb-5 flex items-center justify-center gap-2">
                          <p className="max-w-[280px] break-all text-center text-sm font-medium text-white">
                            {walletAddress}
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(walletAddress)}
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]  px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_50%)] hover:scale-105 active:scale-95"
                          >
                            <FaCopy className="text-sm" />
                            Copy Address
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;