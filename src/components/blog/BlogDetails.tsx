"use client";

import React from "react";
import { useFetchBlogDetails } from "@/services/blogService";
import { AiFillLike } from "react-icons/ai";
import Link from "next/link";
import { FaShare } from "react-icons/fa6";
import { dateFormat } from "@/utils";

export default function BlogDetails({ slug }: { slug: string }) {
  const { data, isLoading, error } = useFetchBlogDetails(slug);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading blog details.</p>;
  if (!data) return <p className="text-white">No blog found.</p>;

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Image */}
      {data.image && (
        <div className="mb-6">
          <img
            src={data.image}
            alt={data.name}
            className="w-full max-h-[400px] object-cover rounded-lg"
          />
        </div>
      )}

      {/* Date + Actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/70">
          Published on {dateFormat(data.date)}
        </p>
        <div className="flex justify-start space-x-3 text-slate-300 text-sm">
          <span className="flex items-center">
            <AiFillLike className="cursor-pointer mr-2" />
            Like
          </span>
          <Link
            href="#"
            onClick={(e) => handleShare(e, data?.link && data?.link)}
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center"
          >
            <FaShare className="cursor-pointer mr-2" />
            Share
          </Link>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 leading-snug">{data.name}</h1>

      {/* Full description with backend formatting */}
      {data.description && (
        <div
          className="
            text-slate-200 
            text-base 
            whitespace-pre-line 
            break-words 
            leading-relaxed 
            tracking-wide
          "
        >
          {data.description}
        </div>
      )}
    </div>
  );
}
