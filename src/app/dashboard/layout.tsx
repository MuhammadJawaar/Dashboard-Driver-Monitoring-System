"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer); // Cleanup timeout jika unmount terjadi sebelum selesai
    }, []);

    return (
        <main className="dark:bg-boxdark-2 dark:text-bodydark">
            <DefaultLayout>
                {children}
            </DefaultLayout>
        </main>
    );
}
