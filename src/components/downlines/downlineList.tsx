"use client";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import Loader from "../ui/common/Loader";
import { dateTimeFormat } from "@/utils";
import Button from "../ui/common/input/Button";
import DownlineTeamCard from "../cards/DownlineTeamCard";
import { useFetchCustomerDownlineList } from "@/services/customerService";
import { customerDownline } from "@/types/customer";
import {
  useFetchAuthprofile,
  useFetchCustomerList,
} from "@/services/authService";
import ProfileChart from "../profile/ProfileChart";

export default function DownlineList({ custId }: { custId: string }) {
  //   console.log("custId", custId);
  const [params, setParams] = useState<customerDownline>({
    name: "",
    email: "",
    level: "",
    customerId: custId,
    page: 1,
    limit: 10,
  });
  const debouncedQuery = useDebounce(params, 500);
  // const { data: userData, isLoading, refetch } = useFetchAuthprofile();

  // const { data: userData, isLoading, refetch } = useFetchAuthprofile();
  const {  data: teamDownList,  isLoading: isLoadingTeamList,  refetch: refetchDownTeamList,} = useFetchCustomerDownlineList(debouncedQuery);
  // const { data: community, isLoading: isLoadingCommunity,  refetch: refetchCommunity,} = useFetchCustomerList(debouncedQuery);

  // const handdePageChange = (page: number) => setParams(current => ({ ...current, page }))
  // console.log("teamDownList++++++++", teamDownList);
  const handdleSearch = (name: string) =>
    setParams((current) => ({ ...current, name }));
  const handleLabelChnage = (level: string) =>
    setParams((current) => ({ ...current, level }));
  const handleLoadMore = (limit: number) =>
    setParams((current) => ({ ...current, limit }));
  console.log("");

  // useEffect(() => {
  //   refetch();
  // }, []);

  useEffect(() => {
    refetchDownTeamList();
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto mt-6 p-5">
      <div className="row mb-4">
        <div className="col-12 mb-3">
          <h3 className="text-xl font-semibold text-slate-200">
            My Downline Team
          </h3>
          <small className="text-gray-300">
            The Talent Powering Our Success
          </small>
        </div>
      </div>

      <div className="bottom relative  text-white rounded-3xl   bg-[#2d1b69]   border   border-[#7c56ff]/20   p-5 mt-[125px] px-[10px] py-4.5 border-b-2  mx-auto  mb-0">
        <div className="grid grid-cols-2">
          <div className="text-center">
            <h4 className="text-2xl text-[#ffc428] mb-2">
              <strong>{teamDownList?.totalCount} </strong>
            </h4>
            <div className="sm:leading-4.5 leading-4 sm:text-[14px] text-[12px] font-medium text-white">
              Community
            </div>
            <div className="sm:leading-4.5 leading-4 sm:text-[14px] text-[12px] font-medium text-white">
              {" "}
              Users
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-2xl text-[#ffc428] mb-2">
              <strong>{teamDownList?.directusers ?? "0"}</strong>
            </h4>
            <div className="sm:leading-4.5 leading-4 sm:text-[14px] text-[12px] font-medium text-white">
              Direct
            </div>
            <div className="sm:leading-4.5 leading-4 sm:text-[14px] text-[12px] font-medium text-white">
              Users
            </div>
          </div>
          {/* <div className="text-center absolute -top-[1.6rem] left-1/2 -translate-1/2 w-[275px]    bg-[#372a61]   p-5 rounded-t-[8px] pt-2 pb-1">
            <div className="sm:leading-4.5 leading-4 sm:text-[14px] text-[12px] font-medium text-white">
              Total Community Staking
            </div>
            <h4 className="text-lg text-[#ffc428]">
              <strong>
                {teamDownList?.totalcommunitystaking?.toFixed(2) || 0} USDT
              </strong>
            </h4>
          </div> */}
        </div>
      </div>

      {/* Chart area (you will replace this div with HighchartsReact component) */}

      {/* {teamDownList &&
        Array.isArray(teamDownList.legs) &&
        teamDownList.legs.length > 0 && (
          <div className="rounded-full flex items-center justify-center text-sm w-full">
            <ProfileChart
              data={teamDownList.legs}
              powerLeg={{
                tokens: teamDownList.powerLeg?.tokens || 0,
                amount: teamDownList.powerLeg?.amount || 0,
              }}
              otherLegsInfo={{
                tokens: teamDownList.otherLegsInfo?.totalTokens || 0,
                amount: teamDownList.otherLegsInfo?.totalAmount || 0,
              }}
            />
          </div>
        )} */}

      {/* Filter Inputs */}
      <div className="row mb-4 flex  sm:items-center gap-4 mt-5">
        <div className="col-8 basis-2/3 ">
          <input
            type="text"
            name="name"
            className="form-control text-white bg-[#2d1b69] w-full border border-gray-600 rounded px-3 py-2.5 text-sm"
            placeholder="Search by name, email, phone number etc"
            onChange={(e) => handdleSearch(e?.target?.value)}
          />
        </div>
        <div className="col-4 basis-1/3">
          <select
            name="level"
            className="form-control text-white bg-[#2d1b69]  w-full border border-gray-600 rounded px-3 py-2.5 text-sm"
            onChange={(e) => handleLabelChnage(e?.target?.value)}
          >
            <option value="" disabled>
              Select Level (1-10)
            </option>
            <option value="">All</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="">
        <div className="">
          {isLoadingTeamList ? (
            <Loader />
          ) : teamDownList?.data && teamDownList.data.length > 0 ? (
            teamDownList.data.map((dt, key) => (
              <DownlineTeamCard
                key={key}
                count={key + 1}
                customerId={dt.customerId}
                name={`${dt?.firstName} ${dt?.lastName}`}
                level={dt?.level}
                email={dt?.emailAddress}
                phone={dt?.phoneNumber}
                sponsor={dt?.sponsor?.firstName}
                rank={dt?.rank}
                joinDate={dateTimeFormat(dt?.joinDate)}
              />
            ))
          ) : (
            <p className="text-center text-white py-4">No Team Found</p>
          )}
        </div>
      </div>
      {teamDownList?.totalCount && teamDownList?.totalCount > params?.limit ? (
        <div className="text-center relative">
          <Button
            text=""
            className="loadmorebtn loadmore relative "
            disableStyle
            onClick={() => handleLoadMore(params?.limit + 10)}
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Load More</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
