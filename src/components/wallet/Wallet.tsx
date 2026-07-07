'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PageTitle from '../ui/common/pagetitle/PageTitle'
import WalletCard from '../cards/WalletCard'
import Deposit from '../deposit/Deposit'
import Withdrawl from '../withdrawl/Withdrawl'
import { useFetchCustomerWallet } from '@/services/customerService'
import Link from 'next/link'
import { FaRegEye, FaEyeSlash } from 'react-icons/fa'
// import depositimg from "../../../public/images/deposit.png"
// import withdrawimg from "../../../public/images/withdraw.png"
// import transferimg from "../../../public/images/transfer.png"
import tokeniconimg from "../../../public/images/layrexlogo.png"
import walletcardbg from "../../../public/images/walletcardbg.webp"
// import ParticlesBackground from '../ui/common/ParticlesBackground';
import Loader from '../ui/common/Loader';
import { fetchTxnCustomerLive, fetchTxnUsdtCustomerLive } from "@/services/TransactionService";
import { GoEye, GoEyeClosed } from 'react-icons/go'
import LotteryResultsSection from '../DrawResult'

const tabData = [
  {
    label: Deposit,
    content: <Deposit />,
  },
  {
    label: 'Withdrawl',
    content: <Withdrawl />,
  },
];

// Fortune Ball wallets (bid wallets) — each amountKey appears exactly once
const fortuneBallWallets = [
  { amountKey: 'biddepositwallet', usdAmountKey: 'biddepositwalletamount', title: 'MTHT Wallet' },
  { amountKey: 'bidusdtwallet', usdAmountKey: 'bidusdtwalletamount', title: 'USDT Wallet' },
  { amountKey: 'bidbnbwallet', usdAmountKey: 'bidbnbwalletamount', title: 'BNB Wallet' },
  { amountKey: 'bidbtcashwallet', usdAmountKey: 'bidbtcashwalletamount', title: 'BTCASH Wallet' },
  { amountKey: 'bidaffiliatewallet', usdAmountKey: 'bidaffiliatewalletamount', title: 'Affiliate Reward' },
  { amountKey: 'bidrewardwallet', usdAmountKey: 'bidrewardwalletamount', title: 'Reward Wallet' },
];

// Fortune NFT wallets
const fortuneNftWallets = [
  { amountKey: 'depositwallet', usdAmountKey: 'depositwalletamount', title: 'Deposit Wallet' },
  { amountKey: 'stakingwallet', usdAmountKey: 'stakingwalletamount', title: 'Staking Wallet' },
  { amountKey: 'affiliatewallet', usdAmountKey: 'affiliatewalletamount', title: 'Affiliate Wallet' },
  { amountKey: 'royaltywallet', usdAmountKey: 'royaltywalletamount', title: 'Reward Wallet' },
  { amountKey: 'boosterwallet', usdAmountKey: 'boosterwalletamount', title: 'Booster Wallet' },
  { amountKey: 'USDTWallet', usdAmountKey: 'USDTWalletamount', title: 'USDT Wallet' },
  { amountKey: 'BNBWallet', usdAmountKey: 'BNBWalletamount', title: 'BNB Wallet' },
  { amountKey: 'BTMETAWallet', usdAmountKey: 'BTMETAWalletamount', title: 'BTMETA Wallet' },
];

