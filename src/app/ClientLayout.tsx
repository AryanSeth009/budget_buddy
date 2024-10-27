"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex">
      {!isAuthPage && <Sidebar />}
      <main className={!isAuthPage ? "flex-1" : "w-full"}>{children}</main>
    </div>
  );
}
