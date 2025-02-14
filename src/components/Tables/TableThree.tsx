import Link from "next/link";

async function getBusData() {
  const res = await fetch("http://localhost:3000/api/bus", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch bus data");
  }
  return res.json();
}

const TableThree = async () => {
  const buses = await getBusData();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Id
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Plat
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
            {buses.map((bus: any, key: number) => (
              <tr key={key}>
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
                    <Link href={`/tables/${bus.id}/view`} className="hover:text-primary">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219Z" fill="" />
                      </svg>
                    </Link>
                    <Link href={`/tables/${bus.id}/edit`} className="hover:text-primary">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M2 13.9999V16H4.00005L12.793 7.20707L10.793 5.20707L2 13.9999ZM15.7071 4.70707C16.0976 4.31654 16.0976 3.68338 15.7071 3.29285L14.7071 2.29285C14.3166 1.90233 13.6834 1.90233 13.2929 2.29285L12.293 3.29285L14.293 5.29285L15.7071 4.70707Z" fill="" />
                      </svg>
                    </Link>
                    <Link href={`/tables/${bus.id}/delete`} className="hover:text-primary">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M16 2H13L12 1H6L5 2H2V4H16V2ZM3 6V16C3 16.55 3.45 17 4 17H14C14.55 17 15 16.55 15 16V6H3ZM5 8H7V14H5V8ZM9 8H11V14H9V8Z" fill="" />
                      </svg>
                    </Link>
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
