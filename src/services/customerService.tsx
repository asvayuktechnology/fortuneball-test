import { useMutation, useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import { CustemerWalletdata, CustemerPackage, DepositPackage, StakingSummerydata, verifyEmailType, fundTransferParams, FundTransferApiResponse, CustemerWalletList, verifyTokenData, customerDownline, downlineCustomerApiResponse, notificationParams, notificationRespone, SwapSettingRespone, RegisterVerifyPayload, RegisterResendOtpPayload } from "@/types/customer";
import { AxiosError } from "axios";
import { MutaionParams } from "@/types/common/mutation";
const getCustomerWallet = async (): Promise<CustemerWalletdata> => {
  const res = await HttpService.get('/customers/wallets');
  return res.data.data
};

const getCustomerDownline = async (params: customerDownline): Promise<downlineCustomerApiResponse> => {
  return HttpService.get(`/customers/customerdownline`, { params }).then(res => res.data);
};


const getCustomerFundTransfer = async (params: fundTransferParams): Promise<FundTransferApiResponse> => {
  return HttpService.get(`/customers/fundtransfer/transactions`, { params }).then(res => res.data);
};

const verifyEmail = async (data: verifyEmailType): Promise<void> => {
  const res = await HttpService.post('/customers/VerifyEmail', data);
  return res.data?.data
};

const verifyToken = async (data: verifyTokenData): Promise<void> => {
  const res = await HttpService.post('/decryption', data);
  return res.data?.data
};



const getAllPackages = async (): Promise<DepositPackage[]> => {
  const res = await HttpService.get('/packages');
  return res.data?.data
};

const getStakingSummery = async (): Promise<StakingSummerydata> => {
  const res = await HttpService.get('/stakingsummary');
  return res.data?.data
};

export const purchaseStakingPackage = async (payload: {
  amount: number
  walletType: string
}): Promise<void | AxiosError> => {
  const res = await HttpService.post('/purchase', payload);
  return res.data?.data
};

const uploadScreenshot = async (data: FormData): Promise<any> => {
  const res = await HttpService.post("/customers/payment-screenshot", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const getCustomerWalletList = async (): Promise<CustemerWalletList> => {
  const data = await getCustomerWallet();
  const dynamicWalletList: CustemerWalletList = [
    {
      label: `Staking Wallet (${data?.stakingwallet?.toFixed(2) ?? 0})`,
      value: "staking",
      amount: data?.stakingwallet?.toFixed(2) ?? 0,
    },
    {
      label: `Affiliate Wallet (${data?.affiliatewallet?.toFixed(2) ?? 0})`,
      value: "affiliate",
      amount: data?.affiliatewallet?.toFixed(2) ?? 0,
    },
    {
      label: `MTHT Wallet (${data?.depositwallet?.toFixed(2) ?? 0})`,
      value: "mtht",
      amount: data?.depositwallet?.toFixed(2) ?? 0,
    },

    {
      label: `Reward Wallet (${data?.royaltywallet?.toFixed(2) ?? 0})`,
      value: "royalty",
      amount: data?.royaltywallet?.toFixed(2) ?? 0,
    },
    // {
    //   label: `Deposit Wallet (${data?.depositwallet?.toFixed(2) ?? 0})`,
    //   value: "deposit",
    //   amount: data?.depositwallet?.toFixed(2) ?? 0,
    // },
    {
      label: `Booster Wallet (${data?.boosterwalletamount?.toFixed(2) ?? 0})`,
      value: "boosterwallet",
      amount: data?.boosterwalletamount?.toFixed(2) ?? 0,
    },
    // {
    //   label: `BTMETA Wallet (${data?.mthtwallet?.toFixed(2) ?? 0})`,
    //   value: "mtht",
    //   amount: data?.mthtwallet?.toFixed(2) ?? 0,
    // },
    {
      label: `USDT Wallet (${data?.USDTWalletamount?.toFixed(2) ?? 0})`,
      value: "usdt",
      amount: data?.USDTWallet?.toFixed(2) ?? 0,
    },
    {
      label: `BNB Wallet (${data?.BNBWallet?.toFixed(2) ?? 0})`,
      value: "BNBWallet",
      amount: data?.BNBWallet?.toFixed(2) ?? 0,
    },
  ];
  return dynamicWalletList
};


const getNotification = async (params: notificationParams): Promise<notificationRespone> => {
  const res = await HttpService.get('/customers/notifications', { params });
  return res?.data;
};

const getSwapData = async (): Promise<SwapSettingRespone> => {
  const res = await HttpService.get('/customers/swapsettings');
  return res?.data?.data
};

const SwapCurrency = async ({ Amount, Type }: { Amount: number, Type: "usdt" | "mtht" }): Promise<void> => {
  const res = await HttpService.post('/customers/swapcurrency', { Amount, Type });
  return res?.data?.data
};


export const sendProfileUpdateOtp = async (): Promise<void> => {
  await HttpService.post("customers/sendUpdateOTP");
};

export const registerVerify = async (
  payload: RegisterVerifyPayload
): Promise<any> => {
  const { data } = await HttpService.post("customers/reg-verify", payload);
  return data;
};

export const registerResendOtp = async (
  payload: RegisterResendOtpPayload
): Promise<any> => {
  const res = await HttpService.post(
    "/customers/resend-otp",
    payload
  );
  return res?.data?.data;
};

// export const registerVerify = async (payload: {
//   email: string;
//   otp: string;
// }): Promise<void> => {
//   await HttpService.post("customers/reg-verify", payload);
// };


export const updateCustomerProfile = async (data: any): Promise<void> => {
  await HttpService.post("/customers/updateCustomerProfileWithOTP", data);
};


export const useFetchNotificationList = (params: notificationParams) => useQuery({
  queryKey: ['notification_list'],
  queryFn: async () => getNotification(params),
  //  enabled: false,
  // staleTime: 0,
})

export const useUploadScreenshot = () =>
  useMutation({
    mutationFn: uploadScreenshot,
  });

export const useFetchCustomerWallet = () => useQuery({
  queryKey: ['customer_wallet'],
  queryFn: getCustomerWallet
});

export const useFetchSwapData = () => useQuery({
  queryKey: ['customer_swap_data'],
  queryFn: getSwapData
});


export const useFetchCustemerWalletList = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['customer_wallet_list'],
    queryFn: getCustomerWalletList,
    enabled: options?.enabled ?? true,
  });



export const useFetchAlPackageList = () => useQuery({
  queryKey: ['all_packages'],
  queryFn: getAllPackages
});

export const useFetchCustomerDownlineList = (params: customerDownline) =>
  useQuery({
    queryKey: ['customer_downline_list', params],
    queryFn: () => getCustomerDownline(params),
    enabled: !!params?.customerId,
    // cacheTime: 0,
    staleTime: 0,
  });


export const useFetchStakingSummery = () => useQuery({
  queryKey: ['customer_staking_summery'],
  queryFn: getStakingSummery
});

export const useFetchFundTransferList = (params: fundTransferParams) => {
  return useQuery({
    queryKey: ['customer_fund_transfer_list'],
    queryFn: async () => getCustomerFundTransfer(params)
  })
}


export const useVerifyEmail = () =>
  useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
    },
    onError: (error: any) => {
      console.error("Error verify email:", error?.response?.data?.message || error.message);
    },
    onSettled: () => {
    },
  });

