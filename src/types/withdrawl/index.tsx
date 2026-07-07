import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";

export interface WalletTransaction {
    _id: string;
    userId: string;
    walletType: 'royalty' | string;
    amount: number;
    fee: number;
    requestamount: number;
    walletAddress: string;
    status: 'approved' | 'pending' | 'rejected' | string;
    requestDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface WalletTransactionResponse {
    success: boolean;
    message: string;
    data: WalletTransaction[];
    formatedData: ListCardData[];
    totalCount: number;
    totalPages: number;
    page: number;
    count: number;
}

export type GetListAPIParams = {
    page: number;
    limit: number
}