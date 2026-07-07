"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import BannerCarousel from "../ui/BannerCarousel";
import mainbanner from "../../../public/images/mainbanner.jpg";
import mainbanner2 from "../../../public/images/mainbanner2.jpg";

type Banner = {
  _id: string;
  image: string;
  type: string;
  position: "left" | "right";
  sortOrder: number;
  createdAt?: string;
};

interface FeaturesSectionProps {
  miniBanners: Banner[];
}

export default function FeaturesSection({ miniBanners }: FeaturesSectionProps) {
  const groupedBanners: Record<"left" | "right", string[]> = {
    left: [],
    right: [],
  };

  if (Array.isArray(miniBanners)) {
    miniBanners
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach((banner) => {
        if (banner.position === "left" || banner.position === "right") {
          groupedBanners[banner.position].push(banner.image);
        }
      });
  }

  const selectedBanners = groupedBanners.left.length
    ? groupedBanners.left
    : groupedBanners.right;

  const imageList: (string | StaticImageData)[] = [mainbanner, mainbanner2];

  const menuItems = [
    {
      src: "/images/menu8.svg",
      label: "CRM ERP",
      href: "http://layraerp.com/",
    },
    {
      src: "/images/menu9.svg",
      label: "Biz Automation",
      href: "https://wibiz.ai/",
    },
  
    {
      src: "/images/menu11.svg",
      label: "Refer & Earn",
      href: "/user/profile",
    },
    {
      src: "/images/menu12.svg",
      label: "Blog",
      href: "/blog",
    },
    {
      src: "images/menu13.svg",
      label: "Helpdesk",
      href: "/user/helpcenter",
    },
  ];

  return (
    <div className="px-4 sm:mt-7">
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden mb-4">
        <BannerCarousel notbanner disableRounded images={selectedBanners} />
      </div>

      {/* Round Icons Grid */}
      <div className="text-white grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 gap-x-4 sm:py-4 rounded-xl">
        {menuItems.map((item, idx) => {
          const isExternal = item.href.startsWith("http");

          const content = (
            <div className="flex flex-col items-center">
              <div className="relative bg-[#292930] rounded-full w-[55px] h-[55px] justify-center flex items-center mb-3">
                <Image
                  src={item.src}
                  alt={item.label}
                  width={30}
                  height={30}
                  className="rounded-md"
                />
              </div>
              <div className="md:text-sm text-[14px] font-normal leading-tight text-center max-w-[75%] mx-auto">
                {item.label.includes("<br />") ? (
                  <span dangerouslySetInnerHTML={{ __html: item.label }} />
                ) : (
                  item.label
                )}
              </div>
            </div>
          );

          // External links → open in new tab
          if (isExternal) {
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center mb-3"
              >
                {content}
              </a>
            );
          }

          // Internal links → open normally
          return (
            <Link key={idx} href={item.href} className="text-center mb-3">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
