"use client";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { Suspense, useEffect, useState } from "react";
import HomeHeader from "@/components/Header/HomeHeader";
import Signin from "@/components/SignIn/page";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Suspense>
        <Signin />
      </Suspense>
    </div>
  );
}