export default function Wallet() {
  const [hideMainBalance, setSsetHideMainBalance] = useState(false)
  const [activeTab, setActiveTab] = useState<'ball' | 'nft'>('ball')
  const { data: wallet, isLoading: isLoadingWallet, refetch: refetchWallet } = useFetchCustomerWallet();

  // console.log(wallet)
  const updateTransactions = async () => {
    try {
      // await fetchTxnCustomerLive();
      await fetchTxnUsdtCustomerLive();
      refetchWallet()
    } catch (error) {
      // console.log(error);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateTransactions();
  //   }, 20000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    refetchWallet();
  }, [])

  const [showConfetti, setShowConfetti] = useState(false);

  const handlePurchaseSuccess = () => {
    setShowConfetti(true);
  };

  const activeWallets = activeTab === 'ball' ? fortuneBallWallets : fortuneNftWallets;
  const isBallTab = activeTab === 'ball';

  const walletRecord = wallet as unknown as Record<string, number> | undefined;

  const totalBalance = isBallTab
    ? walletRecord?.bidmainbalance
    : walletRecord?.mainbalance;

  const totalBalanceAmount = isBallTab
    ? walletRecord?.bidmainbalanceamount
    : walletRecord?.mainbalanceamount;
  // { console.log("activeWallets", activeWallets) }
  return isLoadingWallet ? (
    <div className="mt-6 min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="relative min-h-screen ">
      {/* <ParticlesBackground /> */}
      {/* <div className="relative z-10 container mx-auto mt-8 md:px-8 px-3.5"> */}
      {/* <div className='bg-[radial-gradient(circle,rgba(217,12,192,0.40)_0%,rgba(133,25,135,0)_75%)] min-h-[400px] w-screen absolute left-0 -top-10 -z-1' /> */}
      <div className="max-w-md mx-auto mt-10 px-[24px]">
        <h1 className="mb-5 text-center text-[21px] font-bold text-white">
          Wallet
        </h1>

        <div className="flex flex-col justify-center ">
          {/* Left Column - Main Balance */}

          <div className="w-full block  text-slate-200  rounded-[18px] sm:py-2 pt-1  relative overflow-hidden min-h-[120px]  ">

            <div className="relative overflow-hidden rounded-3xl border border-[#9a4cee] bg-[linear-gradient(175deg,#6b1b79_0%,#230f5b_8%,#0c0239_46%,#140642_81%,#1b0949_100%)] px-[12px] py-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="mb-4 w-full">
                <div className="relative flex items-center gap-4">
                  <Image
                    src="/images/wallet-hero.png"
                    alt="wallet"
                    width={120}
                    height={120}
                    className="object-contain"
                  />

                  <div>
                    <h4 className="md:text-xl text-[10px] flex items-center">
                      Total Assets
                      <span className="md:text-sm text-[10px] mx-1">
                        (MTHT)
                      </span>

                      <span
                        className="cursor-pointer"
                        onClick={() => setSsetHideMainBalance(!hideMainBalance)}
                      >
                        {hideMainBalance ? (
                          <GoEye className="mx-2 text-[10px]" />
                        ) : (
                          <GoEyeClosed className="mx-1 text-[10px]" />
                        )}
                      </span>
                    </h4>

                    <h2 className="text-[22px] font-bold mt-1.5 text-white">
                      {hideMainBalance
                        ? "X.XX"
                        : Number(totalBalance || 0).toFixed(2)}

                      <span className="md:text-[16px] text-[11px] ml-1 text-white">
                        MTHT
                      </span>
                    </h2>

                    <p className="text-[10px] text-white/60">
                      ≈ $
                      {hideMainBalance
                        ? "******"
                        : Number(totalBalanceAmount || 0).toLocaleString()}

                      <span className="text-[#822acb] ml-1">
                        USDT
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className=" md:mt-0 place-self-center  w-full  pt-[17px]">
            <div className=" flex justify-center gap-8">
              <Link
                // href="/user/deposit"
                href="#"
                className="flex flex-col items-center relative"
              >

                <Image src={"/images/deposit.png"} width={58} height={58} alt="" />
                <span className="mt-2 text-[11px] font-semibold text-white">
                  Deposit
                </span>
                <span className="text-[8px] text-white/60">
                  Add funds to wallet
                </span>
                <div className="w-[2px] h-[45px] bg-[linear-gradient(-90deg,#1d0d49_0%,#392343_50%,#0f0831_100%)] opacity-90 absolute -right-3 top-8 -translate-y-1/2" />
              </Link>

              <Link
                // href="/user/withdrawl"
                href="#"
                className="flex flex-col items-center relative"
              >
                <Image src={"/images/withdrawal.png"} width={58} height={58} alt="" />
                <span className="mt-2 text-[11px] font-semibold text-white">
                  Withdraw
                </span>
                <span className="text-[8px] text-white/60">
                  Withdraw funds
                </span>
                <div className="w-[2px] h-[45px] bg-[linear-gradient(-90deg,#1d0d49_0%,#392343_50%,#0f0831_100%)] opacity-90 absolute -right-3 top-8 -translate-y-1/2" />
              </Link>

              <Link
                // href="/user/fundtransfer"
                href="#"
                className="flex flex-col items-center"
              >
                <Image src={"/images/trasfer.png"} width={58} height={58} alt="" />
                <span className="mt-2 text-[11px] font-semibold text-white">
                  Transfer
                </span>
                <span className="text-[8px] text-white/60">
                  Transfer to others
                </span>
              </Link>
            </div>
          </div>

          {/* Tabs - Fortune Ball / Fortune NFT */}
          <div className="w-full grid grid-cols-2 md:gap-10 gap-6 border-b border-white/10 mb-[25px] mt-[42px]">
            <button
              onClick={() => setActiveTab('ball')}
              className={`pb-3 px-1 text-[15px] md:text-base font-semibold transition-colors relative cursor-pointer ${activeTab === 'ball' ? 'text-white' : 'text-gray-500'
                }`}
            >
              Fortune Ball
              {activeTab === 'ball' && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-white rounded-full cursor-pointer" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`pb-3 px-1 text-[15px] md:text-base font-semibold transition-colors relative cursor-pointer ${activeTab === 'nft' ? 'text-white' : 'text-gray-500'
                }`}
            >
              Fortune NFT
              {activeTab === 'nft' && (
                <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* Wallet List - driven by active tab */}
          <div
            key={activeTab}
            className="sm:space-y-2.5 col-span-3 gap-4 grid grid-cols-1 custom-bg-pair"
          >

            {activeWallets.map((w) => (
              <div key={`${activeTab}-${w.amountKey}`}>
                <WalletCard
                  title={w.title}
                  amount={walletRecord?.[w.amountKey]}
                  usdtAmount={walletRecord?.[w.usdAmountKey]}
                  imgsrc={tokeniconimg}
                  wallet={walletRecord?.[w.amountKey]}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          {/* <Tabs tabs={tabData} /> */}
          {/* <Deposit/> */}
        </div>

      </div>
      {/* </div> */}

    </div>
  );
}