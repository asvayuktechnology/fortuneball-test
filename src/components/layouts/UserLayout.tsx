"use client";
import React, { ReactNode } from "react";
import HomeHeader from "../header/HomeHeader";
import HomeFooter from "../footer/HomeFooter";
import { AuthProvider } from "@/hooks/useAuth";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthProvider>
      <HomeHeader />
      <main>{children}</main> 
      <HomeFooter />
    </AuthProvider>
  );
}
