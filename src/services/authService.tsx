// authService.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import HttpService from "./httpService";
import { CustomerStakingApiRespone, DownlineApiParams, DownlineApiRespone, MutationParams } from "@/types/auth";

export const registerBasic = async (data: any): Promise<any> => {
  return HttpService.post("/signup", data).then(res => res.data);
};

export const customerRegister = async (data: any): Promise<any> => {
  return HttpService.post("/customers/register", data).then(res => res.data);
};
export const authLogin = async (data: any): Promise<any> => {
  return HttpService.post("/login", data).then(res => res.data);
};

export const forgetPassword = async (data: any): Promise<any> => {
  return HttpService.post("/forgot-password", data).then(res => res.data);
};
export const resetPassword = async (data: { newPassword: string }, token: string): Promise<any> => {
  return HttpService.post(`/reset-password/${token}`, data).then(res => res.data);
};

const authProfile = async (): Promise<any> => {
  const res = await HttpService.get(`/customers/customer`);
  return res.data;
};
const customerList = async (params: DownlineApiParams): Promise<DownlineApiRespone> => {
  return HttpService.get(`/customers/downline`, { params }).then(res => res.data);
};

const customerActiveStaking = async (id?:string): Promise<CustomerStakingApiRespone> => {
  return HttpService.get(`/staking/active/${id}`).then(res => res.data);
};

const ChnagePassword = async (data: { currentPassword: string, newPassword: string }): Promise<void> => {
  await HttpService.post('/customers/updateCustomerPassword', data)
}

export const useFetchAuthprofile = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["auth_user"],
    queryFn: authProfile,
    enabled: options?.enabled ?? false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

export const useFetchCustomerList = (params: DownlineApiParams) => {
  return useQuery({
    queryKey: ['customer_list'],
    queryFn: async () => customerList(params)
  })
}


export const useFetchCustomerStaking = (id?: string) => {
  return useQuery({
    queryKey: ['customer_staking', id], // Query key changes with id
    queryFn: async () => customerActiveStaking(id),
    enabled: !!id, // Only fetch when id is available
  });
};


export const useCustomerRegister = (params: MutationParams) =>
  useMutation({
    mutationFn: customerRegister,
    onSuccess: params?.onSuccess,
    onError: params?.onError
  });

export const useLogin = (params: MutationParams) =>
  useMutation({
    mutationFn: authLogin,
    onSuccess: params?.onSuccess,
    onError: params?.onError
  });

export const useChangePassword = (params: MutationParams) =>
  useMutation({
    mutationFn: ChnagePassword,
    onSuccess: params?.onSuccess,
    onError: params?.onError
  });



