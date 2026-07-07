export type GetAPIParams = {
  success: boolean;
  message: string;
  data?: any;
}


export interface PaginatedResponse<T=any> {
  status: boolean;
  message?: string;
  data: T[];
  totalCount: number;
  currentCount: number;
}


