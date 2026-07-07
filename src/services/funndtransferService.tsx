import { useMutation, useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import { verifyEmailType, fundTransferParams, FundTransferApiResponse, Transaction } from "@/types/customer";
import { MutationParams } from "@/types/auth";
import {
    ConfirmWithdrawalResponse,
    otpType,
    fundTransferType,
} from "@/types/transaction";
import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";
import moment from "moment";

const formatTransationData = (transaction: Transaction[]): ListCardData[] => {
    const formatedData: ListCardData[] = [];
    for (let i = 0; i < transaction.length; i++) {
        const {
            _id,
            wallet,
            email,
            amount,
            name,
            createdAt,
        } = transaction[i];
        formatedData.push({
            mainData: [email ?? '--', amount?.toString()],
            secondaryData: [
                {
                    name: 'Withdrawal ID',
                    value: _id ?? ''
                },
                {
                    name: 'Name',
                    value: name ?? ''
                },
                {
                    name: 'Email',
                    value: email ?? ''
                },
                {
                    name: 'Wallet',
                    value: wallet ?? ''
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
};

const getCustomerFundTransfer = async (params: fundTransferParams): Promise<FundTransferApiResponse> => {
    const res = await HttpService.get(`/customers/fundtransfer/transactions`, { params });
    const formatedData = formatTransationData(res?.data?.data);
    res.data.listTableData = formatedData;
    return res?.data
};

const verifyEmail = async (data: verifyEmailType): Promise<void> => {
    const res = await HttpService.post('/customers/VerifyEmail', data);
    return res.data?.data
};

export const confirmfundTransfer = async (payload: otpType): Promise<ConfirmWithdrawalResponse> => {
    const res = await HttpService.post(`customers/confirmtransfer`, payload);
    return res?.data
};

const fundTransfer = async (payload: fundTransferType): Promise<ConfirmWithdrawalResponse> => {
    const res = await HttpService.post(`customers/fundtransfer`, payload);
    return res?.data
};

export const useFetchFundTransferList = (params: fundTransferParams) => {
    return useQuery({
        queryKey: ['customer_fund_transfer_list'],
        queryFn: async () => getCustomerFundTransfer(params)
    })
}

export const useVerifyEmail = (params: MutationParams) => useMutation({
    mutationFn: verifyEmail,
    onError: params?.onError,
    onSuccess: params?.onSuccess
});

export const useFundTransfer = (params: MutationParams) => useMutation({
    mutationFn: fundTransfer,
    onError: params?.onError,
    onSuccess: params?.onSuccess
});

export const useConfirmTransfer = (params: MutationParams) => useMutation({
    mutationFn: confirmfundTransfer,
    onError: params?.onError,
    onSuccess: params?.onSuccess
});