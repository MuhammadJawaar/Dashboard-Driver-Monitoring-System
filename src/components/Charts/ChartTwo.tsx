"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Load chart secara dinamis
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ViolationSeries = {
  name: string;
  data: number[];
};

type Pengemudi = {
  id: string;
  nama: string;
};

const ChartTwo: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [granularity, setGranularity] = useState<"daily" | "monthly">("monthly");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [driverId, setDriverId] = useState<string | "all">("all");
  const [drivers, setDrivers] = useState<Pengemudi[]>([]);

  const [series, setSeries] = useState<ViolationSeries[]>([
    { name: "Mengantuk", data: [] },
    { name: "Menguap", data: [] },
    { name: "Terdistraksi", data: [] },
  ]);

  const [categories, setCategories] = useState<string[]>([]);

  // Fetch daftar pengemudi
  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch("/api/pengemudi?limit=100");
      const data = await res.json();
      setDrivers(data.pengemudi || []);
    };
    fetchDrivers();
  }, []);

  // Fetch data statistik sesuai mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `/api/pelanggaran/tahun?granularity=${granularity}&year=${selectedYear}`;
        if (granularity === "daily") {
          url += `&month=${selectedMonth}`;
        }
        if (driverId !== "all") {
          url += `&driverId=${driverId}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setCategories(data.categories || []);
        setSeries([
          { name: "Mengantuk", data: data.drowsiness || [] },
          { name: "Menguap", data: data.yawn || [] },
          { name: "Terdistraksi", data: data.distraction || [] },
        ]);
      } catch (error) {
        console.error("Gagal mengambil data grafik:", error);
      }
    };

    fetchData();
  }, [granularity, selectedYear, selectedMonth, driverId]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3C50E0", "#80CAEE", "#FFAAEE"],
    dataLabels: { enabled: false },
    xaxis: { categories },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
    },
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h4 className="text-lg font-semibold text-black dark:text-white">
          Grafik Pelanggaran ({granularity === "monthly" ? "Bulanan" : "Harian"})
        </h4>

        <div className="flex flex-wrap gap-2 text-sm">
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as "daily" | "monthly")}
            className="rounded border px-2 py-1 dark:bg-boxdark dark:text-white"
          >
            <option value="monthly">Bulanan</option>
            <option value="daily">Harian</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded border px-2 py-1 dark:bg-boxdark dark:text-white"
          >
            {[currentYear - 2, currentYear - 1, currentYear].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {granularity === "daily" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded border px-2 py-1 dark:bg-boxdark dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>
          )}

          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="rounded border px-2 py-1 dark:bg-boxdark dark:text-white"
          >
            <option value="all">Semua Pengemudi</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ChartTwo;
