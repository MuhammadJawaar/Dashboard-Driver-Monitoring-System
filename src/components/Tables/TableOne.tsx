import Image from "next/image";

async function getBusData() {
  const res = await fetch("http://localhost:3000/api/bus", {
    cache: "no-store", // Pastikan data selalu up-to-date
  });
  if (!res.ok) {
    throw new Error("Failed to fetch bus data");
  }
  return res.json();
}

const TableOne = async () => {
  const buses = await getBusData();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Bus
      </h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Id</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Plat</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Merek</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Kapasitas</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Tahun Pembuatan</h5>
          </div>
        </div>

        {buses.map((bus: any, key: number) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === buses.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
            }`}
            key={bus.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{bus.id}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{bus.plat_bus || "-"}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{bus.merek || "-"}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{bus.kapasitas || "-"}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{bus.tahun_pembuatan || "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