export const useVerifyToken = () =>
  useMutation({
    mutationFn: verifyToken,
    onSuccess: (data) => {
    },
    onError: (error: any) => {
    },
    onSettled: () => {
    },
  });

export const useSwapCurrency = (params: MutaionParams) =>
  useMutation({
    mutationFn: SwapCurrency,
    onError: params.onError,
    onSuccess: params.onSuccess
  });

const redeemReward = async (redeemKey: string): Promise<any> => {
  const res = await HttpService.post("/customers/redeem", { redeemKey });
  return res.data;
};

export const useRedeemReward = () =>
  useMutation({
    mutationFn: redeemReward,
  });

/* ─────────────── Auto Purchase ─────────────── */

const getAutoPurchaseDetails = async (): Promise<any> => {
  return HttpService.get('/autopurchase/getdetails').then(res => res.data);
};

const cancelAutoPurchase = async (): Promise<void> => {
  await HttpService.put('/autopurchase/cancel');
};

const saveAutoPurchase = async (payload: {
  noOfTickets: number;
  walletType: string;
}): Promise<any> => {
  return HttpService.post('/autopurchase/save', payload).then(res => res.data);
};

export const useFetchAutoPurchaseDetails = () =>
  useQuery({
    queryKey: ['auto_purchase_details'],
    queryFn: getAutoPurchaseDetails,
  });

export const useCancelAutoPurchase = () =>
  useMutation({
    mutationFn: cancelAutoPurchase,
  });

export const useSaveAutoPurchase = () =>
  useMutation({
    mutationFn: saveAutoPurchase,
  });