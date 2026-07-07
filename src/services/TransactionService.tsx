import { useMutation, useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import {
  Transaction,
  InitiateWithdrawals,
  InitiateWithdrawalsRepone,
  ConfirmWithdrawalResponse,
  WithdrawalRequest,
  otpType,
  fundTransferType,
  AllTransactionApiParams,
  CustomerTransactionsResponse,
  CustomerTransaction,
  AllHistoryApiParams,
  CustomerHistoryTransactionsResponse,
  GetAllTransaction,
  depositWalletType,
  AffiliateIncomeResponse
} from "@/types/transaction";
import moment from "moment";
import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";
import { fundTransferParams } from "@/types/customer";
import { GetAPIParams, PaginatedResponse } from "@/types/common/response";
export const fetchTxnCustomerLive = async () => {
  return HttpService.post(`transaction/live`).then(res => res.data);
};
export const fetchTxnUsdtCustomerLive = async () => {
  return HttpService.post(`transaction/live-usdt`).then(res => res.data);
};

export const getTransactionList = async (): Promise<Transaction[]> => {
  const res = await HttpService.get(`customers/transactions`);
  return res?.data.data
};

export const getMyWithdrawalList = async (): Promise<WithdrawalRequest[]> => {
  const res = await HttpService.get(`withdrawals/my-withdrawals`);
  return res?.data.data
};

const initiateWithdrawals = async (payload: InitiateWithdrawals): Promise<InitiateWithdrawalsRepone> => {
  const res = await HttpService.post(`withdrawals/initiate`, payload);
  return res?.data
};

export const confirmWithdrawals = async (payload: otpType): Promise<ConfirmWithdrawalResponse> => {
  const res = await HttpService.post(`withdrawals/confirm`, payload);
  return res?.data
};
export const confirmfundTransfer = async (payload: otpType): Promise<ConfirmWithdrawalResponse> => {
  const res = await HttpService.post(`customers/confirmtransfer`, payload);
  return res?.data
};

const fundTransfer = async (payload: fundTransferType): Promise<ConfirmWithdrawalResponse> => {
  const res = await HttpService.post(`customers/fundtransfer`, payload);
  return res?.data
};

const formatTransationData = (transaction: CustomerTransaction[]): ListCardData[] => {
  const formatedData: ListCardData[] = [];
  for (let i = 0; i < transaction.length; i++) {
    const {
      _id,
      customerId,
      amount,
      createdAt,
      toName,
      toEmail,
      customerName,
      customerEmail,
    } = transaction[i];
    formatedData.push({
      mainData: [customerId, customerName, amount?.toString(), moment(createdAt)?.format('lll')],
      secondaryData: [
        {
          name: 'Withdrawal ID',
          value: _id
        },
        {
          name: 'Name',
          value: customerName ?? ''
        },
        {
          name: 'Email',
          value: customerEmail ?? ''
        },
        {
          name: 'Amount',
          value: amount?.toString()
        },
        {
          name: 'Date',
          value: moment(createdAt)?.format('lll')
        },
      ],
      index: i + 1
    })
  }
  return formatedData
}
const alltransaction = async (params: AllTransactionApiParams): Promise<CustomerTransactionsResponse> => {
  if (params?.type == -1) {
    // params.today = true;
    delete params?.type
  }
  const res = await HttpService.get(`customers/transactions`, { params });
  const formatedData = formatTransationData(res?.data?.data ?? []);
  res.data.listTableData = formatedData;
  return res?.data
};
const getAllHistory = async (params: AllHistoryApiParams): Promise<CustomerHistoryTransactionsResponse> => {

  const res = await HttpService.get(`customers/dailyreport`, { params });
  // const formatedData = formatTransationData(res?.data?.data ?? []);
  // res.data.listTableData = formatedData;
  // console.log('res', res)
  return res?.data ?? []
};


export const getAffiliateIncome = async (params: {
  page: number;
  limit: number;
}) => {
  const res = await HttpService.get("/getAffiliateIncome", {
    params,
  });

  return res.data;
};


export const useFetchCustomerTransactionList = () => useQuery({
  queryKey: ['customer_transaction_list'],
  queryFn: getTransactionList
});

export const useFetchMyWithdrawalList = () => useQuery({
  queryKey: ['customer_withdrawal_list'],
  queryFn: getMyWithdrawalList
})
export const useFetchAllTransaction = (params: AllTransactionApiParams) => useQuery({
  queryKey: ['customer_all_transaction'],
  queryFn: async () => alltransaction(params)
})

export const useFetchAllHistory = (params: AllHistoryApiParams) => useQuery({
  queryKey: ['customer_all_history'],
  queryFn: async () => getAllHistory(params)
})

export const useInitiateWithdrawals = () =>
  useMutation({
    mutationFn: initiateWithdrawals,
    onSuccess: (data) => {
    },
    onError: (error: any) => {
      console.error("Error initiating withdrawal:", error?.response?.data?.message || error.message);
    },
    onSettled: () => {
    },
  });
export const useConfirmWithdrawal = () =>
  useMutation({
    mutationFn: confirmWithdrawals,
    onSuccess: (data) => {
      // console.log("Withdrawal initiated:", data);
    },
    onError: (error: any) => {
      // console.error("Error initiating withdrawal:", error?.response?.data?.message || error.message);
    },
    onSettled: () => {
      // console.log("Mutation is done (success or error)");
    },
  });
export const useConfirmTransfer = () =>
  useMutation({
    mutationFn: confirmfundTransfer,
    onSuccess: (data) => {
      // console.log("Confirm transfer:", data);
    },
    onError: (error: any) => {
      // console.error("Error sending transfer:", error?.response?.data?.message || error.message);
    },
    onSettled: () => {
      // console.log("Mutation is done (success or error)");
    },
  });
export const useFundTransfer = () =>
  useMutation({
    mutationFn: fundTransfer,
    onSuccess: (data) => {
      // console.log("Fund Transfer initiated:", data);
    },
    onError: (error: any) => {
      // console.error("Error fund transfer:", error?.response?.data?.message || error.message);
    },
    onSettled: () => {
      // console.log("Mutation is done (success or error)");
    },
  });


  //my loto-game service
  export const getTransaction = async (params: GetAllTransaction): Promise<PaginatedResponse> => {
    return HttpService.get("/transaction/bid-transactions", { params, }).then((res) => res.data);
  };



  //hooks
  export const useFetchTransaction = (
    params: GetAllTransaction,
    options?: { enabled?: boolean }
  ) =>
    useQuery({
      queryKey: ["all_transaction", params],
      queryFn: () => getTransaction(params),
      staleTime: 0,
      enabled: options?.enabled ?? true,
    });


export const depositWallet = async (data: depositWalletType): Promise<GetAPIParams> => {
  return HttpService.post("/verify-deposit", data).then((res) => res.data);
};


export const useDepositWalletMutation = () => {
  return useMutation<GetAPIParams, Error, depositWalletType>({
    mutationFn: depositWallet,
  });
};

export const useFetchAffiliateIncome = (
  params: { page: number; limit: number }
) =>
  useQuery({
    queryKey: ["affiliate_income", params],
    queryFn: () => getAffiliateIncome(params),
  });