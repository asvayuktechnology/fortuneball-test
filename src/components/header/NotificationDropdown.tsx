import React, { useState, useRef, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import { BsClock } from "react-icons/bs";
import { useFetchNotificationList } from "@/services/customerService";
import { notificationParams } from "@/types/customer";
import Loader from "../ui/common/Loader";
import { dateTimeFormat } from "@/utils";
import Button from "../ui/common/input/Button";
import Link from "next/link";
import Image from "next/image";
type Notification = {
  id: number;
  message: string;
  time: string;
  // isRead: boolean;
};
const defaultLimit = 3;
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

const NotificationDropdown: React.FC = () => {
  const [params, setParams] = useState<notificationParams>({
    page: 1,
    limit: defaultLimit,
  });
  const { data: notifications, isLoading, refetch } = useFetchNotificationList(params);




  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, params]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center relative"
      >
        <IoIosNotificationsOutline className="text-3xl text-slate-300 cursor-pointer" />
        

        <span className="absolute top-0 -right-0.5 bg-[#e45f5f] text-white text-[10px] px-1.5 py-[1px] rounded-full shadow-md">
          {notifications && notifications.unreadCount}
        </span>
      </button> */}
      <div className="relative flex justify-center flex-col items-center">

      <Image src="/images/notification-icon.svg" width={18} height={18} alt="" className="mb-[4px] cursor-pointer" />
      <p className="text-[6px] text-white">Notification</p>
      <span className="absolute -top-1 -right-1.5 bg-[#e45f5f] text-white text-[10px] px-1.5 py-[1px] rounded-full shadow-md">
          {notifications && notifications.unreadCount}
        </span>
      </div>
      {isOpen && (
        <div className="absolute -right-25 px-6 mt-4 w-96 bg-[#29292f] text-white rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between py-3 border-b border-white/30">
            <h1 className="text-sm font-medium text-white">Notifications</h1>
            {/* <button
                            onClick={() => setNotifications([])}
                            className="text-sm bg-[#17a5cb] text-white px-5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer"
                        > Clear
                        </button> */}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <Loader />
            ) : notifications && notifications.data.length > 0 ? (
              notifications.data.map((note, id) => (
                <NotificationCard
                  key={id}
                  message={note.text}
                  time={note?.datetime}
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
              <Link href={'/user/notification'}>
                Show More
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
