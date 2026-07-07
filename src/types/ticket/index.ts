export interface BuyTicketRequest {
  walletType: "staking" | "main" | string;
  tickets: string[];
}


export interface TicketBall {
  digit: number;
  color: string;
}

export interface TicketType {
  id: number;
  numbers: TicketBall[];
}

export type TicketStatus = "Active" | "History";

export type TicketList = {
  id: number;
  status: TicketStatus;
  amount: string;
  draw: string;
  date: string;
  time: string;
  balls: string[];
};

export type GetAllTicketParams = {
  page: number;
  limit: number
  status: string;
}

export interface ActiveBid {
  _id: string;
  bidNo: string;
  drawDate: string;
  drawTime: string;
  winningNumber: string | null;
  status: string;
  ticketPrice: number;
  totalTickets: number;
  totalCollection: number;
  totalWinners: number;
  totalPayout: number;
  totalTicketsPurchased: number;
  mthtValue: number | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveBidResponse {
  status: boolean;
  data: ActiveBid;
}

export interface BidSummaryData {
  activeBid: ActiveBid;
  lastCompletedBid: ActiveBid;
}

export interface BidSummaryResponse {
  success: boolean;
  data: BidSummaryData;
}


export interface RecentActivityItem {
  _id: string;
  customerId: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  activity: string;
  amount: number;
  type: number;
  drawNumber: string;
  activityDateTime: string;
  createdAt: string;
  updatedAt: string;
}


export type RecentActivityParams = {
  page: number;
  limit: number;
}

export type GetAllDrawParams = {
  page: number;
  limit: number;
  bidNo?: string;
  fromDate?: string | Date | null;
  toDate?: string | Date | null;
}

export type Prize = {
  prize: string;
  amount: number;
  winningNumber: string;
};
export type CustomerWin = {
  won: boolean;
  totalWon: number;
  tickets: {
    _id: string;
    ticketNumber: string;
    prizeLevel: number;
    prizeAmount: number;
  }[];
};
export type PrizeBreakdown = {
  level: number;
  prizeName: string;
  match: string;
  winningNumber: string;
  prizeAmount: number;
  winnerCount: number;
  won: boolean;
};
export type DrawRecord = {
  _id: string;
  bidNo: string;
  drawDate: string;
  winningNumber: number | null;
  totalWinners: number;
  totalTickets?:number;
  totalPayout?:number;
  customerWin?: CustomerWin;
  
  prizes: Prize[];
};