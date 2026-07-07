import { Downlinedata } from "../auth";
import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";
export type CustemerWalletdata = {
  firstname: string;
  lastname: string;
  customercode: string;
  isDepositSend:boolean;
  email: string;
  usdtbalance: number;
  depositwallet: number;
  depositwalletamount: number;
  stakingwallet: number;
  refferalIncome: number;
  rankReward: number;
  rankMonthlySalary: number;
  stakingwalletamount: number;
  affiliatewallet: number;
  affiliatewalletamount: number;
  mthtwallet: number;
  mthtwalletamount: number;
  royaltywallet: number;
  royaltywalletamount: number;
  mainbalance: number;
  mainbalanceamount: number;
  usdtminDeposit: number;
  usdtmaxDeposit: number;
  todayStakingReward: number;
  todayStakingRewardamount: number;
  todayAffiliateReward: number;
  todayAffiliateRewardamount: number;
  alltimestaking: number;
  alltimestakingamount: number;
  alltimeaffiliate: number;
  alltimeaffiliateamount: number;
  lastmonthstaking: number;
  lastmonthaffiliate: number;
  communityusers: number;
  totalholding: number;
  USDTWalletamount: number;
  USDTWallet: number;
  BNBWallet: number;
  BTMETAWallet: number;
  BTMETAWalletamount: number;
  boosterwallet: number;
  boosterwalletamount: number;
  refferalWallet:number;
  salaryWallet:number;
  rankWallet:number;
  itemRankRewards?: RankRewardItem[],
  biddepositwallet:number,
  bidaffiliatewallet:number,
  bidrewardwallet:number,
  bidbnbwallet:number,
  bidusdtwallet:number,
  bidbtcashwallet:number,
  bidmainbalance:number,
  bidmainbalanceamount:number
};
export type RankRewardItem = {
  rank: string;
  reward: {
    type: 'cash' | 'product';
    amount: number;
    title?: string;
  };
  date: string;
};
export type fundTransferParams = {
  page: number;
  limit: number
  search: string;
}
export type customerDownline = {
  page: number;
  limit: number
  customerId: string;
  name: string;
  email: string;
  level: string;
}

export interface Transaction {
  _id?: string;
  wallet: string;
  email: string;
  amount: number;
  name?: string;
  createdAt: string; // ISO date string
}

export interface FundTransferApiResponse {
  success: boolean;
  message: string;
  data: Transaction[]; // Array of transactions directly in data
  listTableData: ListCardData[];
  totalCount: number;
  totalPages: number;
  page: number;
  count: number;
}

type Leg = {
  _id: string;
  firstname: string;
  lastname: string;
  legId: string;
  amount: number;
  tokens: number;
};

type OtherLegsInfo = {
  legs: Leg;
  totalAmount: number;
  totalTokens: number;
};

export interface downlineCustomerApiResponse {
  success: boolean;
  message: string;
  directusers: number
  totalcommunitystaking: number
  totalVolume: number
  data: Downlinedata[]; // Array of transactions directly in data
  powerLeg: Leg;
  otherLegsInfo: OtherLegsInfo;
  legs: Leg;
  totalCount: number;
  totalPages: number;
  page: number;
  leveleligibility: number;
  count: number;
}


export type verifyEmailType = {
  email: string,
}
export type verifyTokenData = {
  encryptedData: string,
}

export type CustemerPackage = {
  _id: string;
  customerId: string;
  packageId: {
    _id: string;
    packageName: string;
    dailyReward: number;
    id: string;
  };
  packageName: string;
  amount: number;
  dailyReward: number;
  status: 'active' | 'inactive' | string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type DepositPackage = {
  _id: string;
  id: string;
  packageName: string;
  depositAmount: number;
  dailyReward: number;
  maximumRewardExpiryDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StakingSummerySettings {
  _id: string;
  name: string;
  description: string;
  annualPercentYield: number;
  dailyProfitRatio: number;
  conversionRatio: number;
  maxLimit: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  usdtmaxDeposit: number;
  usdtminDeposit: number;
  withdrawalfee: number;
  withdrawalMaxAmount: number;
  withdrawalMinAmount: number;
}

export interface StakingSummerydata {
  totalActiveAmount: number;
  expiredStakingTotal: number;
  totalActivecount: number;
  expiredStakingcount: number;
  settings: StakingSummerySettings;
}

export interface StakingSummeryResponse {
  success: boolean;
  message: string;
  data: StakingSummerydata;
}
export interface notificationParams {
  page: number;
  limit: number;
}


type NotiData = {
  _id: boolean;
  customerId: string;
  text: string;
  datetime: string;
  forAll: string;
};
export interface notificationRespone {
  data: NotiData[];
  pages: number;
  totalCount: number;
  page: number;
  count: number;
  unreadCount: number;
}


export type CustemerWalletList = {
  label: string;
  value: string;
  amount: string
}[]

export interface RegisterVerifyPayload {
  email: string;
  otp: string;
}


export interface RegisterResendOtpPayload {
  email: string;
  type: 1
};

export interface SwapSettingRespone {
  USDTwallet: number
  settings: {
    _id: string;
    name: string;
    description: string;
    annualPercentYield: number;
    dailyProfitRatio: number;
    conversionRatio: number;
    maxLimit: number;
    minAmount: number;
    maxAmount: number;
    isActive: boolean;
    createdAt: string; // or Date, depending on how it's used in your app
    updatedAt: string; // or Date
    __v: number;
    usdtmaxDeposit: number;
    usdtminDeposit: number;
    withdrawalfee: number;
    withdrawalMaxAmount: number;
    withdrawalMinAmount: number;
    usdtconversion: number
  }
}
