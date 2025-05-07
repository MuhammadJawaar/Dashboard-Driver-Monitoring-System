"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }
  return res.json();
};

const HistoriPelanggaranHarianTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const startDate = searchParams.get("startDate") || "";

  const { data, error, isLoading } = useSWR(
    `/api/pelanggaran/harian?query=${query}&page=${page}&limit=${limit}&startDate=${startDate}`,
    fetcher,
  );

  const pelanggaranList = data?.data || [];
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

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Low":
        return "text-green-500"; // Green for low risk
      case "Medium Low":
        return "text-yellow-500"; // Yellow for medium-low risk
      case "Medium":
        return "text-orange-400"; // Orange for medium risk
      case "Medium High":
        return "text-orange-600"; // Darker orange for medium-high risk
      case "High":
        return "text-red-600"; // Red for high risk
      default:
        return "text-gray-500"; // Default gray
    }
  };

  const handleRowClick = (nama: string) => {
    router.push(
      `/dashboard/pelanggaran?query=${nama}&startDate=${startDate}&endDate=${startDate}`,
    ); // Navigasi ke halaman detail pelanggaran
  };

  if (isLoading) {
    return <p className="mt-3 text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    console.error("Error loading data:", error);
    return <p className="mt-3 text-center text-red-500">Gagal memuat data</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="w-full overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                No
              </th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                Tingkat Pelanggaran
              </th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                Nama Pengemudi
              </th>
              <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                Jenis Pelanggaran & Jumlah
              </th>{" "}
              {/* Kolom gabungan */}
            </tr>
          </thead>
          <tbody>
            {pelanggaranList.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-sm text-gray-500"
                >
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              pelanggaranList.map((item: any, index: number) => (
                <tr
                  key={item.pengemudiId}
                  className="cursor-pointer border-b dark:border-strokedark"
                  onClick={() => handleRowClick(item.nama)} // Membuat baris klikable
                >
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td
                    className={`px-4 py-4 text-sm font-medium ${getCategoryStyle(item.category)}`}
                  >
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {item.nama || "-"}
                  </td>
                  {/* Kolom Jenis Pelanggaran dan Jumlah */}
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {Object.keys(item.countByType).map((key, idx) => (
                      <div key={idx}>
                        {key}: {item.countByType[key]}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-between gap-3 bg-gray-50 p-4 dark:bg-gray-700 sm:flex-row">
        <div className="flex items-center gap-2 text-sm">
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-600 dark:text-white"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-sm text-black dark:text-white">
            per halaman
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => changePage(-1)}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600"
          >
            Previous
          </button>
          <span className="px-2 text-sm text-black dark:text-white">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => changePage(1)}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriPelanggaranHarianTable;
