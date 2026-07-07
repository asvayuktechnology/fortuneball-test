// import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";
export type Transaction = {
    _id: string;
    customerId: string;
    amount: number;
    type: number;
    fromaddress: string;
    toaddress: string;
    hash: string;
    status: number;
    remarks: string;
    buyplan: number;
    matchId: string;
    withdrawal: string;
    creditDate: string;
    createdAt: string;
    updatedAt: string;
    email?: string;
    __v: number;
};

export type InitiateWithdrawals = {
    walletType: string;
    tokens?: string;
    amount: string;
    walletAddress: string;
};
export type otpType = {
    otp: string;
};

export type fundTransferType = {
    email: string;
    isVerified: boolean;
    walletType: string;
    amount: string;
};

export type InitiateWithdrawalsRepone = {
    success: boolean;
    message: string;
    expiresIn: string;
};



export type ConfirmWithdrawalResponse = {
    success: boolean;
    message: string;
    data: {
        userId: string;
        walletType: string;
        tokens: string[];
        amount: number;
        walletAddress: string;
        status: string;
        _id: string;
        requestDate: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
}

export interface WithdrawalRequest {
    _id: string;
    userId: string;
    walletType: string;
    tokens: string[];
    amount: number;
    walletAddress: string;
    status: string;
    requestDate: string; // ISO date string
    createdAt: string;   // ISO date string
    updatedAt: string;   // ISO date string
    email?: string
    __v: number;
}
export interface fundTransferRequest {
    _id?: string;
    wallet: string;
    email: string;
    amount: number;
    name?: string;
    createdAt: string; // ISO date string
}

export type AllTransactionApiParams = {
    page: number;
    limit: number
    search: string;
    type?: number;
    today?: boolean
}

export type AllHistoryApiParams = {
    page: number;
    limit: number
    type: 'affiliate' | 'staking';
}


export interface CustomerTransaction {
    _id: string;
    customerId: string;
    amount: number;
    type: number;
    hash: string;
    createdAt: string; // or use Date if you parse it
    typeText: string;
    toName: string | null;
    toEmail: string | null;
    customerName: string;
    customerEmail: string;
    transactiontype:string
    depositType:string
}

export interface CustomerTransactionsResponse {
    success: boolean;
    message: string;
    data: CustomerTransaction[];
    totalCount: number;
    totalPages: number;
    count: number;
    page: number;
}

export interface CustomerHistoryTransaction {
    date: string;
    totalAmount: number;
    count: number;
    transactionType: string;
}

export interface CustomerHistoryTransactionsResponse {
    success: boolean;
    message: string;
    data: CustomerHistoryTransaction[];
    totalCount: number;
    count: number;
    page: number;
}


export type TransactionType = 0 | 1 | 2 | 3 | 4 | 5;
export type GetAllTransaction = {
  page: number;
  limit: number;
  type?:TransactionType
   search?: string;

}


export interface depositWalletType {
  toaddress?: string;
  amount?: string;
  fromaddress?: string;
  txHash: string;
  walletType?:string
}


//affiliate income types

export interface AffiliateSummary {
  totalReward: number;
  last24HoursReward: number;
  last7DaysReward: number;
  last30DaysReward: number;
}

export interface AffiliateTransaction {
  _id: string;
  amount: number;
  createdAt: string;
  customerName:string;
}

export interface AffiliateIncomeResponse {
  success: boolean;
  summary: AffiliateSummary;
  transactions: AffiliateTransaction[];
}