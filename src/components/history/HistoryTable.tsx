import React, { useEffect, forwardRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "../ui/common/Loader";
import Button from "../ui/common/input/Button";
import { BlankRow } from "../ui/common/table/ListTable";
import { IoArrowDownOutline, IoArrowUpOutline, IoEye } from "react-icons/io5";
import { useFetchAllHistory } from "@/services/TransactionService";
import { dateFormat, dateTimeFormat } from "@/utils";
import SearchInput from "../ui/common/input/SearchInput";
import { AllHistoryApiParams, CustomerHistoryTransaction, CustomerTransaction } from "@/types/transaction";
import Tabs from "../tabs/Tabs";
import { layrexlogo } from "@/config/constants";
import Image from "next/image";

const ListCard = ({
  data,
  index,
  type,
}: {
  data: CustomerHistoryTransaction;
  index: number;
  type: string;
}) => {

  return (
    <>
      <div className="w-full flex items-center  justify-between  cursor-pointer border border-white/10 rounded-md mb-2 bg-white/5 text-white px-4 py-2">
        <div className="flex items-center gap-4">
          {/* <span className='text-xs turnicate'>{index + 1}</span> */}
          <Image
            src={layrexlogo ? layrexlogo : "/images/layrexlogo.png"}
            alt={`Image`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <div className="flex flex-col gap-[6px]">
            <span className="text-[10px] turnicate">
              {dateFormat(data?.date)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs overflow-hidden truncate flex items-center gap-2">
            <span
              className={` flex items-center gap-1 px-1 py-0.5 rounded-sm font-bold text-[14px] ${
                data.transactionType === "credit"
                  ? "text-green-600"
                  : "text-rose-600"
              }`}
            >
              {data.transactionType === "credit" ? "+" : "-"}{" "}
              {data?.totalAmount.toFixed(2)} USDT
            </span>
            {/* <IoEye /> */}
          </span>
        </div>
      </div>
    </>
  );
};

const tabData = [
  {
    label: "Staking",
    typeValue: 'staking'
  },
  {
    label: `Affilate`,
    typeValue: 'affiliate'
  },
];

export const MyHistoryList = () => {
  const defaultLimit = 10;
const [params, setParams] = useState<AllHistoryApiParams>({
  type: 'staking',
  page: 1,
  limit: 10,
});
  const debouncedQuery = useDebounce(params, 500);
  const handlePageChange = (limit: number) =>
    setParams((current) => ({ ...current, limit }));

  // const handleSearch = (search: string) =>
  //   setParams((current) => ({ ...current, search }));
  const {
    data,
    isLoading,
    refetch: refetchList,
  } = useFetchAllHistory(params);


const handleTypeChange = (tabIndex: number) =>
  setParams((current) => {
    const typeValue = tabData[tabIndex]?.typeValue;
    return {
      ...current,
      type: typeValue as 'affiliate' | 'staking', // Assert the type
    };
  });

  useEffect(() => {
    refetchList();
  }, [debouncedQuery]);

  return (
    <>  {isLoading ? (
            <Loader />
          ) : (
      <div>
        {/* <SearchInput
        label="Search"
        name="search"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search"
      /> */}
        <Tabs tabs={tabData} handdetabChange={handleTypeChange} />
        <div className="space-y-4">
          <div className="w-full flex flex-col gap-2 text-gray-300">
            <div className="w-full flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-4">
                <span className="text-xs truncate">USDT</span>
                <span className="text-xs truncate">Date</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs truncate">Amount</span>
              </div>
            </div>

            {/* {isLoading ? (
            <Loader />
          ) : data?.data?.length && data?.data?.length < 1 ? (
            <BlankRow />
          ) : data?.data ? (
            data.data.map((row, key) => (
              <ListCard type={params.type} index={key} data={row} key={key} />
            ))
          ) : null} */}

            {data?.data?.length === 0 ? (
              <BlankRow />
            ) : data?.data ? (
              data.data.map((row, key) => (
                <ListCard type={params.type} index={key} data={row} key={key} />
              ))
            ) : null}

            {data?.totalCount && data.totalCount > params.limit ? (
              <div className="flex items-center justify-center mt-6">
                <Button
                  text=""
                  className="loadmore relative"
                  onClick={() => handlePageChange(params.limit + defaultLimit)}
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
      </div>
          )}
    </>
  );
};
