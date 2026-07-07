"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomeFooter() {
  const pathname = usePathname();
  const authStatus = useAuth();

  const menuItems = [
    {
      icon: "/images/home.svg",
      label: "Home",
      link: "/",
    },
    {
      icon: "/images/result.svg",
      label: "Results",
      link: "/user/draw-result",
    },
    {
      icon: "/images/centremenu.png",
      label: "Rewards",
      link: "/user/rewards",
      center: true,
    },
    {
      icon: "/images/ticketmenu.svg",
      label: "Tickets",
      link: "/user/my-tickets",
    },
    {
      icon: "/images/user.svg",
      label: "Profile",
      link: "/user/profile",
    },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[999] flex justify-center px-4">
      <div className="relative w-full max-w-[420px]">
        <div
          className="
            flex
            items-center
            justify-around
            rounded-full
            border
            border-[#2b1859]
            bg-[#120534]/95
            backdrop-blur-xl
            px-3
            py-0
            shadow-[0_0_30px_rgba(124,86,255,.25)]
          "
        >
          {menuItems.map((item) => {
            const active =
              pathname === item.link ||
              pathname.startsWith(item.link + "/");

            if (item.center) {
              return (
                <Link
                  key={item.label}
                  href={item.link}
                  className="relative -mt-10 pb-2"
                >
                  <div
                    className="
                      flex
                      h-auto
                      w-24
                      items-center
                      justify-center
                      rounded-full
                    "
                  >
                    <Image
                      src={item.icon}
                      width={100}
                      height={100}
                      alt={item.label}
                      className="w-full h-full"
                    />
                  </div>

                  <p className="mt-1 text-center text-[10px] text-white">
                    {item.label}
                  </p>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.link}
                className="flex flex-col items-center"
              >
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.label}
                  className={`transition ${
                    active
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                />

                <span
                  className={`mt-1 text-[10px] ${
                    active
                      ? "text-white"
                      : "text-white/50"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}