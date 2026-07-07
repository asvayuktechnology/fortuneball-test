export type MutationParams = {
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
}
export type DownlineApiParams = {
    name: string;
    email: string;
    level: string;
    page: number;
    limit: number
};

export type Downlinedata = {
  customerId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  customerCode: string;
  level: number;
  parentFirstName: string;
  parentLastName: string;
  rank: string;
  joinDate: string; // ISO date string
  sponsor: {
    firstName: string;
    lastName: string;
    id: string;
  };
  parentId: string;
  recaptchaToken:string
};

export type DownlineApiRespone = {
    success: boolean;
    count: number;
    page: number;
    totalCount: number;
    data: Downlinedata[];
}
export type CustomerStakingApiRespone = {
    success: boolean;
    message: number;
    data: {
        totalActiveAmount: number
        totalActivecount: number
    }
}