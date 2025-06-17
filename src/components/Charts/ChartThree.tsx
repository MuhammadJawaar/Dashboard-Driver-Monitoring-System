"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Chart donut tanpa SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LABELS = ["Mengantuk", "Menguap", "Terdistraksi"];
const COLORS = ["#3C50E0", "#6577F3", "#8FD0EF"];

const baseOptions: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
    toolbar: { show: true },
  },
  colors: COLORS,
  labels: LABELS,
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: { size: "65%", background: "transparent" },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      colors: ["#ffffff"],
    },
  },
  responsive: [{ breakpoint: 640, options: { chart: { width: 200 } } }],
};

const ChartThree: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number | "all">("all");
  const [month, setMonth] = useState<number | null>(null);
  const [driverId, setDriverId] = useState<string | "all">("all");
  const [drivers, setDrivers] = useState<{ id: string; nama: string }[]>([]);
  const [series, setSeries] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const years = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch("/api/pengemudi/list");
        const data = await res.json();
        setDrivers(data || []);
      } catch (err) {
        console.error("Gagal mengambil daftar pengemudi", err);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchStatistik = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/pelanggaran/statistik-perilaku?granularity=${
          month === null ? "monthly" : "daily"
        }`;
        if (year !== "all") url += `&year=${year}`;
        if (month !== null) url += `&month=${month}`;
        if (driverId !== "all") url += `&driverId=${driverId}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();

        setSeries(data.series ?? [0, 0, 0]);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data statistik");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistik();
  }, [year, month, driverId]);

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h5 className="text-lg font-semibold text-black dark:text-white">Statistik Perilaku Pengemudi</h5>
        <div className="flex flex-wrap gap-2">
          <select
            value={month ?? ""}
            onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
            className="rounded border px-2 py-1 text-sm dark:bg-boxdark dark:text-white"
          >
            <option value="">Semua Bulan</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded border px-2 py-1 text-sm dark:bg-boxdark dark:text-white"
          >
            <option value="all">Semua Tahun</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="rounded border px-2 py-1 text-sm dark:bg-boxdark dark:text-white"
          >
            <option value="all">Semua Pengemudi</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-5 flex justify-center">
            <ReactApexChart options={baseOptions} series={series} type="donut" />
          </div>

          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
            {LABELS.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <span className="block h-3 w-3 rounded-full" style={{ background: COLORS[idx] }} />
                <p className="text-sm font-medium text-black dark:text-white">{label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartThree;
