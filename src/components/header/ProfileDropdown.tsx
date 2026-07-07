import React, { useState, useRef, useEffect } from "react";
import { AiOutlineUser } from 'react-icons/ai';
import Link from "next/link";
import Avatar from "../ui/common/Avtar";
import { AppMenus } from "@/config/constants";
import { UPLOAD_PATH_URL } from "@/libs/api/const";
import Image from "next/image";
type Props = {
  userImage?: string;
  profileImage?: string;
  data?: string;

  handleLogout?: () => void;
};
const ProfileDropdown: React.FC<Props> = (props: Props) => {
  const { userImage, profileImage } = props;
  //console.log("profileImage", profileImage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    <div className="relative inline-block text-center" ref={dropdownRef}>
      {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full border-2 border-[#ffc428] focus:outline-none focus:ring-2 focus:ring-[#d8a721] flex items-center justify-center cursor-pointer"
        >
          <Avatar
            image={
              profileImage
                ? `${UPLOAD_PATH_URL}/profiles/${profileImage}`
                : userImage 
            }
            size={30}
          />
        </button> */}
      <Image className="mb-[4px] cursor-pointer" src="/images/headerprofileicon.svg" width={22} height={22} alt="" onClick={() => setIsOpen(!isOpen)} />
      <p className="text-[6px] text-white">Profile</p>
      {isOpen && (
        <div
          className="
    absolute right-0 mt-3 w-56 overflow-hidden
    rounded-2xl
    border border-[#8a45ff]
    bg-[linear-gradient(180deg,#2b0b6b_0%,#14003d_100%)]
    shadow-[0_0_30px_rgba(138,69,255,0.25)]
    backdrop-blur-md
    z-[999]
  "
        >
          {/* Glow */}
          <div
            className="
      absolute
      -top-10
      left-1/2
      -translate-x-1/2
      h-24
      w-24
      rounded-full
      bg-[#d90cc0]
      opacity-20
      blur-[50px]
      pointer-events-none
    "
          />

          {/* Header */}
          <div className="relative border-b border-[#7c56ff]/20 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a39e8]">
              Menu
            </p>
          </div>

          {/* Items */}
          <div className="relative py-2">
            {AppMenus?.all?.map((item, key) => (
              <Link
                key={key}
                href={item?.href}
                className="
          mx-2 flex items-center
          rounded-xl
          px-4 py-3
          text-sm font-medium
          text-white/80
          transition-all duration-200
          hover:bg-[linear-gradient(90deg,#6f22ff_0%,#a22cff_100%)]
          hover:text-white
          hover:shadow-[0_0_15px_rgba(162,44,255,0.35)]
        "
              >
                {item?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
