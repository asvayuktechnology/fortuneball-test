export interface ExchangeData {
    id: number;
    name: string;
    slug: string;
    num_market_pairs: number;
    fiats: string[];
    traffic_score: number;
    rank: number;
    exchange_score: number | null;
    liquidity_score: number;
    last_updated: string;
    quote: {
        USD: {
            volume_24h: number;
            volume_24h_adjusted: number;
            volume_7d: number;
            volume_30d: number;
            percent_change_volume_24h: number;
            percent_change_volume_7d: number;
            percent_change_volume_30d: number;
            effective_liquidity_24h: number;
            derivative_volume_usd: number;
            spot_volume_usd: number;
        };
    };
    logo?: string
};