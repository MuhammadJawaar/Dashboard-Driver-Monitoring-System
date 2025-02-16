'use client';

import { useSearchParams } from 'next/navigation';
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
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 5;

  const { data: buses, error, isLoading } = useSWR(`/api/bus?query=${query}&page=${page}&limit=${itemsPerPage}`, fetcher);

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-3">Loading bus data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-3">Gagal memuat data bus</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Id</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Plat</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Merek</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Tahun Pembuatan</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses?.map((bus: Bus) => (
              <tr key={bus.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{bus.id}</h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{bus.plat_bus}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{bus.merek}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{bus.tahun_pembuatan}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <Link href={`/tables/${bus.id}/view`} className="hover:text-primary">👁️</Link>
                    <Link href={`/dashboard/tables/${bus.id}/edit`} className="hover:text-primary">✏️</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
