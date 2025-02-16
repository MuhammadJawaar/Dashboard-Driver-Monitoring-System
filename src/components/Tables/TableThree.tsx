'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Bus } from '@/types/bus';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Gagal mengambil data');
  }
  return res.json();
};

const TableThree = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5; // Default limit 5

  const { data, error, isLoading } = useSWR(
    `/api/bus?query=${query}&page=${page}&limit=${limit}`,
    fetcher
  );

  const buses: Bus[] = data?.buses || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const changePage = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const newPage = Math.max(1, Math.min(totalPages, page + offset));
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', event.target.value);
    params.set('page', '1'); // Reset ke halaman pertama
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-3">Loading bus data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-3">Gagal memuat data bus</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-md dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left dark:bg-meta-4">
              <th className="min-w-[125px] px-4 py-4 font-medium text-black dark:text-white">
                Plat
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Kapasitas
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Merek
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Tahun Pembuatan
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              buses.map((bus: Bus) => (
                <tr key={bus.id} className="border-b dark:border-strokedark">
                  <td className="px-4 py-5 text-black dark:text-white">{bus.plat_bus}</td>
                  <td className="px-4 py-5 text-black dark:text-white">{bus.kapasitas}</td>
                  <td className="px-4 py-5 text-black dark:text-white">{bus.merek}</td>
                  <td className="px-4 py-5 text-black dark:text-white">{bus.tahun_pembuatan}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center space-x-3.5">
                      <Link href={`/tables/${bus.id}/view`} className="hover:text-primary">
                        👁️
                      </Link>
                      <Link href={`/dashboard/tables/${bus.id}/edit`} className="hover:text-primary">
                        ✏️
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Limit Selection */}
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="limit" className="text-black dark:text-white">
            Tampilkan:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="px-2 py-1 bg-white border rounded dark:bg-gray-600 dark:text-white"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-black dark:text-white">per halaman</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            disabled={page <= 1}
            onClick={() => changePage(-1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-black dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => changePage(1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableThree;
