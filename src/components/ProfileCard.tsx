"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import moment from "moment";
import { maskEmail, RankDetails } from "@/utils";
import { UPLOAD_PATH_URL } from "@/libs/api/const";
import Logo from "../../public/images/btclogo.png";
import mthtimg from "../../public/images/btclogo.png";
import Image from "next/image";
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

export type ProfileDownloadCardHandle = {
  downloadImage: () => void;
};

type Props = {
  userWallet: UserWallet;
  email: string;
  userName: string | undefined;
  rankDetails: RankDetails | null;
  profileImage: string;
};

const ProfileCard = forwardRef<ProfileDownloadCardHandle, Props>(
  ({ userWallet, email, userName, rankDetails, profileImage }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    // Wait for all images to load
    const waitForImages = async (node: HTMLElement): Promise<void> => {
      const images = Array.from(node.querySelectorAll("img")) as HTMLImageElement[];

      const imagePromises = images.map((img) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            const handleLoad = () => {
              img.removeEventListener('load', handleLoad);
              img.removeEventListener('error', handleError);
              resolve();
            };

            const handleError = () => {
              img.removeEventListener('load', handleLoad);
              img.removeEventListener('error', handleError);
              console.warn('Image failed to load:', img.src);
              resolve();
            };

            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);
          }
        });
      });

      await Promise.all(imagePromises);

      // Additional delay for Safari
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    const downloadImage = async () => {
      if (!cardRef.current) return;

      const node = cardRef.current;

      try {
        // Wait for all images to load
        await waitForImages(node);

        // Convert to PNG with Safari-specific options
        const dataUrl = await htmlToImage.toPng(node, {
          cacheBust: true,
          pixelRatio: window.devicePixelRatio || 1,
          // useCORS: true,
          // allowTaint: true,
          backgroundColor: '#ffffff',
          // Add delay for Safari
          skipFonts: false,
          preferredFontFormat: 'woff2',
        });

        download(dataUrl, "profile-card.png");
      } catch (error) {
        console.error('Failed to generate image:', error);

        // Fallback: try with different options
        try {
          const fallbackDataUrl = await htmlToImage.toJpeg(node, {
            cacheBust: true,
            pixelRatio: 1,
            quality: 0.9,
            backgroundColor: '#ffffff',
          });

          download(fallbackDataUrl, "profile-card.jpg");
        } catch (fallbackError) {
          console.error('Fallback image generation also failed:', fallbackError);
          alert('Failed to generate image. Please try again.');
        }
      }
    };

    // Expose downloadImage method to parent
    useImperativeHandle(ref, () => ({
      downloadImage,
    }));

    return (
      <div
        ref={cardRef}
        className="py-6 px-4 flex justify-center items-center"
      >
        <div className="max-w-[420px] w-full bg-[#29292f] rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="text-white px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">
              <img
                alt="OSC Logo"
                height={25}
                width={80}
                src={Logo.src}
                crossOrigin="anonymous"
                loading="eager"
                decoding="sync"
              />
              {/* <img
                    src={mthtimg.src}
                    alt="USDT"
                    width={40}
                    height={40}
                    crossOrigin="anonymous"
                    loading="eager"
                    decoding="sync"
                  /> */}
            </div>
            <div className="flex gap-2 items-center relative">
              {/* <img
                    src={mthtimg.src}
                    alt="USDT"
                    width={75}
                    height={25}
                    crossOrigin="anonymous"
                    loading="eager"
                    decoding="sync"
                  /> */}
              <b>USDT</b>
              <div className="text-xs font-semibold absolute -right-4.5 top-12.5 bg-[#29292f] px-1.5 py-1.5 rounded text-center">
                <div className="text-3xl font-bold leading-7">
                  {moment().format("DD")}
                </div>
                <div className="text-sm font-bold leading-4">
                  {moment().format("MMMM").toUpperCase()}
                </div>
                <div className="text-sm font-bold leading-3.5">
                  {moment().format("YYYY")}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#e9f2f5] rounded-[10px]">
            {/* User Info */}
            <div className="flex gap-4 items-center pt-16 pb-8 border-b-slate-300 border-b mx-8">
              <div className="rounded-full bg-gray-300">
                <img
                  src={
                    profileImage
                      ? `${UPLOAD_PATH_URL}/profiles/${profileImage}`
                      : "/images/userimg.png"
                  }
                  alt="Profile"
                  width={110}
                  className="rounded-full object-cover"
                  crossOrigin="anonymous"
                  loading="eager"
                  decoding="sync"
                />
              </div>
              <div>
                <div className="mt-2 text-lg font-extrabold text-[#29292f]">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 blur-xs">
                  {maskEmail(email)}
                </div>

                {rankDetails && (
                  rankDetails?.image ? (
                     <div className="rank w-[260px] flex items-center justify-end gap-x-1 mx-auto bg-[#ffc428] px-4 py-3 my-9 rounded-full relative pl-20">

                      {/* Badge Image */}
                      <div className="badgeicon absolute -left-0 top-[80%] -translate-y-1/2 w-[125px] h-[125px]"  >
                        <Image
                          src={`${UPLOAD_PATH_URL}/${rankDetails.image}`}
                          alt={rankDetails?.name || 'rank'}
                         height={100}
                          width={100}
                          className="object-contain"
                          crossOrigin="anonymous"
                          loading="eager"
                          decoding="sync"
                        />
                      </div>

                      {/* Rank Text */}
                        <div className="ranktext text-first text-black font-bold px-2 z-6">
                        {rankDetails?.name}
                      </div>
                    </div>
                  ) : (
                    // ❌ No image → only text
                    <div className="text-center text-sm font-bold text-[#5685bc] my-4">
                      {rankDetails?.name}
                    </div>
                  )
                )}



              </div>
            </div>

            {/* Total Assets */}
            <div className="text-center py-4 px-6">
              <div className="text-slate-950 text-md font-semibold">
                Total Assets (USDT)
              </div>
              <div className="text-3xl font-extrabold text-[#ffc428]">
                {(userWallet.mainbalance ?? 0).toFixed(2)}{" "}
                <span className="text-[20px] font-bold">USDT</span>
              </div>
              {/* <div className="text-md font-extrabold text-slate-500">
                    ${(userWallet.mainbalanceamount ?? 0).toFixed(2)}
                  </div> */}
            </div>

            {/* Staking + Affiliate */}
            <div className="px-6 grid grid-cols-1 gap-4">
              <div
                className="rounded-xl relative overflow-hidden bg-[#29292f] p-4 pb-0 text-white"
                style={{
                  backgroundSize: "115%",
                  backgroundPosition: "8rem -8rem",
                }}>
                <img
                  crossOrigin="anonymous"
                  src={"/layerexsm.png"}
                  alt=""
                  className="absolute -right-[70px] -top-[95px] max-w-[425px] opacity-10"
                  loading="eager"
                  decoding="sync"
                />
                <div className="flex justify-between items-start">
                  <div className="text-lg font-semibold">
                    <div className="text-[10px] text-slate-300">Today</div>
                    <div className="text-2xl mb-4">
                      {(userWallet.todayStakingReward ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                  <div className="bg-[#ffc428] rounded-full px-3 py-1 text-xs text-black">
                    Staking
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className="text-xs mt-2 text-center w-1/2 first:border-r first:border-slate-500 pb-3">
                    <div className="text-sm text-slate-300 font-semibold">
                      Last 30 Days
                    </div>
                    <div className="text-lg text-[#c6d0e3] font-semibold ">
                      {(userWallet.lastmonthstaking ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-center w-1/2 pb-3">
                    <div className="text-sm text-slate-300 font-semibold">
                      All Time
                    </div>
                    <div className="text-lg text-[#c6d0e3] font-semibold">
                      {(userWallet.alltimestaking ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-xl p-4 pb-0 text-white relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, #29292f, #29292f), url('/layerexsm.png')`,
                  backgroundSize: "100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img
                  crossOrigin="anonymous"
                  src={"/layerexsm.png"}
                  alt=""
                  className="absolute -right-[70px] -top-[95px] max-w-[425px] opacity-10"
                  loading="eager"
                  decoding="sync"
                />
                <div className="flex justify-between items-start">
                  <div className="text-lg font-semibold">
                    <div className="text-[10px] text-slate-300">Today</div>
                    <div className="text-2xl mb-4">
                      {(userWallet.todayAffiliateReward ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                  <div className="bg-[#ffc428] rounded-full px-3 py-1 text-xs text-black">
                    Affiliate
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className="text-xs mt-2 text-center w-1/2 first:border-r first:border-slate-500 pb-3">
                    <div className="text-sm text-slate-300 font-semibold">
                      Last 30 Days
                    </div>
                    <div className="text-lg text-[#c6d0e3] font-semibold ">
                      {(userWallet.lastmonthaffiliate ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-center w-1/2 pb-3">
                    <div className="text-sm text-slate-300 font-semibold">
                      All Time
                    </div>
                    <div className="text-lg text-[#c6d0e3] font-semibold">
                      {(userWallet.alltimeaffiliate ?? 0).toFixed(2)}{" "}
                      <span className="text-xs"> USDT </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-4 grid grid-cols-5 gap-4">
              <div className="text-center bg-[#39393f] col-span-2 rounded-2xl py-5">
                <div className="text-xs font-bold text-slate-300">
                  Total Community
                </div>
                <div className="text-2xl font-semibold text-white">
                  {userWallet.communityusers}
                </div>
              </div>
              <div className="text-center bg-[#39393f] col-span-3 rounded-2xl py-5">
                <div className="text-xs font-bold text-slate-300">
                  Total Holdings
                </div>
                <div className="text-2xl font-semibold text-white">
                  {userWallet.totalholding}{" "}
                  <span className="text-xs">USDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
export default ProfileCard;