import Image from "next/image";
import aiavatar from "../../../public/images/user_placeholdeer.png";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import { NEXT_APP_BASE_URL, UPLOAD_PATH_URL } from "@/libs/api/const";
import moment from "moment";
import { copyToClipboard, maskWallet } from "@/utils";
import Avatar from "../ui/common/Avtar";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineHandshake, MdDownload } from "react-icons/md";
import Link from "next/link";
import { FaLink, FaRegCopy, FaWallet } from "react-icons/fa6";
import { url } from "inspector";
import ProfileChart from "./ProfileChart";
import { getRankDetails } from "@/utils";
import ProfileCard, { ProfileDownloadCardHandle } from "../ProfileCard";
import { useRef, useState } from "react";
import Executive from '../../public/rank/EXECUTIVE.png'
import { LuShare2 } from "react-icons/lu";
import { IoPersonAdd } from "react-icons/io5";
import { HiUser, HiUsers } from "react-icons/hi";
type Leg = {
  _id: string;
  firstname: string;
  lastname: string;
  legId: string;
  amount: number;
  tokens: number;
};

type OtherLegsInfo = {
  legs: Leg;
  totalAmount: number;
  totalTokens: number;
};

type UserWallet = {
  mainbalance: number;
  mainbalanceamount: number;
  todayStakingReward: number;
  lastmonthstaking: number;
  stakingwallet: number;
  todayAffiliateReward: number;
  lastmonthaffiliate: number;
  affiliatewallet: number;
  communityusers: number;
  totalholding: number;
  alltimestaking: number;
  alltimeaffiliate: number;
};

