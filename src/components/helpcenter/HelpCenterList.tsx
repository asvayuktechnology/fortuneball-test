"use client"
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { HelpRequestListAPIParams, SupportTicket, useFetchHelpRequestList } from "@/services/helpCenterService";
import moment from 'moment';
import { GoEye } from 'react-icons/go';
import Loader from '../ui/common/Loader';
import { SuprtTicketModal } from "@/components/ui/common/Modal"
import TextInput from '../ui/common/input/TextInput';
import Button from '../ui/common/input/Button';
import { dateTimeFormat } from '@/utils';
import Link from 'next/link';
type Props = {
    refresh?: any
}
const HelpRequestListCard = ({ data, index }: { data: SupportTicket, index: number }) => {
    const [showDetails, setShowDetails] = useState(false);

    let statusColor = 'bg-red-500';
    if (data?.status === 'In Progress') statusColor = 'bg-orange-500';
    if (data?.status === 'Pending') statusColor = 'bg-yellow-500';
    if (data?.status === 'Closed' || data?.status === 'Resolved') statusColor = 'bg-green-500';

    return (
      <div
        className=" rounded-md overflow-hidden mb-4 cursor-pointer bg-[#292930] text-white"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex justify-between items-center px-4 py-3 transition-colors">
          <div className="text-xs font-medium w-8">{index + 1}</div>
          <div className="flex flex-col flex-1 text-xs truncate">
            <span className="truncate">{data?._id}</span>
            <span className="text-[10px] text-white-500">
              {dateTimeFormat(data?.createdAt)}
            </span>
          </div>
          <Link
            href={`/user/helpcenter/chat/${data._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            {data?.unreadSupportReplies && data?.unreadSupportReplies > 0 ? (
              <span className="w-6 h-6 rounded-sm flex items-center justify-center bg-green-400 truncate text-bold">
                {data?.unreadSupportReplies}
              </span>
            ) : null}
            <GoEye className="text-gray-400 text-[20px] hover:text-[rgb(255,196,40)] transition-colors" />
          </Link>
        </div>

        {showDetails && (
          <div className="bg-[#292930] text-white text-[11px] px-4 py-3 space-y-1">
            <div>
              <strong>Category</strong>: {data?.category}
            </div>
            <div>
              <strong>SubCategory</strong>: {data?.subcategory}
            </div>
            <div>
              <strong>Unread replies</strong>: {data?.unreadSupportReplies}
            </div>
          </div>
        )}
      </div>
    );
};




const HelpRequestListLoaderCard = () => {
    return (
        <tr>
            <td className='px-1 py-4'>
                <Loader />
            </td>
        </tr>
    )
}
const HelpRequestList = ({ refresh }: Props) => {
    const defaultLimit = 10;
    const [params, setParams] = useState<HelpRequestListAPIParams>({
        page: 1,
        limit: defaultLimit,
        status: ''
    });
    const debouncedQuery = useDebounce(params, 500);
    const { data, isLoading, refetch } = useFetchHelpRequestList(params);
    // const handlePageChange = (page: number) => setParams(current => ({ ...current, page }));
    // const handleStatusChange = (status: string) => setParams(current => ({ ...current, status }));
    const handleLoadMore = (limit: number) => setParams(current => ({ ...current, limit }));
    useEffect(() => {
        refetch()
    }, [debouncedQuery]);
    useEffect(() => {
        refetch()
    }, [refresh])
    return (
        <div className='flex flex-col gap-4'>
            <div className="tickettable max-w-full">
                <div className="w-full flex flex-col gap-2 mt-6 text-gray-300">
                    <div className="w-full flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-4">
                            <span className='text-xs truncate'>#</span>
                            <span className='text-xs truncate'>ID</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className='text-xs truncate'>Action</span>
                        </div>
                    </div>

                    <table className='w-full min-w-[320px] text-white'>
                        <tbody className='text-[12px]'>
                            {isLoading ? <HelpRequestListLoaderCard /> : data?.data?.map((ticket, key) => (<HelpRequestListCard key={ticket._id || key} data={ticket} index={key} />))}
                        </tbody>
                    </table>
                    {data?.totalCount && data?.totalCount > params?.limit ? (
                        <div className='w-full flex items-center justify-center mt-6'>
                            <Button text='Load more' onClick={() => handleLoadMore(params?.limit + defaultLimit)} />
                        </div>
                    ) : null}
                </div>
            </div>

        </div>
    )
};
export default HelpRequestList