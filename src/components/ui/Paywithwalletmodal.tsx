"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { MdClose, MdCheckCircle, MdError, MdContentCopy } from "react-icons/md";
import { FaWallet, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";

import {
  ADMIN_WALLET_ADDRESS as ADMIN_WALLET_ADDRESS_RAW,
  USDT_CONTRACT_ADDRESS as USDT_CONTRACT_ADDRESS_RAW,
  BTCASH_CONTRACT_ADDRESS as BTCASH_CONTRACT_ADDRESS_RAW,
  MTHT_CONTRACT_ADDRESS as MTHT_CONTRACT_ADDRESS_RAW,
  BNB_CONTRACT_ADDRESS as BNB_CONTRACT_ADDRESS_RAW,
} from "@/libs/api/const";
import { copyToClipboard } from "@/utils";
import { useDepositWalletMutation } from "@/services/TransactionService";

// These consts may be typed as `string | undefined` depending on const.ts.
// Assert as string at module scope; runtime checks happen before use.
const ADMIN_WALLET_ADDRESS: string = ADMIN_WALLET_ADDRESS_RAW ?? "";
const USDT_CONTRACT_ADDRESS: string = USDT_CONTRACT_ADDRESS_RAW ?? "";
const BTCASH_CONTRACT_ADDRESS: string = BTCASH_CONTRACT_ADDRESS_RAW ?? "";
const MTHT_CONTRACT_ADDRESS: string = MTHT_CONTRACT_ADDRESS_RAW ?? "";
// const BNB_CONTRACT_ADDRESS: string = BNB_CONTRACT_ADDRESS_RAW ?? "";

/* ════════════════════════════════════════════════════════════════════
   CONFIG — BSC (BEP20) NETWORK
   ════════════════════════════════════════════════════════════════════ */

const BSC_CHAIN_ID_HEX = "0x38"; // 56 decimal — BNB Smart Chain Mainnet
const BSC_CHAIN_ID_DEC = 56;

const BSC_NETWORK_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

// minimal ERC20 ABI fragments we need (encoded manually, no ethers/web3 dependency)
// transfer(address,uint256)  => 0xa9059cbb
// balanceOf(address)         => 0x70a08231
const TRANSFER_SELECTOR = "a9059cbb";
const BALANCE_OF_SELECTOR = "70a08231";

/* ════════════════════════════════════════════════════════════════════
   TOKEN DEFINITIONS
   ════════════════════════════════════════════════════════════════════ */

type TokenKey = "USDT" | "BTCASH" | "MTHT" | "BNB";

interface TokenConfig {
  key: TokenKey;
  label: string;
  symbol: string;
  /** ERC20 contract address. Not used when isNative=true (BNB uses native transfer) */
  contract: string;
  decimals: number;
  icon: string;
  isNative: boolean;
}

const TOKENS: TokenConfig[] = [
  {
    key: "USDT",
    label: "USDT",
    symbol: "USDT",
    contract: USDT_CONTRACT_ADDRESS,
    decimals: 18, // USDT on BSC uses 18 decimals (NOT 6 like ERC20!)
    icon: "/images/usdt.png",
    isNative: false,
  },
  {
    key: "BTCASH",
    label: "BTCASH",
    symbol: "BTCASH",
    contract: BTCASH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/images/btcash.webp",
    isNative: false,
  },
  {
    key: "MTHT",
    label: "MTHT",
    symbol: "MTHT",
    contract: MTHT_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/images/mtht.webp",
    isNative: false,
  },
  {
    key: "BNB",
    label: "BNB",
    symbol: "BNB",
    contract: "", // kept for reference / display, not used for native transfer
    decimals: 18,
    icon: "/images/bnb.png",
    isNative: true,
  },
];

/* ════════════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════════════ */

type ConnectorId = "metamask" | "trustwallet";

type TxStep =
  | "idle" // not connected
  | "connected" // wallet connected, ready to enter amount
  | "confirming" // waiting for wallet signature
  | "pending" // tx broadcast / saving to backend
  | "success"
  | "error";

interface PayWithWalletModalProps {
  open: boolean;
  onClose: () => void;
  /** called after a successful on-chain transfer + backend save, so parent can refetch balances etc. */
  onSuccess?: (payload: { txHash: string; amount: string; from: string; token: TokenKey }) => void;
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

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Converts a human-readable token amount (e.g. "10.5") into hex wei string for the given decimals */
function toTokenAmountHex(amount: string, decimals: number): string {
  // Use BigInt-safe string math to avoid float precision issues
  const [whole, frac = ""] = amount.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const combined = `${whole}${fracPadded}`.replace(/^0+(?=\d)/, "");
  const value = BigInt(combined || "0");
  return "0x" + value.toString(16);
}

/** Converts a hex wei value back to a human-readable decimal string for the given decimals */
function fromTokenAmountHex(hex: string, decimals: number): string {
  if (!hex || hex === "0x") return "0";
  const value = BigInt(hex);
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = value / divisor;
  const remainder = value % divisor;

  if (remainder === BigInt(0)) return whole.toString();

  const fracStr = remainder.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole.toString()}${fracStr ? `.${fracStr}` : ""}`;
}

/** left-pads a hex string (without 0x) to 64 chars */
function pad64(hex: string): string {
  return hex.replace(/^0x/, "").padStart(64, "0");
}

/** Builds the `data` field for an ERC20 transfer(to, amount) call */
function buildTransferData(to: string, amountHex: string): string {
  const toPadded = pad64(to.toLowerCase());
  const amountPadded = pad64(amountHex.replace(/^0x/, ""));
  return `0x${TRANSFER_SELECTOR}${toPadded}${amountPadded}`;
}

/** Builds the `data` field for an ERC20 balanceOf(address) call */
function buildBalanceOfData(owner: string): string {
  const ownerPadded = pad64(owner.toLowerCase());
  return `0x${BALANCE_OF_SELECTOR}${ownerPadded}`;
}

/* ════════════════════════════════════════════════════════════════════
   WALLET CONNECT HELPERS
   ════════════════════════════════════════════════════════════════════ */

async function ensureBscNetwork(): Promise<void> {
  if (!window.ethereum) throw new Error("No wallet provider found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_CHAIN_ID_HEX }],
    });
    // console.log("[Deposit] Switched to BSC network");
  } catch (switchError: any) {
    console.warn("[Deposit] switchEthereumChain failed, trying addEthereumChain", switchError);
    // 4902 = chain not added yet
    if (switchError?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [BSC_NETWORK_PARAMS],
      });
      // console.log("[Deposit] Added & switched to BSC network");
    } else {
      throw switchError;
    }
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

  // console.log("[Deposit] MetaMask connected accounts:", accounts);
  return accounts[0];
}

async function connectTrustWallet(): Promise<string> {
  const isTrust = window.ethereum?.isTrust || window.ethereum?.isTrustWallet;

  if (isTrust || window.ethereum) {
    try {
      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[];
      // console.log("[Deposit] Trust Wallet connected accounts:", accounts);
      return accounts[0];
    } catch (e) {
      // console.warn("[Deposit] Trust Wallet inline connect failed, falling back to deep-link", e);
    }
  }

  const currentUrl = encodeURIComponent(window.location.href);
  window.open(
    `https://link.trustwallet.com/open_url?coin_id=20000714&url=${currentUrl}`,
    "_blank"
  );
  throw new Error("Trust Wallet not installed — opening app");
}

