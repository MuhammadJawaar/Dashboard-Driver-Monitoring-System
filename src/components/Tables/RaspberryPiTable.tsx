"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }
  return res.json();
};

const getTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("color-theme") || "light";
};

const RaspberryPiTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const { data, error, isLoading } = useSWR(
    `/api/raspberrypi?query=${query}&page=${page}&limit=${limit}`,
    fetcher,
  );

  const raspberryPis = data?.raspberryPi || [];
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

  const handleDelete = async (id: string) => {
    const theme = await getTheme();
    const result = await MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Raspberry Pi yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: theme === "dark" ? "#1a222c" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/raspberrypi/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus data");

        MySwal.fire({
          title: "Terhapus!",
          text: "Data Raspberry Pi berhasil dihapus.",
          icon: "success",
          background: theme === "dark" ? "#1a222c" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        });
        mutate(`/api/raspberrypi?query=${query}&page=${page}&limit=${limit}`);
      } catch (error) {
        MySwal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menghapus data.",
          icon: "error",
          background: theme === "dark" ? "#1a222c" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        });
      }
    }
  };

  if (isLoading) {
    return <p className="mt-3 text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    return <p className="mt-3 text-center text-red-500">Gagal memuat data</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Mobile view */}
      <div className="block lg:hidden">
        {raspberryPis.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Tidak ada data yang ditemukan
          </p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {raspberryPis.map((item: any) => (
              <div key={item.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {item.id}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/raspberrypi/${item.id}/edit`}>
                      <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Nama Pengemudi
                    </span>
                    <span className="text-black dark:text-white">
                      {item.pengemudi?.nama || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Merek Bus
                    </span>
                    <span className="text-black dark:text-white">
                      {item.Bus?.merek || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Plat Bus
                    </span>
                    <span className="text-black dark:text-white">
                      {item.Bus?.plat_bus || "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                  ID Raspberry Pi
                </th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                  Nama Pengemudi
                </th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                  Merek Bus
                </th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                  Plat Bus
                </th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {raspberryPis.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-sm text-gray-500"
                  >
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                raspberryPis.map((item: any) => (
                  <tr key={item.id} className="border-b dark:border-strokedark">
                    <td className="px-4 py-4 text-sm text-black dark:text-white">
                      {item.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">
                      {item.pengemudi?.nama || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">
                      {item.Bus?.merek || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">
                      {item.Bus?.plat_bus || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/raspberrypi/${item.id}/edit`}>
                          <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                        </Link>
                        <button onClick={() => handleDelete(item.id)}>
                          <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

export default RaspberryPiTable;
