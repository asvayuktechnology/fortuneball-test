"use client";
import React, { ReactNode } from "react";
import HomeHeader from "../header/HomeHeader";
import HomeFooter from "../footer/HomeFooter";
import { AuthProvider } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const pathname = usePathname();

  const hideLayoutPages = [
    "/login",
    "/register",
  ];

  const hideHeaderFooter =
    hideLayoutPages.includes(pathname);

  // Check if the current URL is exactly "/mtht"
  // const hideHeader = pathname === "/mtht";
  return (
    <AuthProvider>
      {!hideHeaderFooter && <HomeHeader />}
      <main>{children}</main>

      {<HomeFooter />}
    </AuthProvider>
  );
}
