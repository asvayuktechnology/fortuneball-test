import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { FaPowerOff, FaRegUser } from "react-icons/fa6";
import { AiOutlineUser } from "react-icons/ai";
import ProfileDropdown from "./ProfileDropdown";
import Cookies from "js-cookie";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "@/hooks/useAuth";
import logo from "../../../public/images/btclogo.png";
import { LogoutModal } from "../ui/common/Modal";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";
import { useFetchAuthprofile } from "@/services/authService";
import Button from "../ui/common/input/Button";
import { TiThMenu } from "react-icons/ti";
import { LuMenu } from "react-icons/lu";

export default function HomeHeader() {
  const authStatus = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutmodal] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken");
    authStatus.setIsLoggedIn(false);
    window.location.href = "/";
  };

  const { data, refetch } = useFetchAuthprofile();

  useEffect(() => {
    if (authStatus.isLoggedIn) {
      refetch();
    }
  }, [authStatus.isLoggedIn, refetch]);

  return (
    <div className="header w-full px-4 py-3.5  shadow-sm  bg-[linear-gradient(175deg,#1f105f_0%,#140642_81%,#1b0949_100%)] max-w-[calc(100%-9px)] mx-auto my-[9px] mx-auto border rounded-[12px] border-[#9a4cee] relative z-50">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src={"/images/logo.png"} width={30} height={30} alt="logo" priority />
          {/* <LuMenu  size={30} /> */}
        </Link>

        <div className="flex items-center justify-center gap-5">
          {/* {showSearch && (
            <input placeholder='Search' className='w-[120px] md:w-[200px] lg:w-56 xl:lg:w-56  h-10 rounded-full border-2 border-blue-500 px-4 focus:outline-none placeholder:text-black text-sm' />
          )} */}
          {/* {authStatus.isLoggedIn && (<span className='cursor-pointer' onClick={() => setShowSearch(!showSearch)}><IoIosSearch size={30} /></span>)} */}
          {authStatus.isLoggedIn && pathname !== "/user/notification" && (
            <NotificationDropdown />
          )}
          {authStatus?.isLoggedIn ? (
            <ProfileDropdown
              profileImage={data?.data.profileimage}
              handleLogout={handleLogout}
            />
          ) : (
            <>
              {/* <Link href="#">
                <span className="text-gray-600 text-xl">
                  <Image src={"/images/bell.svg"} width={20} height={20} alt='bellicon' />
                </span>
              </Link> */}
              <Link href="/login" className="inline-block">
                <Button text="Log In" disableStyle className="bg-white text-sm pt-1.5 pb-1.5 transition hover:scale-[1.02] " />
                {/* <span className="text-white/70 text-xl">
                  <FaRegUser className="text-[20px]" />
                  </span> */}
              </Link>
              <Link href="/register" className="inline-block text-sm">
                <Button text="Sign Up" disableStyle className="pt-1.5 pb-1.5 w-full
rounded-full text-sm
font-semibold
text-black
shadow-lg
transition
hover:scale-[1.02]
bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]" />
              </Link>
              {/* <Link href="#">
                <span className="text-gray-600 text-xl">
                  <Image src={"/images/hamburgermenu.svg"} width={20} height={20} alt='bellicon' />
                </span>
              </Link> */}
            </>
          )}
          {authStatus.isLoggedIn && (
            <span
              className="cursor-pointer flex flex-col justify-center items-center"
              onClick={() => setShowLogoutmodal(!showLogoutModal)}
            >
              {/* <FaPowerOff size={20} color="#e45f5f" /> */}
              <Image src="/images/headerlogouticon.svg" width={22} height={22} alt="" className="mb-[4px]"  />
              <p className="text-[6px] text-white">Sign Out</p>
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutmodal(!showLogoutModal)}
        handleLogout={handleLogout}
      />
    </div>
  );
}