type UserData = {
  data: {
    customerId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    customerCode?: string;
    walletAddress?: string;
    dateOfBirth?: string;
    sponsorfirstname?: string;
    sponsorlastname?: string;
    leveleligibility?: number;
    directusers?: number;
    rank?: string;
    profileimage?: string;
    totalcommunitystaking?: number;
    powerLeg: Leg;
    otherLegsInfo: OtherLegsInfo;
    legs: Leg[];
    rankimage: string;
    directusergrow?:number;
   communitygrow?:number;
 
  };
  userWallet: UserWallet;
  totalDownline?: number;
};
export const UserInfo = (props: UserData) => {
  const { data, totalDownline, userWallet } = props;
  const downloadCardRef = useRef<ProfileDownloadCardHandle>(null);

  const rankDetails = data?.rank ? getRankDetails(data.rank) : null;

  const handleDownload = async () => {
    //console.log("funtion")
    // Wait for the next tick to ensure component is mounted
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      if (downloadCardRef.current) {
        await downloadCardRef.current.downloadImage();
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
    }
  };
  const referralUrl = `${NEXT_APP_BASE_URL}/register/${data?.customerCode}`;

const handleWhatsAppShare = () => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(referralUrl)}`;
  window.location.href = whatsappUrl;
  // or window.open(whatsappUrl, "_blank");
};
// console.log("datacheck",data);
  return (
    <div className="container mx-auto ">

      <div className="row" style={{ padding: "15px 24px" }}>
        <div className="relative">
          <h1 className="mb-5 text-center text-[21px] font-bold text-white">
            Profile
          </h1>
          <Image src={"/images/settingsicon.svg"} width={30} height={30} alt="" className="cursor-pointer absolute right-0 -top-2.5" />
        </div>
        <div className="col-12 w-full">
          <div className=" max-w-md mx-auto relative  text-slate-200   overflow-x-hidden">
            <div
              className="
    rounded-2xl
    bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee]
    p-[15px]
  "
            >
              {/* TOP */}
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-[85px] w-[85px] overflow-hidden rounded-full bg-white">
                    <Avatar
                      image={`${UPLOAD_PATH_URL}${data?.profileimage}`}
                      size={85}
                    />
                  </div>

                  <Link
                    href="/user/editprofile"
                    className="
          absolute
          bottom-1
          right-1
          flex  w-8 h-8 items-center justify-center
          rounded-full
          bg-[linear-gradient(180deg,#9f32ff_0%,#5e00db_100%)]
          shadow-[0_0_15px_rgba(159,50,255,0.6)]
        "
                  >
                    <FiEdit2 className="text-white text-sm" />
                  </Link>
                </div>

                {/* User Info */}
                <div className="flex-1 pt-2">
                  <h2 className="text-[15px] font-semibold text-white leading-none">
                    {data?.firstName} {data?.lastName}
                  </h2>

                  <div className="mt-3 flex items-center gap-0.5 text-white/60">
                    <Image src="/images/useremailicon.svg" width={20} height={20} alt="" />

                    <span className="text-[9px] text-[#998da4] truncate">
                      {data?.emailAddress}
                    </span>
                  </div>
                  {/* Divider */}
                  <div className="my-5 h-px bg-[#5a2ab1]/40" />
                </div>
              </div>



              {/* Wallet Address */}
              <div className="flex items-center justify-between py-3 border-b border-[#5a2ab1]/40">
                <div className="flex items-center gap-4">

                  <Image src="/images/profilewalleticon.svg" width={30} height={30} alt="" />


                  <div className="text-[9px]">
                    <p className="text-[#e3e3e3]  font-medium">
                      Wallet Address
                    </p>

                    <p className="text-[#e3e3e3] ">
                      {maskWallet(data?.walletAddress ?? "")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(data?.walletAddress ?? "")
                  }
                  className="flex items-center gap-1 text-[#b66cff] text-[9px] cursor-pointer"
                >
                  <FaRegCopy size={10} />
                  Copy
                </button>
              </div>

              {/* Referral */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">

                  <Image src="/images/profilelinkicon.svg" width={30} height={30} alt="" />


                  <div className="text-[9px]">
                    <p className="text-white font-medium">
                      Referral Link
                    </p>

                    <p className="text-[#ffd41f] font-medium truncate max-w-[160px]">
                      {NEXT_APP_BASE_URL}/register/{data?.customerCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${NEXT_APP_BASE_URL}/register/${data?.customerCode}`
                      )
                    }
                    className="flex items-center gap-1 text-[#b66cff] text-[9px] cursor-pointer"
                  >
                    <FaRegCopy size={10} />
                    Copy
                  </button>

                  <button
                    // onClick={() => {
                    //   navigator.share?.({
                    //     title: "Referral Link",
                    //     url: `${NEXT_APP_BASE_URL}/register/${data?.customerCode}`,
                    //   });
                    // }}
                    onClick={handleWhatsAppShare}
                    className="flex items-center gap-1 text-[#cc8f22] text-[9px] cursor-pointer"
                  >
                    <FaShareAlt size={10} />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-[8px]">
              {/* TOTAL COMMUNITY */}
              <div
                className="rounded-2xl bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee] p-[15px]">
                <div className="flex items-start gap-3">

                  <Image src="/images/communityicon.svg" width={40} height={40} alt="" />

                  <div>
                    <p className="text-white text-[10px] leading-3">
                      Total Community
                      <br />
                      Users
                    </p>

                    <h3 className="text-[#ffc928] text-[20px] font-bold mt-1">
                      {totalDownline?.toLocaleString()}
                    </h3>

                    <p className="text-[#00ff27] text-[9px] font-semibold">
                    
                        {data?.communitygrow || 0}
                      <span className="text-[#b7b7b7] ml-1 font-normal">
                        This Week ↑
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* DIRECT USERS */}
              <div
                className="
      rounded-[12px]
    bg-[linear-gradient(175deg,rgba(107,27,121,.45)_0%,rgba(35,15,91,.53)_38%,rgba(12,2,57,.62)_58%,rgba(20,6,66,1)_81%,rgba(27,9,73,1)_100%)] border border-[#9a4cee]
      p-4
      shadow-[0_0_25px_rgba(138,69,255,0.15)]
    "
              >
                <div className="flex items-start gap-3">

                  <Image src="/images/directusericon.svg" width={40} height={40} alt="" />

                  <div>
                    <p className="text-white text-[10px] leading-3">
                      Direct
                      <br />
                      Users
                    </p>

                    <h3 className="text-[#ffc928] text-[20px] font-bold mt-1">
                      {data?.directusers || 0}
                    </h3>

                    <p className="text-[#00ff27] text-[9px] font-semibold">
                     {data?.directusergrow || 0}
                      <span className="text-[#b7b7b7] ml-1 font-normal">
                        This Week ↑
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* INVITE FRIENDS */}
             <button
  onClick={handleWhatsAppShare}
                className="
      rounded-[12px]
    bg-[linear-gradient(175deg,#3b036d_0%,#0f0234_100%)] border border-[#9a4cee]
      p-[9px]
      flex items-center justify-between cursor-pointer
    "
              >
                <div className="flex items-center gap-3">
                  <Image src="/images/inviteicon.svg" width={40} height={40} alt="" />

                  <div>
                    <h4 className="text-white font-semibold text-[10px]">
                      Invite Friends
                    </h4>

                    <p className="text-[#c1c1c1] text-[7px]">
                      Grow your community
                    </p>
                  </div>
                </div>

                <span className="text-[#c1c1c1] text-md">›</span>
              </button>

              {/* SHARE REFERRAL */}
                    <button
  onClick={handleWhatsAppShare}
                className="
      rounded-[12px]
      border border-[#d9bb1b]
      bg-[linear-gradient(19deg,#19003a_80%,#88422f)]
      p-[9px]
      flex items-center justify-between cursor-pointer
    "
              >
                <div className="flex items-center gap-3">
                  <Image src="/images/shareicon.svg" width={40} height={40} alt="" />

                  <div className="text-left">
                    <h4 className="text-white font-semibold text-[10px]">
                      Share Referral
                    </h4>

                    <p className="text-white/60 text-[7px]">
                      Share your link
                    </p>
                  </div>
                </div>

                <span className="text-[#c1c1c1] text-md">›</span>
              </button>
            </div>

            {/* <div className=" text-white py-8 px-4 flex flex-col items-center"> */}
            {/* Chart area (you will replace this div with HighchartsReact component) */}
            {/* {data?.legs?.length > 0 && (
                <div className="rounded-full flex items-center justify-center text-sm w-full">
                  <ProfileChart
                    data={data.legs}
                    powerLeg={{
                      tokens: data.powerLeg?.tokens || "0",
                      amount: data.powerLeg?.amount || "0",
                    }}
                    otherLegsInfo={{
                      tokens: data.otherLegsInfo?.totalTokens || "0",
                      amount: data.otherLegsInfo?.totalAmount || "0",
                    }}
                  />
                </div>
              )} */}



            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
