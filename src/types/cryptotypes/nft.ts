export interface NftAsset {
    id: number;
    name: string;
    symbol: string;
    slug: string;
}

export interface NftData {
    cover: string;
    assets: NftAsset[];
    created_at: string; // ISO date string
    released_at: string; // ISO date string
    title: string;
    subtitle: string;
    type: string;
    source_name: string;
    source_url: string;
}
