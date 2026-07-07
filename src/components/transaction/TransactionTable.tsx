import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "../ui/common/Loader";
import Button from "../ui/common/input/Button";
import { BlankRow } from "../ui/common/table/ListTable";
import { useFetchTransaction } from "@/services/TransactionService";
import { dateTimeFormat } from "@/utils";
import { CustomerTransaction, GetAllTransaction, TransactionType } from "@/types/transaction";
import { layrexlogo, mthtImage, usdtImage } from "@/config/constants";
import Image from "next/image";

type TabType = {
  label: string;
  typeValue: TransactionType;
};

const tabData: TabType[] = [
  { label: "Deposit", typeValue: 0 },
  { label: "Purchase", typeValue: 1 },
  { label: "Winning", typeValue: 2 },
  { label: "Welcome Bonus", typeValue: 3 },
  { label: "Affilate", typeValue: 5 },
];

// ─── ListCard ────────────────────────────────────────────────────────────────

const ListCard = ({
  data,
  type,
}: {
  data: any;
  index: number;
  type: number | undefined;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isCredit =
    data.transactiontype === "credit" || data.transactiontype === "deposit";

  return (
    <div className="mb-2">
      <div
        className={`w-full flex items-center justify-between border border-[#7c56ff]/30 rounded-full bg-[#2a165e]/70 text-white px-4 py-2 transition-all duration-200 ${
          type === 6 ? "cursor-pointer hover:bg-white/10" : ""
        } ${showDetails ? "rounded-b-none" : ""}`}
        onClick={() => type === 6 && setShowDetails((prev) => !prev)}
      >
        
        <div className="flex items-center gap-4">
          <Image
              src={
    type === 0
      ? data?.depositType?.toLowerCase() === "usdt"
        ? usdtImage
        : mthtImage
      : mthtImage
  }
            alt="icon"
            width={30}
            height={30}
            className="rounded-full"
          />
          <div className="flex flex-col gap-[6px]">
            {/* <span className="text-xs truncate max-w-[140px]">{data?._id}</span> */}
            <span className="text-xs truncate max-w-[140px]">{data?.bidId?.bidNo}</span>
            <span className="text-[10px] text-gray-400">
              {dateTimeFormat(data?.createdAt)}
            </span>
          </div>
        </div>

        <span
          className={`font-bold text-sm px-2 py-0.5 rounded ${
            isCredit
              ? "text-green-400 bg-green-400/10"
              : "text-rose-400 bg-rose-400/10"
          }`}
        >
          {isCredit ? "+" : "-"}
          {data?.amount.toFixed(2)} {type === 0 ? data?.depositType?.toUpperCase() : "MTHT"}
        </span>
      </div>

      {type === 6 && showDetails && (
        <div className="text-[11px] text-white px-4 py-3 bg-[#292930] rounded-b-md space-y-1 border border-t-0 border-white/10">
          <div><strong className="text-gray-400">Name:</strong> {data?.customerName}</div>
          <div><strong className="text-gray-400">Email:</strong> {data?.customerEmail}</div>
          <div><strong className="text-gray-400">Type:</strong> {data?.transactiontype}</div>
        </div>
      )}
    </div>
  );
};

// ─── Inline Tabs (FIX: controlled active state) ──────────────────────────────

const TransactionTabs = ({
  activeIndex,
  onChange,
}: {
  activeIndex: number;
  onChange: (index: number) => void;
}) => {
  return (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {tabData.map((tab, index) => (
        <button
          key={tab.typeValue}
          onClick={() => onChange(index)}
          className={`cursor-pointer whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
            activeIndex === index
              ? "bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)] text-black shadow-lg"
              : "border border-[#7c56ff]/30 bg-[#2a165e]/70 text-[#c7bfff] hover:border-[#7c56ff]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const MyTransactionList = () => {
  const defaultLimit = 10;

  // KEY FIX: track activeTabIndex separately so tabs stay in sync
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [params, setParams] = useState<GetAllTransaction>({
    type: tabData[0].typeValue,
    page: 1,
    search: "",
    limit: defaultLimit,
  });

  const debouncedQuery = useDebounce(params, 500);

  const { data, isLoading, refetch: refetchList } = useFetchTransaction(params);

  console.log(data, 'dsd')

  useEffect(() => {
    refetchList();
  }, [debouncedQuery]);

  // KEY FIX: update both activeTabIndex AND params.type together
  const handleTabChange = (index: number) => {
    const selected = tabData[index];
    if (!selected) return;
    setActiveTabIndex(index);
    setParams((prev) => ({
      ...prev,
      type: selected.typeValue,
      page: 1,
      limit: defaultLimit, // reset pagination on tab switch
    }));
  };

  const handleLoadMore = () =>
    setParams((prev) => ({ ...prev, limit: prev.limit + defaultLimit }));

  return (
    <div>
      <TransactionTabs activeIndex={activeTabIndex} onChange={handleTabChange} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-1">
          {/* Header */}
          {/* <div className="w-full flex items-center justify-between px-4 py-2 text-gray-500 text-xs uppercase tracking-wider">
            <span>Transaction</span>
            <span>Amount</span>
          </div> */}

          {/* Rows */}
          {!data?.data?.length ? (
            <BlankRow />
          ) : (
            data.data.map((row, key) => (
              <ListCard
                key={row._id ?? key}
                type={params.type}
                index={key}
                data={row}
              />
            ))
          )}

          {/* Load More */}
          {data?.totalCount && data.totalCount > params.limit ? (
            <div className="flex items-center justify-center mt-6">
              <Button
                text=""
                className="loadmore relative"
                disableStyle onClick={handleLoadMore}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Load More</span>
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};