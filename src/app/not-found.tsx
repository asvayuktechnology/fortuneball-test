"use client";
import Link from "next/link";
import HomeLayout from "@/components/layouts/HomeLayout";

export default function NotFound() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#a855f7] to-[#3b0764] leading-none">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white mt-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mt-3 max-w-md text-sm md:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Back Home
        </Link>
      </div>
    </HomeLayout>
  );
}
