"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE", "#FFAAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: { bar: { borderRadius: 0, columnWidth: "25%" } },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: "50%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
  },
  fill: { opacity: 1 },
  tooltip: {
    marker: { show: false },
  },
};

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState([
    { name: "Mengantuk", data: Array(12).fill(0) },
    { name: "Menguap", data: Array(12).fill(0) },
    { name: "Terdistraksi", data: Array(12).fill(0) },
  ]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching violation data for year:", selectedYear);
        const res = await fetch(`/api/pelanggaran/tahun?year=${selectedYear}`);
        if (!res.ok) throw new Error("Failed to fetch violation data");
        const data = await res.json();
        console.log("Violation data:", data);

        setSeries([
          { name: "Mengantuk", data: data.drowsiness || Array(12).fill(0) },
          { name: "Menguap", data: data.yawn || Array(12).fill(0) },
          { name: "Terdistraksi", data: data.distraction || Array(12).fill(0) },
        ]);
      } catch (error) {
        console.error("Error fetching violation data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Pelanggaran per Bulan ({selectedYear})
        </h4>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded border border-gray-300 px-3 py-1 text-sm dark:bg-boxdark dark:text-white"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
