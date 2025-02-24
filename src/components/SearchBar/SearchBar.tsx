'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';

interface SearchProps {
  placeholder: string;
  buttonHref: string;
  buttonLabel: string;
}

export default function Search({ placeholder, buttonHref, buttonLabel }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const defaultQuery = searchParams.get('query') || '';

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset pagination ketika pencarian terjadi
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center space-x-4">
      {/* Input Search */}
      <div className="relative flex-grow">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          type="text"
          defaultValue={defaultQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:placeholder-gray-400 dark:focus:ring-white"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-white" />
      </div>

      {/* Button Tambah (Flexible) */}
      <Link
        href={buttonHref}
        className="flex items-center gap-2 px-4 py-2 text-gray-900 bg-white text-sm font-medium rounded-md shadow-md transition-all transition-colors duration-0 hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-opacity-80"
      >
        <PlusIcon className="h-5 w-5" />
        {buttonLabel}
      </Link>
    </div>
  );
}