/* ════════════════════════════════════════════════════════════════════
   BALANCE FETCH HELPERS
   ════════════════════════════════════════════════════════════════════ */

/** Fetch native BNB balance (in BNB, human-readable) */
async function fetchNativeBalance(address: string): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet provider found");

  const result = (await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  })) as string;

  return fromTokenAmountHex(result, 18);
}

/** Fetch ERC20 token balance via eth_call to balanceOf(address) */
async function fetchTokenBalance(contract: string, owner: string, decimals: number): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet provider found");
  if (!contract) {
    // console.warn("[Deposit] Token contract address missing — skipping balance fetch");
    return "0";
  }

  const data = buildBalanceOfData(owner);

  const result = (await window.ethereum.request({
    method: "eth_call",
    params: [{ to: contract, data }, "latest"],
  })) as string;

  return fromTokenAmountHex(result, decimals);
}

/* ════════════════════════════════════════════════════════════════════
   CONNECTOR SELECT (sub-view inside modal)
   ════════════════════════════════════════════════════════════════════ */

const CONNECTORS: { id: ConnectorId; name: string; img: string }[] = [
  { id: "metamask", name: "MetaMask", img: "/wallet/meta-mask.png" },
  { id: "trustwallet", name: "Trust Wallet", img: "/wallet/trustwallet.png" },
];

