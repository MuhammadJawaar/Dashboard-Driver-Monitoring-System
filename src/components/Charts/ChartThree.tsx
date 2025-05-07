import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

// Opsi konfigurasi untuk chart
const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF"],
  labels: ["Mengantuk", "Menguap", "Terdistraksi"],
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
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
  responsive: [
    {
      breakpoint: 640,
      options: { chart: { width: 200 } },
    },
  ],
};

const colors = ["#3C50E0", "#6577F3", "#8FD0EF"];

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([0, 0, 0]);
  const [labels, setLabels] = useState<string[]>([
    "Mengantuk",
    "Menguap",
    "Terdistraksi",
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // Allow null for all months

  // Get current year and previous years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2]; // Tahun sekarang dan dua tahun sebelumnya

  // Fetch data based on selected year and month
  const fetchData = async (year: number | "all", month: number | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/pelanggaran/statistik-perilaku?tahun=${year}`;
      if (month !== null) {
        url += `&bulan=${month}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Gagal mengambil data");

      const data = await response.json();
      setLabels(data.labels || ["Mengantuk", "Menguap", "Terdistraksi"]);
      setSeries(data.series || [0, 0, 0]);
    } catch (err) {
      setError("Gagal mengambil data statistik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-8 xl:col-span-5">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h5 className="text-lg font-semibold text-black dark:text-white">
          Statistik Perilaku Pengemudi
        </h5>
        {/* Filters */}
        <div className="mt-2 flex gap-2 sm:mt-0">
          <select
            className="rounded border px-2 py-1 text-sm dark:bg-boxdark dark:text-white"
            value={selectedMonth ?? ""}
            onChange={(e) =>
              setSelectedMonth(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Semua Bulan</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            className="rounded border px-2 py-1 text-sm dark:bg-boxdark dark:text-white"
            value={selectedYear === "all" ? "" : selectedYear} // If "all", show empty value
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : "all")
            }
          >
            <option value="all">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kondisi Loading dan Error */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Chart */}
          <div className="mb-5 flex justify-center">
            <ReactApexChart options={options} series={series} type="donut" />
          </div>

          {/* Legend */}
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
            {labels.map((label, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <p className="text-sm font-medium text-black dark:text-white">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartThree;
