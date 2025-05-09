"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { Bus } from "@/types/bus"; 
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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

const TableThree = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const { data, error, isLoading } = useSWR(
    `/api/bus?query=${query}&page=${page}&limit=${limit}`,
    fetcher
  );

  const buses: Bus[] = data?.buses || [];
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
      text: "Data bus yang dihapus tidak dapat dikembalikan!",
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
        const res = await fetch(`/api/bus/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus bus");

        MySwal.fire({
          title: "Terhapus!",
          text: "Data bus berhasil dihapus.",
          icon: "success",
          background: theme === "dark" ? "#1a222c" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        });
        mutate(`/api/bus?query=${query}&page=${page}&limit=${limit}`);
      } catch (error) {
        MySwal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menghapus bus.",
          icon: "error",
          background: theme === "dark" ? "#1a222c" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        });
      }
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-3">Loading bus data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-3">Gagal memuat data bus</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="block lg:hidden">
        {buses.length === 0 ? (
          <p className="text-center py-4 text-sm text-gray-500">
            Tidak ada data yang ditemukan
          </p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {buses.map((bus: Bus) => (
              <div key={bus.id} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {bus.plat_bus}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/bus/${bus.id}/edit`}>
                      <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                    </Link>
                    <button onClick={() => handleDelete(bus.id)}>
                      <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Kapasitas</span>
                    <span className="text-black dark:text-white">{bus.kapasitas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Merek</span>
                    <span className="text-black dark:text-white">{bus.merek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tahun</span>
                    <span className="text-black dark:text-white">{bus.tahun_pembuatan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Plat</th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Kapasitas</th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Merek</th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Tahun</th>
                <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                buses.map((bus: Bus) => (
                  <tr key={bus.id} className="border-b dark:border-strokedark">
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{bus.plat_bus}</td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{bus.kapasitas}</td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{bus.merek}</td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{bus.tahun_pembuatan}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/bus/${bus.id}/edit`}>
                          <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                        </Link>
                        <button onClick={() => handleDelete(bus.id)}>
                          <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            disabled={page <= 1}
            onClick={() => changePage(-1)}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-black dark:text-white text-sm px-2">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => changePage(1)}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableThree;