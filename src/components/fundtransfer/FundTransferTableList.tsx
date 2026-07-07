import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useDebounce } from "@/hooks/useDebounce";
import Loader from '../ui/common/Loader';
import Button from '../ui/common/input/Button';
import { BlankRow } from '../ui/common/table/ListTable';
import { IoEye } from 'react-icons/io5';
import { useFetchFundTransferList } from "@/services/funndtransferService";
import { Transaction } from "@/types/customer";
import { dateTimeFormat } from "@/utils";
import SearchInput from "../ui/common/input/SearchInput";

const ListCard = ({ data, index }: { data: Transaction, index: number }) => {
    const [showDetails, setShowDetails] = useState(false);
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
                {data?.email}
              </span>
              <span className="text-[10px] turnicate">
                {dateTimeFormat(data?.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs overflow-hidden truncate flex items-center gap-2">
              {data?.amount}
              <IoEye />
            </span>
          </div>
        </div>
        {showDetails && (
          <div
            className=" text-[11px] -mt-4 text-white px-4 py-2 bg-[#292930] rounded-b-md space-y-1
"
          >
            <div>
              <strong>Name</strong>: {data?.name}
            </div>
            {/* <div>
                        <strong>Email</strong>: {data?.email}
                    </div> */}
            <div>
              <strong>Wallet Type</strong>: {data?.wallet}
            </div>
            {/* <div>
                        <strong>Amount</strong>: {data?.amount}
                    </div>
                    <div>
                        <strong>Date:</strong>: {dateTimeFormat(data?.createdAt)}
                    </div> */}
          </div>
        )}
      </>
    );
}

export const MyFundTransferList = forwardRef((_, ref) => {
    const defaultLimit = 10;
    const [params, setParams] = useState({
        search: "",
        page: 1,
        limit: defaultLimit
    });
    const debouncedQuery = useDebounce(params, 500);
    const { data, isLoading, refetch } = useFetchFundTransferList(params);

    const handleLimitChange = (limit: number) =>
        setParams((current) => ({ ...current, limit }));

    const handleSearchChange = (search: string) =>
        setParams((current) => ({ ...current, search }));

    useEffect(() => {
        refetch();
    }, [debouncedQuery]);

    useImperativeHandle(ref, () => ({
        refetchList: () => {
            refetch();
        }
    }));

    return (
        <div>
            <SearchInput
                label="Search"
                name="search"
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search"
            />
            <div className="w-full flex flex-col gap-2 mt-6 text-gray-300">
                <div className="w-full flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                        <span className='text-xs truncate'>#</span>
                        <span className='text-xs truncate'>Email</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className='text-xs truncate'>Amount MTHT</span>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : data?.data?.length && data?.data?.length < 1 ? (
                    <BlankRow />
                ) : (
                    data?.data ? data.data.map((row, key) => <ListCard index={key} data={row} key={key} />) : null
                )}

                {data?.totalCount && data.totalCount > params.limit ? (
                    <div className='flex items-center justify-center mt-6'>
                        <Button
                            text=''
                            className='loadmore relative'
                            onClick={() => handleLimitChange(params.limit + defaultLimit)}
                        >
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Load More</span>
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
});

// ✅ Add display name to fix ESLint warning
MyFundTransferList.displayName = 'MyFundTransferList';


