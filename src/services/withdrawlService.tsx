import { useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import { WalletTransactionResponse, WalletTransaction, GetListAPIParams } from "@/types/withdrawl";
import { ListCardData } from "@/components/ui/common/table/ListTable/ListCard";
import moment from "moment";
const formatDataForListTable = (walletdata: WalletTransaction[]): ListCardData[] => {
    const formatedData: ListCardData[] = [];
    for (let i = 0; i < walletdata.length; i++) {
        const { _id, walletAddress, walletType, requestamount, status, requestDate } = walletdata[i];
        formatedData.push({
            index: i + 1,
            mainData: [_id, requestamount?.toString()],
            secondaryData: [
                {
                    name: 'Withdrawal ID',
                    value: _id
                },
                {
                    name: 'Wallet Type',
                    value: walletType
                },
                {
                    name: 'Request amount',
                    value: requestamount?.toString()
                },
                {
                    name: 'Withdrawal fee',
                    value: ""
                },
                {
                    name: 'Wallet Address',
                    value: walletAddress
                },
                {
                    name: 'Status',
                    value: status
                },
                {
                    name: 'Date',
                    value: moment(requestDate).format('lll')
                }
            ]
        })
    }
    return formatedData
}
const getWithdwralList = async (params: GetListAPIParams): Promise<WalletTransactionResponse> => {
    const res = await HttpService.get('/withdrawals/my-withdrawals', { params });
    const formatedData = formatDataForListTable(res?.data?.data ?? []);
    res.data.formatedData = formatedData;
    return res?.data;
};

export const useFetchMyWithdwralRequest = (params: GetListAPIParams) => useQuery({
    queryKey: ['mt_Withdwral_request', params?.page],
    queryFn: async () => getWithdwralList(params)
})