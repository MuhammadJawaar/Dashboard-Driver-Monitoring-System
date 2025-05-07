'use client';

import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchProps {
  placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Ambil nilai default dari URL
  const defaultQuery = searchParams.get('query') || '';
  const defaultStartDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];

  // Fungsi untuk update URL query params
  const handleUpdateParams = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Input Pencarian */}
      <div className="relative flex-grow">
        <input
          type="text"
          defaultValue={defaultQuery}
          onChange={(e) => handleUpdateParams('query', e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      </div>

      {/* Filter Range Tanggal */}
      <div className="relative flex-grow">
        <div className="flex items-center border border-gray-300 rounded-md bg-white py-2.5 px-3 text-sm text-gray-900 dark:border-strokedark dark:bg-boxdark dark:text-white">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            defaultValue={defaultStartDate}
            onChange={(e) => handleUpdateParams('startDate', e.target.value)}
            className="ml-2 w-full bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