/* ════════════════════════════════════════════════════════════════════
   MAIN MODAL COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function PayWithWalletModal({
  open,
  onClose,
  onSuccess,
}: PayWithWalletModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { mutate, isPending } = useDepositWalletMutation();

  const [connecting, setConnecting] = useState<ConnectorId | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedProvider, setConnectedProvider] = useState<ConnectorId | null>(null);

  const [selectedToken, setSelectedToken] = useState<TokenConfig>(TOKENS[0]); // default USDT
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);

  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<TxStep>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* lock body scroll while modal open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* reset internal state every time modal is (re)opened */
  useEffect(() => {
    if (open) {
      // console.log("[Deposit] Modal opened — resetting state");
      setStep(connectedAddress ? "connected" : "idle");
      setAmount("");
      setTxHash(null);
      setErrorMsg(null);
      setSelectedToken(TOKENS[0]);
      setTokenDropdownOpen(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── fetch balance for selected token whenever wallet connects or token changes ── */
  const refreshBalance = useCallback(async () => {
    if (!connectedAddress) {
      setBalance(null);
      return;
    }

    setBalanceLoading(true);
    // console.log(`[Deposit] Fetching ${selectedToken.symbol} balance for`, connectedAddress);

    try {
      let bal: string;
      if (selectedToken.isNative) {
        bal = await fetchNativeBalance(connectedAddress);
      } else {
        bal = await fetchTokenBalance(selectedToken.contract, connectedAddress, selectedToken.decimals);
      }

      // console.log(`[Deposit] ${selectedToken.symbol} balance:`, bal);
      setBalance(bal);
    } catch (err) {
      console.error(`[Deposit] Failed to fetch ${selectedToken.symbol} balance:`, err);
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, [connectedAddress, selectedToken]);

  useEffect(() => {
    if (step === "connected" || step === "idle") {
      refreshBalance();
    }
  }, [refreshBalance, step]);

  if (!open) return null;

  /* ── connect wallet ── */
  const handleConnect = async (id: ConnectorId) => {
    setConnecting(id);
    setErrorMsg(null);
    console.log(`[Deposit] Attempting to connect via ${id}...`);

    try {
      let address = "";
      if (id === "metamask") address = await connectMetaMask();
      else address = await connectTrustWallet();

      // console.log("[Deposit] Connected wallet address:", address);

      // ensure correct network (BSC)
      await ensureBscNetwork();

      setConnectedAddress(address);
      setConnectedProvider(id);
      setStep("connected");

      toast.success(`${id === "metamask" ? "MetaMask" : "Trust Wallet"} connected!`);
    } catch (err: any) {
      console.error("[Deposit] Wallet connect error:", err);
      toast.error(err?.message || "Connection failed");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    // console.log("[Deposit] Wallet disconnected by user");
    setConnectedAddress(null);
    setConnectedProvider(null);
    setStep("idle");
    setAmount("");
    setTxHash(null);
    setBalance(null);
    toast.success("Wallet disconnected");
  };

  const handleTokenSelect = (token: TokenConfig) => {
    // console.log("[Deposit] Token selected:", token.symbol);
    setSelectedToken(token);
    setTokenDropdownOpen(false);
    setAmount("");
    setBalance(null);
  };

  const handleMaxAmount = () => {
    if (balance) {
      // console.log(`[Deposit] Setting amount to max balance: ${balance} ${selectedToken.symbol}`);
      setAmount(balance);
    }
  };

  /* ── send token deposit transaction ── */
  const handleSendDeposit = async () => {
    setErrorMsg(null);

    if (!connectedAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!ADMIN_WALLET_ADDRESS) {
      console.error("[Deposit] ADMIN_WALLET_ADDRESS is not configured");
      toast.error("Deposit address not configured. Please contact support.");
      return;
    }

    if (!selectedToken.isNative && !selectedToken.contract) {
      console.error(`[Deposit] Contract address missing for ${selectedToken.symbol}`);
      toast.error(`${selectedToken.symbol} contract address not configured. Please contact support.`);
      return;
    }

    if (balance !== null && numericAmount > Number(balance)) {
      toast.error(`Insufficient ${selectedToken.symbol} balance`);
      return;
    }

    // console.log("=========================================");
    // console.log("[Deposit] STARTING DEPOSIT FLOW");
    // console.log("[Deposit] Token:", selectedToken.symbol);
    // console.log("[Deposit] From (user wallet):", connectedAddress);
    // console.log("[Deposit] To (admin wallet):", ADMIN_WALLET_ADDRESS);
    // console.log("[Deposit] Amount:", numericAmount);
    // console.log("[Deposit] Network: BSC (BEP20), chainId:", BSC_CHAIN_ID_DEC);
    // console.log("[Deposit] Token contract:", selectedToken.isNative ? "native (BNB)" : selectedToken.contract);
    // console.log("=========================================");

    try {
      setStep("confirming");

      // 1) make sure we're still on BSC
      await ensureBscNetwork();

      const amountHex = toTokenAmountHex(amount, selectedToken.decimals);
      console.log("[Deposit] Encoded amount (hex wei):", amountHex);

      let txParams: Record<string, string>;

      if (selectedToken.isNative) {
        // native BNB transfer — direct value transfer, no contract call
        txParams = {
          from: connectedAddress,
          to: ADMIN_WALLET_ADDRESS,
          value: amountHex,
        };
      } else {
        // ERC20 token transfer — call transfer(to, amount) on the token contract
        const data = buildTransferData(ADMIN_WALLET_ADDRESS, amountHex);
        console.log("[Deposit] Encoded tx data:", data);

        txParams = {
          from: connectedAddress,
          to: selectedToken.contract, // sending to TOKEN CONTRACT, not directly to admin
          data,
          value: "0x0", // no native BNB transferred — token transfer only
        };
      }

      console.log("[Deposit] eth_sendTransaction params:", txParams);

      // 2) ask wallet to sign & broadcast
      const hash = (await window.ethereum!.request({
        method: "eth_sendTransaction",
        params: [txParams],
      })) as string;

      console.log("[Deposit] ✅ Transaction broadcast! Hash:", hash);
      console.log("[Deposit] View on BscScan:", `https://bscscan.com/tx/${hash}`);

      setTxHash(hash);
      setStep("pending");

      toast.success("Transaction sent! Waiting for confirmation...");

      // 3) save record to backend
      const payload = {
        // toaddress: ADMIN_WALLET_ADDRESS,
        // amount: String(numericAmount),
        // fromaddress: connectedAddress,
        txHash:hash,
        // walletType: selectedToken.symbol,
      };

      console.log("[Deposit] >>> Calling deposit API with payload:", payload);

      mutate(payload, {
        onSuccess: (res) => {
          console.log("[Deposit] <<< Deposit API response:", res);

          setStep("success");
          toast.success((res as any)?.message || "Deposit submitted successfully!");

          // refresh balance after deposit
          refreshBalance();

          onSuccess?.({
            txHash: hash,
            amount: String(numericAmount),
            from: connectedAddress,
            token: selectedToken.key,
          });
        },
        onError: (err: any) => {
          console.error("[Deposit] <<< Deposit API error:", err);
          console.log("[Deposit] Error response data:", err?.response?.data);

          const message =
            err?.response?.data?.message || err?.message || "Failed to save deposit record";

          setErrorMsg(message);
          setStep("error");
          toast.error(message);
        },
      });
    } catch (err: any) {
      console.error("[Deposit] ❌ Transaction error:", err);

      // common MetaMask user-rejection code
      const message =
        err?.code === 4001
          ? "Transaction rejected by user"
          : err?.message || "Transaction failed";

      console.log("[Deposit] Error code:", err?.code);
      console.log("[Deposit] Error message:", message);

      setErrorMsg(message);
      setStep("error");
      toast.error(message);
    }
  };

  const handleReset = () => {
    console.log("[Deposit] Resetting form for another deposit");
    setStep("connected");
    setAmount("");
    setTxHash(null);
    setErrorMsg(null);
    refreshBalance();
  };

  const providerLabel =
    connectedProvider === "metamask" ? "MetaMask" : connectedProvider === "trustwallet" ? "Trust Wallet" : "";

  /* ════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════ */

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (
          e.target === overlayRef.current &&
          step !== "confirming" &&
          step !== "pending" &&
          !isPending
        )
          onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a2e] shadow-2xl">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-white">Deposit via Wallet</h2>
          <button
            onClick={onClose}
            disabled={step === "confirming" || step === "pending" || isPending}
            className="text-white/50 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <MdClose size={22} />
          </button>
        </div>

        <p className="px-6 text-xs text-[#b8a7ef] mb-4">BEP20 (BNB Smart Chain) network only</p>

        <div className="px-6 pb-6">
          {/* ════════ STEP: not connected — choose wallet ════════ */}
          {step === "idle" && (
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
                    <Image src={c.img} alt={c.name} width={36} height={36} className="h-9 w-9 object-contain" />
                  </div>
                  <span className="flex-1 text-base font-semibold text-white">{c.name}</span>
                  {connecting === c.id && (
                    <svg className="h-5 w-5 animate-spin text-[#7c56ff]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                </button>
              ))}
              <p className="text-center text-[11px] text-white/30 mt-1">Connect your wallet to deposit</p>
            </div>
          )}

          {/* ════════ STEP: connected — enter amount ════════ */}
          {step === "connected" && connectedAddress && (
            <div className="flex flex-col gap-4">
              {/* connected wallet pill */}
              <div className="flex items-center justify-between rounded-xl border border-[#7c56ff]/30 bg-[#1a0d40] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <FaWallet className="text-[#c7bfff]" size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#b8a7ef] uppercase tracking-widest">{providerLabel} Connected</p>
                    <p className="text-sm font-mono font-semibold text-white">{shortAddress(connectedAddress)}</p>
                  </div>
                  <MdCheckCircle className="text-green-400" size={18} />
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-xs text-[#b8a7ef] hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition hover:border-white/30 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* token selector */}
              <div className="relative">
                <label className="mb-1.5 block text-xs font-medium text-[#b8a7ef]">Select Token</label>
                <button
                  type="button"
                  onClick={() => setTokenDropdownOpen((p) => !p)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-[#7c56ff]/60 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedToken.icon}
                      alt={selectedToken.symbol}
                      width={26}
                      height={26}
                      className="h-6 w-6 rounded-full object-contain"
                    />
                    <span className="text-sm font-semibold text-white">{selectedToken.label}</span>
                  </div>
                  <FaChevronDown
                    className={`h-3.5 w-3.5 text-[#b8a7ef] transition-transform duration-200 ${
                      tokenDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {tokenDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-[#23234a] shadow-xl">
                    {TOKENS.map((token) => (
                      <button
                        key={token.key}
                        type="button"
                        onClick={() => handleTokenSelect(token)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5 cursor-pointer ${
                          selectedToken.key === token.key ? "bg-[#7c56ff]/10" : ""
                        }`}
                      >
                        <Image
                          src={token.icon}
                          alt={token.symbol}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-contain"
                        />
                        <span className="text-sm font-medium text-white">{token.label}</span>
                        {selectedToken.key === token.key && (
                          <MdCheckCircle className="ml-auto text-[#7c56ff]" size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* available balance */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-[10px] text-[#b8a7ef] uppercase tracking-widest">Available Balance</span>
                <div className="flex items-center gap-2">
                  {balanceLoading ? (
                    <span className="text-xs text-[#b8a7ef] animate-pulse">Loading...</span>
                  ) : (
                    <span className="text-sm font-mono font-semibold text-white">
                      {balance !== null ? Number(balance).toFixed(4) : "—"} {selectedToken.symbol}
                    </span>
                  )}
                </div>
              </div>

              {/* destination info */}
              {/* <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] text-[#b8a7ef] uppercase tracking-widest mb-1">Depositing to</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-mono text-white break-all">
                    {ADMIN_WALLET_ADDRESS ? shortAddress(ADMIN_WALLET_ADDRESS) : "—"}
                  </p>
                  {ADMIN_WALLET_ADDRESS && (
                    <button
                      onClick={() => copyToClipboard(ADMIN_WALLET_ADDRESS)}
                      className="text-[#b8a7ef] hover:text-white transition cursor-pointer shrink-0"
                    >
                      <MdContentCopy size={14} />
                    </button>
                  )}
                </div>
              </div> */}

              {/* amount input */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#b8a7ef]">Amount ({selectedToken.symbol})</label>
                  <button
                    onClick={handleMaxAmount}
                    disabled={!balance}
                    className="text-[11px] font-semibold text-[#c7bfff] hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    MAX
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-lg font-semibold text-white outline-none transition focus:border-[#7c56ff]/60 focus:bg-white/10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#b8a7ef]">
                    {selectedToken.symbol}
                  </span>
                </div>
              </div>

              {/* quick amounts */}
              <div className="flex gap-2">
                {[10, 50, 100, 500].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-[#c7bfff] transition hover:border-[#7c56ff]/60 hover:bg-[#7c56ff]/10 cursor-pointer"
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* submit */}
              <button
                onClick={handleSendDeposit}
                disabled={!amount || Number(amount) <= 0 || isPending}
                className="mt-1 w-full rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,rgba(228,138,6,1)_100%)] hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer text-[#1a1a2e]"
              >
                {isPending ? "Submitting..." : "Confirm Deposit"}
              </button>
            </div>
          )}

          {/* ════════ STEP: confirming in wallet ════════ */}
          {step === "confirming" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <svg className="h-12 w-12 animate-spin text-[#7c56ff]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <div>
                <p className="text-base font-semibold text-white">Confirm in your wallet</p>
                <p className="mt-1 text-xs text-[#b8a7ef]">
                  Approve the transaction of{" "}
                  <span className="font-semibold text-white">
                    {amount} {selectedToken.symbol}
                  </span>{" "}
                  in the popup window
                </p>
              </div>
            </div>
          )}

          {/* ════════ STEP: pending on-chain / saving to backend ════════ */}
          {step === "pending" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-[#7c56ff]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#7c56ff] animate-spin" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">
                  {isPending ? "Saving deposit record..." : "Transaction broadcasted"}
                </p>
                <p className="mt-1 text-xs text-[#b8a7ef]">
                  {isPending
                    ? "Submitting transaction details to server..."
                    : "Waiting for blockchain confirmation..."}
                </p>
              </div>
              {txHash && (
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-[#c7bfff] hover:text-white transition"
                >
                  {shortAddress(txHash)} <FaExternalLinkAlt size={10} />
                </a>
              )}
            </div>
          )}

          {/* ════════ STEP: success ════════ */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <MdCheckCircle className="text-green-400" size={36} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Deposit Submitted!</p>
                <p className="mt-1 text-xs text-[#b8a7ef]">
                  <span className="font-semibold text-white">
                    {amount} {selectedToken.symbol}
                  </span>{" "}
                  sent to admin wallet
                </p>
              </div>

              {txHash && (
                <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] text-[#b8a7ef] uppercase tracking-widest mb-1">Transaction Hash</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-white break-all">{shortAddress(txHash)}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyToClipboard(txHash)}
                        className="text-[#b8a7ef] hover:text-white transition cursor-pointer"
                      >
                        <MdContentCopy size={14} />
                      </button>
                      <a
                        href={`https://bscscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b8a7ef] hover:text-white transition"
                      >
                        <FaExternalLinkAlt size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex w-full gap-3 mt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-full border border-white/10 py-2.5 text-sm font-medium text-[#c7bfff] transition hover:border-white/30 cursor-pointer"
                >
                  New Deposit
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,rgba(228,138,6,1)_100%)] hover:scale-[1.02] active:scale-95 cursor-pointer text-[#1a1a2e]"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* ════════ STEP: error ════════ */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
                <MdError className="text-rose-400" size={36} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Transaction Failed</p>
                <p className="mt-1 text-xs text-[#b8a7ef] break-words max-w-xs">
                  {errorMsg || "Something went wrong. Please try again."}
                </p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full border border-white/10 py-2.5 text-sm font-medium text-[#c7bfff] transition hover:border-white/30 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition bg-[linear-gradient(180deg,rgba(254,219,30,1)_0%,rgba(228,138,6,1)_100%)] hover:scale-[1.02] active:scale-95 cursor-pointer text-[#1a1a2e]"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

