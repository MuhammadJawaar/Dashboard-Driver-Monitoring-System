"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Image } from "lightbox.js-react";
import qs from "query-string";
import { useMemo } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
};

export default function HistoriPelanggaranTable() {
  // ────────────────────────────────────────────────────────────────────────────
  // Router helpers
  // ────────────────────────────────────────────────────────────────────────────
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  // Build URL safely with query-string (encodes only provided params)
  const apiUrl = useMemo(() => {
    return qs.stringifyUrl({
      url: "/api/pelanggaran",
      query: {
        query,
        page,
        limit,
        startDate,
        endDate,
      },
    });
  }, [query, page, limit, startDate, endDate]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  const pelanggaranList = data?.pelanggaran ?? [];
  const { totalPages = 1 } = data?.pagination ?? {};

  // ────────────────────────────────────────────────────────────────────────────
  // Pagination helpers
  // ────────────────────────────────────────────────────────────────────────────
  const changeParam = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined) params.delete(key);
    else params.set(key, String(value));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeParam("limit", e.target.value);
    changeParam("page", 1);
  };

  const goPage = (offset: number) => {
    const newPage = Math.max(1, Math.min(totalPages, page + offset));
    changeParam("page", newPage);
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ────────────────────────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  // ────────────────────────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <p className="mt-3 text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    console.error(error);
    return <p className="mt-3 text-center text-red-500">Gagal memuat data</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="w-full overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {[
                "ID",
                "Waktu",
                "Jenis Pelanggaran",
                "Gambar",
                "Nama Pengemudi",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-sm font-medium text-black dark:text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pelanggaranList.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-sm text-gray-500"
                >
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              pelanggaranList.map((item: any) => (
                <tr key={item.id} className="border-b dark:border-strokedark">
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {item.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {formatDate(item.waktu_pelanggaran)}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {item.jenis_pelanggaran}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {item.image ? (
                      <Image
                        image={{
                          src: item.image,
                          alt: "Pelanggaran",
                          title: "pelanggaran",
                        }}
                        width={250}
                        height={250}
                      />
                    ) : (
                      <span className="text-gray-500">Tidak ada gambar</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-black dark:text-white">
                    {/* Gunakan nama_pengemudi redundan jika ada, fallback ke relasi */}
                    {item.nama_pengemudi}
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
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-black dark:text-white">
            per halaman
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => goPage(-1)}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600"
          >
            Previous
          </button>
          <span className="px-2 text-sm text-black dark:text-white">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => goPage(1)}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
