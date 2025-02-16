"use client";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import HomeHeader from "@/components/Header/HomeHeader";
import Signin from "@/components/SignIn/page"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (!isClient) {
    return null; // Hindari mismatch hydration
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Signin/>
    </div>
  );
}

