import { useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import { MarketDataRespone, ExchnageDataRespone, MetaverseDataRespone, CryptoWalletsDataRespone, MarketCoinCardData, CryptoNftsDataRespone } from "@/types/cryptotypes";

//CRIPTO ASSET LOGO FETCH URL GEENRATOR
const generateCriptoCoinLogoImageurl = (id: number, sizeX?: number): string => {
    sizeX = sizeX ?? 1;
    return `https://s2.coinmarketcap.com/static/img/coins/${64 * sizeX}x${64 * sizeX}/${id}.png`
};
// CRYPTO APIS DATA FILTERRATION FUNCTIONS
const filtermarketdata = (marketData: MarketDataRespone): MarketCoinCardData[] => {
    const result: MarketCoinCardData[] = [];
    const data = marketData?.data ?? [];
    for (let m = 0; m < data.length; m++) {
        const { symbol, quote, id } = data[m];
        result.push({
            symbol,
            price: quote?.USD?.price,
            volume: quote?.USD?.volume_24h,
            changePercent: quote?.USD?.percent_change_24h,
            logoUrl: generateCriptoCoinLogoImageurl(id)
        })
    };
    return result;
};

const filterExchangedata = (marketData: ExchnageDataRespone): MarketCoinCardData[] => {
    const result: MarketCoinCardData[] = [];
    const data = marketData?.data ?? [];
    for (let m = 0; m < data.length; m++) {
        const { name, quote, id } = data[m];
        result.push({
            symbol: name,
            price: 0,
            volume: quote?.USD?.volume_24h,
            changePercent: quote?.USD?.percent_change_volume_24h,
            logoUrl: generateCriptoCoinLogoImageurl(id)
        })
    };
    return result;
};

const filterWalletdata = (marketData: CryptoWalletsDataRespone): MarketCoinCardData[] => {
    const coins = marketData?.data?.coins ?? []
    const result: MarketCoinCardData[] = [];
    // const data = marketData?.data ?? [];
    for (let m = 0; m < coins.length; m++) {
        const { name, quote, id } = coins[m];
        result.push({
            symbol: name,
            price: quote?.USD?.price,
            volume: quote?.USD?.volume_24h,
            changePercent: quote?.USD?.percent_change_24h,
            logoUrl: generateCriptoCoinLogoImageurl(id)
        })
    };
    return result;
};

const filterMetaversedata = (marketData: MetaverseDataRespone): MarketCoinCardData[] => {
    const coins = marketData?.data?.coins ?? []
    const result: MarketCoinCardData[] = [];
    // const data = marketData?.data ?? [];
    for (let m = 0; m < coins.length; m++) {
        const { name, quote, id } = coins[m];
        result.push({
            symbol: name,
            price: quote?.USD?.price,
            volume: quote?.USD?.volume_24h,
            changePercent: quote?.USD?.percent_change_24h,
            logoUrl: generateCriptoCoinLogoImageurl(id)
        })
    };
    return result;
};

const filterNftData = (nftdata: CryptoNftsDataRespone): string[][] => {
    const result = []
    const { data } = nftdata;
    for (let i = 0; i < data.length; i++) {
        const { assets } = data[i];
        const criptonftImg = [];
        for (let a = 0; a < assets.length; a++) {
            const { id } = assets[a];
            const url = generateCriptoCoinLogoImageurl(id, 2);
            criptonftImg.push(url);
        }
        result.push(criptonftImg);
    };
    return result
}

// CRYPTO APIS DATA FETCH FUNCTIONS
const getMarketdata = async (limit: number = 50): Promise<{ data: MarketCoinCardData[], totalCount: number }> => {
    try {
        const res = await HttpService.get('/crypto/market', { params: { limit } });
        const totalCount = res?.data?.status?.total_count ?? 0;
        const filtredData = filtermarketdata(res?.data);
        return {
            data: filtredData,
            totalCount
        }
    }
    catch (err) {
        // console.log('api erro:-', err);
        return {
            data: [],
            totalCount: 0
        }
    }
};

const getcenterlaizeExchangedata = async (limit: number = 50): Promise<{ data: MarketCoinCardData[], totalCount: number }> => {
    const res = await HttpService.get('/crypto/getcentralizedexchange', { params: { limit } });
    const totalCount = res?.data?.status?.total_count ?? 0;
    const filtredData = filterExchangedata(res?.data);
    return {
        data: filtredData,
        totalCount
    }
};

const getdecenterlaizeExchangedata = async (limit: number = 50): Promise<{ data: MarketCoinCardData[], totalCount: number }> => {
    const res = await HttpService.get('/crypto/getdeCentralizedExchanges', { params: { limit } });
    const totalCount = res?.data?.status?.total_count ?? 0;
    const filtredData = filterExchangedata(res?.data);
    return {
        data: filtredData,
        totalCount
    }
};

const getMetaverseData = async (limit: number = 50): Promise<{ data: MarketCoinCardData[], totalCount: number }> => {
    const res = await HttpService.get('/crypto/metaverse', { params: { limit } });
    const totalCount = res?.data?.status?.total_count ?? 0;
    const filtredData = filterMetaversedata(res?.data);
    return {
        data: filtredData,
        totalCount
    }
};

const getWalletData = async (limit: number = 50): Promise<{ data: MarketCoinCardData[], totalCount: number }> => {
    const res = await HttpService.get('/crypto/wallet', { params: { limit } });
    const totalCount = res?.data?.status?.total_count ?? 0;
    const filtredData = filterWalletdata(res?.data);
    return {
        data: filtredData,
        totalCount
    }
};

const getNftData = async (limit: number = 50): Promise<string[][]> => {
    const res = await HttpService.get('/crypto/nft', { params: { limit } });
    const data = filterNftData(res?.data);
    return data
};

const getCryptoChainsData = async (limit: number = 50): Promise<string[][]> => {
    const res = await HttpService.get('/crypto/market', { params: { limit } });
    const filtredResponse: string[][] = [];
    const coindData: MarketDataRespone = res?.data ?? {};

    if (coindData?.data) {
        const allLogos: string[] = [];
        for (let i = 0; i < coindData.data.length; i++) {
            const { id } = coindData.data[i];
            const coinLogo = generateCriptoCoinLogoImageurl(id, 2);
            allLogos.push(coinLogo);
        }
        for (let i = 0; i < allLogos.length; i += 3) {
            const chunk = allLogos.slice(i, i + 3);
            filtredResponse.push(chunk);
        }
    }
    return filtredResponse;
};

// APIS DATA FETCHER AND CACHE HOOKS
export const useFetchMarketData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_market_data', limit],
        queryFn: async () => getMarketdata(limit)
    })
};

export const useFetchCenterlizeExchangeData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_centarlize_exchange_data', limit],
        queryFn: async () => getcenterlaizeExchangedata(limit)
    })
};

export const useFetchDcenterlizeExchangeData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_decentarlize_exchange_data', limit],
        queryFn: async () => getdecenterlaizeExchangedata(limit)
    })
};

export const useFetchMetaverseData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_metaverse_data', limit],
        queryFn: async () => getMetaverseData(limit)
    })
};

export const useFetchWalletData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_wallet_data', limit],
        queryFn: async () => getWalletData(limit)
    })
};

export const useFetchNftData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_nft_data', limit],
        queryFn: async () => getNftData(limit)
    })
};

export const useFetchBlockchainData = (limit: number) => {
    return useQuery({
        queryKey: ['cripto_blockchains_data', limit],
        queryFn: async () => getCryptoChainsData(limit)
    })
};