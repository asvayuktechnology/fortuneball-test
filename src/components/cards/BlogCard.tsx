"use client";
import React, { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { FaDownload, FaRegHeart } from "react-icons/fa";
import { useFetchBlogList, BlogParams } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { BlogPostModal } from "../ui/common/Modal";
import Loader from "../ui/common/Loader";
import Link from "next/link";
import { dateFormat, dateTimeFormat } from "@/utils";
import Button from "../ui/common/input/Button";
import { AiFillLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa6";
import { extractYouTubeId, getYouTubeThumbnailUrl } from "@/utils";

const SingleBlockCard = (props: Blog) => {
  
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState(props?.image);

  const handleDownload = async () => {
    try {
      if (props?.video) {
        const response = await fetch(props.video, { mode: "cors" });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch {
      window.open(props?.video, "_blank");
    }
  };

  const handleShare = (e: React.MouseEvent, link?: string) => {
    
    e.preventDefault();
    const urlToShare =
      link || (typeof window !== "undefined" ? window.location.href : "");
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      urlToShare
    )}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Check this out",
          text: "Thought you might like this:",
          url: urlToShare,
        })
        .catch(() => window.open(whatsappUrl, "_blank"));
    } else {
      window.open(whatsappUrl, "_blank");
    }
  };


  const slugLink = `/${props?.type === "news" ? "news" : "blog"}/${
    props?.slug
  }`;

  return (
    <div className="rounded-md h-full overflow-hidden flex flex-col border-b-8 border-[#202124] px-3">
      <Link href={slugLink} className="block">
        <h5 className="text-md font-semibold text-slate-200 mb-2 min-h-[48px] line-clamp-2 hover:text-amber-300 transition">
          {props?.name}
        </h5>

        {props?.video ? (
          <video
            className="w-full h-[175px] object-cover rounded-md"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={props.video} type="video/mp4" />
            <source src={props.video} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={props?.image}
            // onError={(e) => {
            //   e.currentTarget.src = "/images/broken_image.png";
            // }}
            alt={props?.name}
            className="text-white bg-black h-[175px] object-cover object-top w-full rounded-md"
          />
        )}
      </Link>

      {props?.description && (
        <p className="text-slate-200 text-sm mt-3 text-wrap whitespace-pre-wrap break-words">
          {props.description.split(" ").slice(0, 20).join(" ")}
          {props.description.split(" ").length > 20 && (
            <>
              ...{" "}
              <Link
                href={slugLink}
                className="cursor-pointer text-amber-300 hover:text-amber-200"
              >
                Read more
              </Link>
            </>
          )}
        </p>
      )}

      <div className="py-3 px-1 flex items-start justify-between flex-1">
        <div
          onClick={() => setOpenModal(true)}
          className="text-[13px] text-slate-300 cursor-pointer"
        >
          {dateFormat(props?.date)}
        </div>

        <div className="flex justify-start space-x-3 text-slate-300 text-sm mb-2">
          <span className="flex items-center">
            <AiFillLike className="cursor-pointer mr-2" /> Like
          </span>
          <Link
            href="#"
            onClick={(e) => handleShare(e, slugLink)}
            aria-label="Share on WhatsApp"
            className="flex items-center"
          >
            <FaShare className="cursor-pointer mr-2" />
            Share
          </Link>
        </div>
      </div>

      {props?.video && (
        <span
          onClick={handleDownload}
          className="inline-flex items-center text-amber-300 hover:text-amber-200 text-sm font-medium cursor-pointer"
        >
          <FaDownload className="mr-1.5" /> Download video
        </span>
      )}

      <BlogPostModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        message={props?.description}
      />
    </div>
  );
};

// SingleBlockCard;

const BlogCard = ({ type }: { type?: string }) => {
  const defaultLimit = 10;
  const [params, setParams] = useState<BlogParams>({
    type: type ?? "blog",
    page: 1,
    limit: defaultLimit,
  });
  type = type ?? "blog";
  const { data, isLoading, refetch } = useFetchBlogList(params);
  const handdeLoadMore = (limit: number) =>
    setParams((curr) => ({ ...curr, limit }));
  useEffect(() => {
    refetch();
  }, [params]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="">
          <h1 className="text-[1.25rem] capitalize text-white pt-6 px-3">
            {type}
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 py-5 ">
            {/* {isLoading ? (
              <Loader />
            ) : ( */}
             { data?.data?.map((blog, key) => (
                <SingleBlockCard {...blog} key={key} />
              ))}
            {/* )} */}
          </div>
          <div className="text-center">
            {data?.totalCount && data?.totalCount > params?.limit ? (
              <Button
                text=""
                disableStyle
                className="loadmorebtn loadmore relative"
                onClick={() => handdeLoadMore(params.limit + defaultLimit)}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Load More</span>
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default BlogCard;
