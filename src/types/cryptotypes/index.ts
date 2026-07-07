import { MetaverseCategory } from "./metaberse";
import { CrytoWallet } from "./wallets";
import { ExchangeData } from "./exchange"
import { CryptoDataMarket } from "./cryptoMarket"
import { NftData } from "@/types/cryptotypes/nft"
interface ApiStatus {
    timestamp: Date;
    error_code: number
    error_message: null | string;
    elapsed: number
    credit_count: number
    notice: null;
    total_count: number
};

export interface MarketDataRespone {
    status: ApiStatus;
    data: CryptoDataMarket[];
}

export interface ExchnageDataRespone {
    status: ApiStatus;
    data: ExchangeData[];
}

export interface MetaverseDataRespone {
    status: ApiStatus;
    data: MetaverseCategory;
}

export interface CryptoWalletsDataRespone {
    status: ApiStatus;
    data: CrytoWallet;
}
export interface CryptoNftsDataRespone {
    status: ApiStatus;
    data: NftData[];
}

export type MarketCoinCardData = {
    logoUrl?: string;
    symbol: string;
    volume: number;
    price: number;
    changePercent: number;
}