import React, { useState, useEffect } from 'react';
import { fundTransferRequest } from "@/types/transaction";
import { fundTransferParams } from "@/types/customer";
import { useDebounce } from "@/hooks/useDebounce";
import moment from 'moment';
import Table from "@/components/ui/common/table";
import SearchInput from "../ui/common/input/SearchInput";
import { useFetchFundTransferList } from "@/services/funndtransferService";
import ListTable from '../ui/common/table/ListTable';
const Column = [
    {
        field: "#",
        cell: (row: fundTransferRequest, index: number) => <p>{index + 1}</p>,
    },
    {
        field: "Email",
        cell: (row: fundTransferRequest) => <p>{row?.email ?? "Not provided"}</p>,
    },
    {
        field: "Wallet",
        cell: (row: fundTransferRequest) => row?.wallet,
    },
    {
        field: "Amount",
        cell: (row: fundTransferRequest) => row?.amount,
    },
    {
        field: "Date",
        cell: (row: fundTransferRequest) => moment(row?.createdAt).format("lll"),
    },
];

const tabData = [
    {
        label: `Today's Transaction`,
        content: <div>Today Transactions</div>,
        typeValue: -1
    },
    {
        label: "Staking",
        content: <div>Today Transactions</div>,
        typeValue: 0
    },
];
export const FundTransferList = () => {
    const [params, setParams] = useState<fundTransferParams>({
        search: "",
        page: 1,
        limit: 10,
    });
    const debouncedQuery = useDebounce(params, 500);
    const {
        data: fundCustomerData,
        isLoading: isLoadingFund,
        refetch: refetchFundTransferData,
    } = useFetchFundTransferList(params);
    const handlePageChange = (page: number) =>
        setParams((current) => ({ ...current, page }));

    const handleSearch = (search: string) => setParams(current => ({ ...current, search }))
    useEffect(() => {
        refetchFundTransferData();
    }, [debouncedQuery]);

    return (
        <div className="md:mb-6 mb-3  text-white rounded-xl  md:p-6 py-6 px-3">
            <div className="mb-6">
                <h4 className="text-xl font-semibold">
                    Transfer List
                    <br />
                </h4>
            </div>

            <SearchInput
                label="Search User"
                name="search"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email"
            />

            <div className="space-y-4">
                <Table
                    columns={Column}
                    data={fundCustomerData?.data ?? []}
                    isLoading={isLoadingFund}
                    pagination={{
                        page: 1,
                        perPage: 10,
                        totalCount: 10,
                        handlePageChange: handlePageChange,
                    }}
                />
            </div>
        </div>
    )
}