import { useQuery, useMutation } from "@tanstack/react-query";
import HttpService from "./httpService";
import { GetAPIParams, PaginatedResponse } from "@/types/common/response";
import { ActiveBidResponse, BidSummaryResponse, BuyTicketRequest, GetAllDrawParams, GetAllTicketParams, RecentActivityParams, } from "@/types/ticket";

export const buyTicket = async (data: BuyTicketRequest): Promise<GetAPIParams> => {
  return HttpService.post("/buy", data).then((res) => res.data);
};

export const getAllTicket = async (params: GetAllTicketParams): Promise<PaginatedResponse> => { return HttpService.get("/my-tickets", { params, }).then((res) => res.data); };

export const getActiveBid = async (): Promise<ActiveBidResponse> => {
  return HttpService.get("/activebids").then((res) => res.data);
};

export const getLatestBid = async (): Promise<ActiveBidResponse> => {
  return HttpService.get("/latestbid").then((res) => res.data);
};

export const getDrawresults = async (params: GetAllDrawParams): Promise<PaginatedResponse> => {
  return HttpService.get("/drawresults", { params, }).then((res) => res.data);
};


export const getBidSummary = async (): Promise<BidSummaryResponse> => {
  return HttpService.get("/bidsummary").then((res) => res.data);
};

export const getRecentActivity = async (params: RecentActivityParams): Promise<PaginatedResponse> => {
  return HttpService.get("/recentactivity", { params }).then((res) => res.data);
};

export const getDrawResultById = async (id: string): Promise<any> => {
  return HttpService.get(`/result/${id}`).then((res) => res.data);
};

export const getStakingSettings = async (): Promise<GetAPIParams> => {
  return HttpService.get("/staking/settings").then((res) => res.data);
};


// React Query Hooks //

export const useBuyTicketMutation = () => {
  return useMutation<GetAPIParams, Error, BuyTicketRequest>({
    mutationFn: buyTicket,
  });
};

export const useFetchTicket = (
  params: GetAllTicketParams,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["all_tickets", params],
    queryFn: () => getAllTicket(params),
    staleTime: 0,
    enabled: options?.enabled ?? true,
  });

export const useFetchDrawResult = (
  params: GetAllDrawParams,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["all_draws", params],
    queryFn: () => getDrawresults(params),
    staleTime: 0,
    enabled: options?.enabled ?? true,
  });

export const useFetchActiveBid = () =>
  useQuery({
    queryKey: ["active_bid"],
    queryFn: getActiveBid,
    staleTime: 0,
  });


  export const useFetchLatestBid = () =>
  useQuery({
    queryKey: ["latest_bid"],
    queryFn: getLatestBid,
    staleTime: 0,
  });

  export const useFetchBidSummary = (options?: {refetchInterval?: number} ) =>
  useQuery({
    queryKey: ["bid_summary"],
    queryFn: getBidSummary,
    staleTime: 0,
    refetchInterval: options?.refetchInterval,

  });

  export const useFetchRecentActivity = (params: RecentActivityParams, options?: { refetchInterval?: number }) =>
  useQuery({
    queryKey: ["recent_activity", params],
    queryFn: () => getRecentActivity(params),
    staleTime: 0,
    refetchInterval: options?.refetchInterval,
  });

  export const useFetchStakingSettings = () =>
  useQuery({
    queryKey: ["staking_settings"],
    queryFn: getStakingSettings,
    staleTime: 0,
  });

  export const useFetchDrawResultById = (id?: string) =>
  useQuery({
    queryKey: ["draw_result_by_id", id],
    queryFn: () => getDrawResultById(id!),
    enabled: !!id,
    staleTime: 0,
  });