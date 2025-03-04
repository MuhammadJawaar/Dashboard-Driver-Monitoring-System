import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF"],
  labels: ["Mengantuk", "Menguap", "Terdistraksi"],
  legend: {
    show: false,
  },
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
      colors: ["#fff"],
    },
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const colors = ["#3C50E0", "#6577F3", "#8FD0EF"];

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/pelanggaran/statistik-perilaku");
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();
        setSeries(data.series);
      } catch (err) {
        setError("Gagal mengambil data statistik");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-8 xl:col-span-5">
      {/* Header */}
      <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Statistik Perilaku Pengemudi
      </h5>

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
            {options.labels?.map((label, index) => (
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
