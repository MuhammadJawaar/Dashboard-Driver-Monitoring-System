"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartTwo from "../Charts/ChartTwo";
import CardDataStats from "../CardDataStats";
import { UserIcon } from "@heroicons/react/24/outline";

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const [stats, setStats] = useState({
    totalBus: 0,
    totalPengemudi: 0,
    totalPelanggaran: 0,
    totalRaspberryPi: 0,
  });

  useEffect(() => {
    const fetchBusCount = async () => {
      try {
        console.log("Fetching bus count...");
        const res = await fetch("/api/bus/count");
        if (!res.ok) throw new Error("Failed to fetch bus count");
        const data = await res.json();
        console.log("Bus data:", data);
        setStats((prev) => ({ ...prev, totalBus: data.totalBuses || 0 }));
      } catch (error) {
        console.error("Error fetching bus count:", error);
      }
    };

    const fetchDriversCount = async () => {
      try {
        console.log("Fetching drivers count...");
        const res = await fetch("/api/pengemudi/count");
        if (!res.ok) throw new Error("Failed to fetch drivers count");
        const data = await res.json();
        console.log("Drivers data:", data);
        setStats((prev) => ({ ...prev, totalPengemudi: data.totalPengemudi || 0 }));
      } catch (error) {
        console.error("Error fetching drivers count:", error);
      }
    };

    const fetchViolationsCount = async () => {
      try {
        console.log("Fetching violations count...");
        const res = await fetch("/api/pelanggaran/count");
        if (!res.ok) throw new Error("Failed to fetch violations count");
        const data = await res.json();
        console.log("Violations data:", data);
        setStats((prev) => ({ ...prev, totalPelanggaran: data.totalPelanggaran || 0 }));
      } catch (error) {
        console.error("Error fetching violations count:", error);
      }
    };

    const fetchraspberrypiCount = async () => {
      try {
        console.log("Fetching raspberrypi count...");
        const res = await fetch("/api/raspberrypi/count");
        if (!res.ok) throw new Error("Failed to fetch raspberrypi count");
        const data = await res.json();
        console.log("raspberrypi data:", data);
        setStats((prev) => ({ ...prev, totalRaspberryPi: data.totalRaspberryPi || 0 }));
      } catch (error) {
        console.error("Error fetching raspberrypi count:", error);
      }
    };

    // Jalankan semua fetch secara paralel tanpa memblokir yang lain
    fetchBusCount();
    fetchDriversCount();
    fetchViolationsCount();
    fetchraspberrypiCount();
  }, []);

  const statsData = [
    { title: "Total Bus", value: stats.totalBus, icon: "bus" },
    { title: "Total Pengemudi", value: stats.totalPengemudi, icon: "driver" },
    { title: "Total Pelanggaran", value: stats.totalPelanggaran, icon: "warning" },
    { title: "Total Raspberry Pi", value: stats.totalRaspberryPi, icon: "route" },
  ];

  const getIcon = (iconType: string) => {
    const iconClass = "text-gray-900 dark:text-white";

    switch (iconType) {
      case "bus":
        return (
          <svg
            className={iconClass}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6C3 3.79086 4.79086 2 7 2H17C19.2091 2 21 3.79086 21 6V15H20C19.4477 15 19 15.4477 19 16V17H5V16C5 15.4477 4.55228 15 4 15H3V6ZM7 4C5.89543 4 5 4.89543 5 6V10H19V6C19 4.89543 18.1046 4 17 4H7ZM5 14H19V12H5V14ZM6 18C6.55228 18 7 18.4477 7 19C7 19.5523 6.55228 20 6 20C5.44772 20 5 19.5523 5 19C5 18.4477 5.44772 18 6 18ZM18 18C18.5523 18 19 18.4477 19 19C19 19.5523 18.5523 20 18 20C17.4477 20 17 19.5523 17 19C17 18.4477 17.4477 18 18 18Z"
              fill="currentColor"
            />
          </svg>
        );
      case "driver":
        return <UserIcon className={"w-5 h-5 " + iconClass }/>;
      case "warning":
        return (          <svg
          className={iconClass}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
            fill="currentColor"
          />
        </svg>);
      case "route":
        return (          <svg
          className={iconClass}
          width="18"
          height="18"
          viewBox="0 0 32 32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>

            <g>

              <path d="M13.8,6.4c-1.4-1.1-2.9-1.9-4.6-2.5c1.5,0.9,3,1.7,4.2,2.9c-0.1,1.1-1.5,1.8-3.1,1.7c-0.1-0.1,0.1-0.1,0.1-0.3    C10,8.1,9.5,8.2,9.2,8c0-0.1,0.2-0.1,0.1-0.2C9,7.6,8.6,7.5,8.3,7.3c0-0.1,0.2-0.1,0.3-0.2c-0.3-0.2-0.7-0.3-1-0.6    c0.1-0.1,0.2,0,0.3-0.2C7.6,6.1,7.3,5.9,7.1,5.6c0.1-0.1,0.2,0,0.3-0.1C7.3,5.2,6.9,5,6.8,4.7c0.2,0,0.3,0.1,0.5-0.1    C7.1,4.3,6.7,4.2,6.6,3.8c0.1-0.1,0.3,0,0.4-0.1c0-0.3-0.2-0.5-0.3-0.8c0.3-0.1,0.7,0,1-0.1c0-0.1-0.1-0.2-0.1-0.3    c0.4-0.2,0.8,0,1.2,0.1c0.1-0.2-0.1-0.2,0-0.4c0.3,0,0.6,0.2,1,0.2C9.9,2.2,9.6,2.2,9.6,2c0.4,0,0.7,0.2,1,0.4    c0.1-0.1,0-0.2,0.1-0.4c0.3,0.1,0.5,0.3,0.8,0.5c0.2,0,0.1-0.2,0.2-0.3c0.3,0.1,0.5,0.4,0.7,0.5c0.2,0,0.1-0.2,0.2-0.3    c0.3,0.2,0.5,0.5,0.7,0.7c0.2,0,0.1-0.2,0.3-0.2c0.6,0.7,1.2,1.5,1.1,2.5C14.7,5.9,14.3,6.2,13.8,6.4L13.8,6.4z" />

              <path d="M23.5,7.1c0.1,0.1,0.2,0.1,0.3,0.1c-0.3,0.3-0.7,0.3-1.1,0.5c0,0.1,0.1,0.1,0.1,0.2c-0.3,0.2-0.8,0.1-1.1,0.2    c-0.1,0.1,0.1,0.2,0,0.3c-0.4,0.1-0.8,0-1.3-0.1c-0.9-0.2-1.6-0.6-1.9-1.5c1.2-1.3,2.7-2.1,4.2-2.9c-1.7,0.6-3.2,1.4-4.6,2.4    c-0.6-0.2-0.9-0.7-0.9-1.3c0-0.7,0.6-1.8,1.2-2.3l0.2,0.3c0.3-0.2,0.5-0.6,0.8-0.7c0.1,0.1,0,0.3,0.2,0.3c0.2-0.1,0.4-0.4,0.7-0.5    c0.1,0.1,0,0.2,0.2,0.3C20.8,2.4,21,2.1,21.4,2c0,0.1-0.1,0.2,0,0.4C21.7,2.2,22,2,22.4,2c0,0.1-0.2,0.2-0.1,0.4    c0.3,0,0.6-0.2,1-0.2c0,0.1-0.1,0.2,0,0.4c0.4-0.1,0.8-0.2,1.2-0.1c0,0.1-0.1,0.2-0.1,0.3c0.3,0.1,0.7,0,1,0.1    C25.3,3.2,25,3.4,25,3.7c0.1,0.1,0.3,0,0.4,0.1c-0.1,0.4-0.5,0.5-0.6,0.8c0.1,0.2,0.3,0,0.4,0.1c-0.1,0.3-0.5,0.5-0.7,0.8    c0.1,0.2,0.2,0.1,0.3,0.1c-0.2,0.3-0.5,0.4-0.7,0.7c0.1,0.1,0.2,0.1,0.3,0.2C24.2,6.8,23.8,6.9,23.5,7.1L23.5,7.1z" />

            </g>

            <g>

              <path d="M15.4,16c0,1.8-1.4,3.6-3.2,4c-1.8,0.4-3.4-0.9-3.5-2.7c-0.1-1.8,1.2-3.6,2.9-4C13.7,12.7,15.4,14,15.4,16z" />

              <path d="M23.4,16.9c0,2.1-1.8,3.4-3.8,2.8c-1.8-0.6-3.1-2.5-2.8-4.4c0.3-1.8,2.1-2.9,3.9-2.2C22.3,13.7,23.4,15.3,23.4,16.9    L23.4,16.9z" />

              <path d="M16.1,19.4c1,0,2,0.4,2.7,1.2c1.2,1.3,1.1,3.2-0.2,4.3c-1.3,1.1-3.4,1.2-4.7,0.1c-1-0.8-1.4-1.8-1.2-3.1    c0.3-1.3,1.2-2,2.4-2.4C15.4,19.5,15.7,19.4,16.1,19.4L16.1,19.4z" />

              <path d="M19.8,25.3c0.1-1,0.5-2,1.3-2.9c0.5-0.5,1-1,1.5-1.4c0.3-0.2,0.6-0.3,0.9-0.4c0.6-0.1,1.1,0.1,1.3,0.7c0.4,1,0.5,2,0,3    c-0.6,1.4-1.7,2.3-3.2,2.6c-0.1,0-0.3,0-0.5,0C20.2,27,19.8,26.6,19.8,25.3z" />

              <path d="M6.9,22.7c0,0,0-0.2,0-0.3c0.1-1.1,0.7-1.5,1.8-1.2c1.7,0.5,3.3,2.5,3.4,4.3c0,1.1-0.5,1.6-1.6,1.4    c-1.5-0.2-2.5-1-3.1-2.3C7,24,6.9,23.4,6.9,22.7L6.9,22.7z" />

              <path d="M16.2,12.8c-0.8,0-1.6-0.1-2.3-0.5c-1.3-0.7-1.3-1.6-0.2-2.4c1.5-1.1,3.5-1,4.9,0.2c0.1,0.1,0.2,0.2,0.3,0.3    c0.5,0.6,0.4,1.2-0.2,1.7c-0.5,0.4-1.1,0.5-1.7,0.6C16.7,12.8,16.4,12.8,16.2,12.8L16.2,12.8z" />

              <path d="M16,30c-1.2,0-2.2-0.5-3.1-1.4c-0.4-0.4-0.4-0.8,0.1-1.1c0.7-0.4,1.4-0.6,2.2-0.7c1-0.1,2-0.1,3,0.2    c0.2,0.1,0.5,0.2,0.7,0.3c0.6,0.3,0.7,0.6,0.2,1.2c0,0,0,0-0.1,0.1C18.3,29.5,17.3,30,16,30z" />

              <path d="M7.8,16.8c0,1.1-0.2,2.1-0.6,3.1c-0.1,0.3-0.2,0.5-0.4,0.7C6.5,21,6.3,21,6,20.7c-1.4-1.4-1.2-4.1,0.5-5.3    c0.6-0.5,1-0.4,1.2,0.4C7.7,16.1,7.8,16.5,7.8,16.8L7.8,16.8z" />

              <path d="M26.9,18.3c0,0.8-0.3,1.7-0.9,2.4c-0.3,0.3-0.5,0.3-0.8,0c-0.3-0.4-0.5-0.9-0.6-1.4c-0.3-1-0.4-2.1-0.3-3.2    c0-0.2,0.1-0.5,0.2-0.7c0.2-0.4,0.4-0.5,0.8-0.2C26.3,15.8,26.9,16.9,26.9,18.3z" />

              <path d="M7.5,13.9c-0.1-1.3,0.3-2.5,1.4-3.3c1.1-0.8,2.3-1,3.6-0.8c0,0.3-0.2,0.5-0.3,0.7c-0.7,0.9-1.6,1.6-2.4,2.3    c-0.5,0.4-1,0.7-1.5,1C7.9,13.9,7.7,14.1,7.5,13.9z" />

              <path d="M24.6,14c-0.2,0.1-0.5,0-0.7-0.2c-0.7-0.4-1.4-0.9-2-1.4c-0.7-0.6-1.3-1.2-1.9-1.8c-0.1-0.2-0.3-0.4-0.3-0.6    c0.6-0.3,2.6-0.2,3.6,0.7C24.3,11.5,24.9,13.1,24.6,14z" />

            </g>

          </g>

        </svg>
);
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {statsData.map((stat, index) => (
          <CardDataStats key={index} title={stat.title} total={stat.value.toLocaleString()}>
            {getIcon(stat.icon)}
          </CardDataStats>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree />
      </div>
    </>
  );
};

export default ECommerce;
