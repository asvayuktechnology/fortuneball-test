import React, { useState, useEffect } from 'react';
import PageTitle from "../ui/common/pagetitle/PageTitle";
import { useFetchMyWithdwralRequest } from '@/services/withdrawlService';
import { WalletTransaction } from "@/types/withdrawl"
import { useDebounce } from "@/hooks/useDebounce";
import ListTable from '../ui/common/table/ListTable';
import Loader from '../ui/common/Loader';
import Button from '../ui/common/input/Button';
import { BlankRow } from '../ui/common/table/ListTable';
import moment from 'moment';
import { IoEye } from 'react-icons/io5';

const MyWithdwralRequestList = () => {
    const [params, setParams] = useState({
        page: 1,
        limit: 10
    });
    const debouncedQuery = useDebounce(params, 500);
    const { data, isLoading, refetch } = useFetchMyWithdwralRequest(params);
    const handleLimitChange = (limit: number) =>
        setParams((current) => ({ ...current, limit }));
    useEffect(() => {
        refetch();
    }, [debouncedQuery]);
    return (
        <div className="container mx-auto mt-12">
            <PageTitle title="My History" />
            <div className="mb-6">
                <div className="space-y-4">
                    {isLoading ?
                        <Loader /> :
                        <ListTable
                            header={['Withdrawal ID', 'Amount']}
                            data={data?.formatedData ?? []}
                            totalCount={data?.totalCount ?? 0}
                            currentLimit={params?.limit}
                            pageLimit={10}
                            handleLimitChange={handleLimitChange}
                        />}
                </div>
            </div>
        </div>
    )
};

export default MyWithdwralRequestList


const ListCard = ({ data, index }: { data: WalletTransaction, index: number }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [withdrawalId, setWithdrawalId] = useState(data?._id);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 700) setWithdrawalId(`${data?._id?.slice(0, 8)}...`)
            else if (window.innerWidth < 500) setWithdrawalId(`${data?._id?.slice(0, 5)}...`)
            else setWithdrawalId(data?._id)
        };

        window.addEventListener("resize", handleResize);
        // Cleanup function
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])
    return (
      <>
        <div
          className="w-full flex items-center  justify-between  cursor-pointer border border-white/10 rounded-md mb-2 bg-white/5 text-white px-4 py-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs turnicate">{index + 1}</span>
            <div className="flex flex-col gap-[6px]">
              <span className="text-xs overflow-hidden truncate  text-ellipsis">
                {withdrawalId}
              </span>
              <span className="text-[10px] turnicate">
                {moment(data?.createdAt)?.format("lll")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs overflow-hidden truncate flex items-center gap-2">
              {data?.requestamount}
              <IoEye />
            </span>
            {/* <span className="bg-green-700 text-xs px-3 py-1 rounded-sm">
                        <IoArrowDownOutline />
                    </span> */}
          </div>
        </div>
        {showDetails && (
          <div
            className=" text-[11px] -mt-4 text-white px-4 py-2 bg-[#292930] rounded-b-md space-y-1
"
          >
            {/* <div className=''>
                            <strong>Withdrawal ID</strong>: {data?._id}
                        </div> */}
            <div>
              <strong>Wallet Type</strong>: {data?.walletType}
            </div>
            {/* <div>
                        <strong>Request amount</strong>: {data?.requestamount}
                    </div> */}
            <div>
              <strong>Wallet Address</strong>: {data?.walletAddress}
            </div>
            <div>
              <strong>Status:</strong>: {data?.status}
            </div>
            <div>
              <strong>Date:</strong>: {moment(data?.createdAt)?.format("lll")}
            </div>
          </div>
        )}
      </>
    );
}

export const MyWithdwralRequestList2 = () => {
    const defaultLimit = 10;
    const [params, setParams] = useState({
        page: 1,
        limit: defaultLimit
    });
    const debouncedQuery = useDebounce(params, 500);
    const { data, isLoading, refetch } = useFetchMyWithdwralRequest(params);
    const handleLimitChange = (limit: number) =>
        setParams((current) => ({ ...current, limit }));
    useEffect(() => {
        refetch();
    }, [debouncedQuery]);
    return (
        <div className="w-full flex flex-col gap-2 mt-6 text-gray-300">
            <div className="w-full flex items-center  justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <span className='text-xs turnicate'>#</span>
                    <span className='text-xs turnicate'> Withdrawal ID</span>
                </div>
                <div className="flex items-center gap-4">~
                    <span className='text-xs turnicate'>Amount MTHT</span>
                    {/* <span className='text-xs turnicate'>show more</span> */}
                </div>
            </div>
            {
                isLoading ? (<Loader />) : data?.data && data?.data?.length < 1 ? (<BlankRow />) : data?.data?.map((row, key) => (<ListCard index={key} data={row} key={key} />))
            }
            {data?.totalCount && data?.totalCount > params?.limit ? (
                <div className='flex items-center justify-center mt-6'>
                    {/* <Button text='' onClick={() => handleLimitChange(params?.limit + defaultLimit)}>Load more</Button> */}
                    <Button text='' className='loadmore relative' onClick={() => handleLimitChange(params?.limit + defaultLimit)} >
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Load More</span>
                    </Button>
                </div>
            ) : null}

        </div>
    )
}
