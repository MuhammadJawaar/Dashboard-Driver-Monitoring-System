"use client";

interface PaginationControlsProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="flex justify-between items-center mt-4 px-5 py-3 border-t border-stroke dark:border-strokedark">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-meta-4 text-black dark:text-white shadow-sm hover:bg-gray-300 dark:hover:bg-meta-3 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-black dark:text-white">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-meta-4 text-black dark:text-white shadow-sm hover:bg-gray-300 dark:hover:bg-meta-3 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
