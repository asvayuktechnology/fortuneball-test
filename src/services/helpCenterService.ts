import { useQuery, useMutation } from "@tanstack/react-query";
import HttpService from "./httpService";
import { MutationParams } from "@/types/auth";

type HelpRequestSendAPIData = {
  category: string;
  subcategory: string;
  message: string;
  screenshot?: any;
};

export type HelpRequestListAPIParams = {
  page: number;
  limit: number;
  status: string;
};
export type SupportTicket = {
  _id: string;
  category: string;
  subcategory: string;
  message: string;
  screenshot: string;
  status: "Open" | "Closed" | "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  __v: number;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  unreadSupportReplies?:number
};
type HelpRequestListAPIResponse = {
  success: boolean;
  message: string;
  count: 1;
  totalCount: 1;
  page: 1;
  totalPages: 1;
  data: SupportTicket[];
};

export interface ReplyTicketBody {
  // sender: string;
  message: string;
}

export interface ReplyTicketRequest {
  ticketId: string;
  body: ReplyTicketBody;
}

const sendHelpRequest = async (data: HelpRequestSendAPIData): Promise<void> => {
  if (data?.screenshot) {
    const formdata = new FormData();
    formdata.append("category", data?.category);
    formdata.append("subcategory", data?.subcategory);
    formdata.append("message", data?.message);
    formdata.append("screenshot", data?.screenshot);
    await HttpService.post("/customers/createhelprequest", formdata);
  } else
    
    await HttpService.post("/customers/createhelprequest", data);
};

const replyTicket = async ({
  ticketId,
  body,
}: ReplyTicketRequest): Promise<void> => {
  const res = await HttpService.post(`/customers/reply/${ticketId}`, body);
  return res?.data?.data;
};

const getHelpRequestList = async (
  params: HelpRequestListAPIParams
): Promise<HelpRequestListAPIResponse> => {
  const res = await HttpService.get("/customers/listhelprequests", { params });
  return res.data;
};

const getTicketDetails = async (ticketId: string): Promise<any> => {
  return HttpService.get(`/customers/ticket/${ticketId}`).then(res => res.data);
};

// ************************************React Query Function**********************************

export const useFetchHelpRequestList = (params: HelpRequestListAPIParams) =>
  useQuery({
    queryKey: ["help_request_list"],
    queryFn: async () => getHelpRequestList(params),
  });

export const useSendHelpRequest = (params: MutationParams) =>
  useMutation({
    mutationFn: sendHelpRequest,
    onSuccess: params?.onSuccess,
    onError: params?.onError,
  });

export const useReplyTicket = () =>
  useMutation({
    mutationFn: replyTicket,
    onSuccess: (data) => {
    },
    onError: (error: any) => {
      console.error(
        "Error verify token:",
        error?.response?.data?.message || error.message
      );
    },
    onSettled: () => {
    },
  });

export const useFetchTicketDetails = (ticketId: string) =>
  useQuery({
    queryKey: ['tickets-detail', ticketId],
    queryFn: () => getTicketDetails(ticketId),
    enabled: !!ticketId,
    staleTime: 0,
  });
