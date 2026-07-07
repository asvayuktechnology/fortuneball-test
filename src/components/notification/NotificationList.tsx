import { useFetchNotificationList } from '@/services/customerService';
import { notificationParams } from '@/types/customer';
import React, { useEffect, useRef, useState } from 'react'
import Button from '../ui/common/input/Button';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Loader from '../ui/common/Loader';
import { BsClock } from 'react-icons/bs';
import { dateTimeFormat } from '@/utils';
const defaultLimit = 10

const NotificationCard = ({
  message,
  time,
  isRead = false,
}: {
  message: string;
  time: string;
  isRead: false;
}) => {
  return (
    <div
      className={`flex items-start w-full p-3 last:pb-4.5 last:border-0 border-b-white/20 border-b  transition-all duration-200 cursor-pointer group
                    ${isRead ? " hover:bg-gray-50" : " hover:bg-[#ffc428] "}
                `}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#424247] text-white/50 rounded-full">
        <IoIosNotificationsOutline size={28} />
      </div>
      <div className="ms-3 flex-1">
        <div className="text-sm text-white line-clamp-2 group-hover:text-slate-800">{message}</div>
        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 group-hover:text-slate-900">
          <BsClock size={12} /> {dateTimeFormat(time)}
        </div>
      </div>
    </div>
  );
};


export default function NotificationList() {

  const [params, setParams] = useState<notificationParams>({
    page: 1,
    limit: defaultLimit,
  });
  const { data: notifications, isLoading, refetch } = useFetchNotificationList(params);


  const handleLoadMore = (limit: number) =>
    setParams((curr) => ({ ...curr, limit }));

  useEffect(() => {

    refetch();
  }, [params]);

  const dropdownRef = useRef<HTMLDivElement>(null);



  return (
    <div className="relative inline-block text-left w-full px-3 pt-6" ref={dropdownRef}>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center relative"
      > */}
      {/* <IoIosNotificationsOutline className="text-3xl text-gray-700 cursor-pointer" /> */}

      {/* {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-0 -right-0.5 bg-red-600 text-white text-[10px] px-1.5 py-[1px] rounded-full shadow-md">
                        {notifications.filter(n => !n.isRead).length}
                    </span>
                 )} */}
      {/* </button> */}

      <div className="w-full px-6 mt-4  text-white rounded-xl  z-50 overflow-hidden">
        <div className="flex items-center justify-between py-3 border-b border-white/30">
          <h1 className="text-sm font-medium text-white">Notifications</h1>
          {/* <button
                            onClick={() => setNotifications([])}
                            className="text-sm bg-[#17a5cb] text-white px-5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
                        > Clear
                        </button> */}
        </div>
        <div className=" overflow-y-auto divide-y divide-gray-100">
          {isLoading ? (
            <Loader />
          ) : notifications && notifications.data.length > 0 ? (
            notifications.data.map((note, id) => (
              <NotificationCard
                key={id}
                message={note.text}
                time={note.datetime}
                isRead={false}
              />
            ))
          ) : (
            <div className="p-4 text-center text-sm text-white">
              No new notifications.
            </div>
          )}
        </div>

        {notifications && notifications.totalCount > params.limit && (
          <div className="text-center p-3">

            <Button
              text=""
              disableStyle
              className="loadmorebtn loadmore relative"
              onClick={() => handleLoadMore(params.limit + defaultLimit)}
            >
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Load More</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
