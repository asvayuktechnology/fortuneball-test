"use client";
import React, { ReactNode } from "react";
// import Header from "../Header";
// import Footer from "../Footer";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
