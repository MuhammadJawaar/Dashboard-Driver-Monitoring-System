"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { Image } from "lightbox.js-react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }
  return res.json();
};

const HistoriPelanggaranTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const { data, error, isLoading } = useSWR(
    `/api/pelanggaran?query=${query}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const pelanggaranList = data?.pelanggaran || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const changePage = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const newPage = Math.max(1, Math.min(totalPages, page + offset));
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", event.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-3">Loading data...</p>;
  }

  if (error) {
    console.error("Error loading data:", error);
    return <p className="text-center text-red-500 mt-3">Gagal memuat data</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">ID</th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Waktu</th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Jenis Pelanggaran</th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Gambar</th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Nama Pengemudi</th>
            </tr>
          </thead>
          <tbody>
            {pelanggaranList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              pelanggaranList.map((item: any) => (
                <tr key={item.id} className="border-b dark:border-strokedark">
                  <td className="px-4 py-4 text-sm text-black dark:text-white">{item.id}</td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {new Date(item.waktu_pelanggaran).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">{item.jenis_pelanggaran}</td>
                  <td className="px-4 py-4 text-sm">
                    {item.image ? (
                      <Image
                        width={250}
                        height={250}
                        image={{ src: item.image, title: "pelanggaran" }}
                      />
                    ) : (
                      <span className="text-gray-500">Tidak ada gambar</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {item.raspberrypi?.pengemudi?.nama || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="px-2 py-1 bg-white border rounded dark:bg-gray-600 dark:text-white text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-black dark:text-white text-sm">per halaman</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => changePage(-1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-black dark:text-white text-sm px-2">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => changePage(1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriPelanggaranTable;

