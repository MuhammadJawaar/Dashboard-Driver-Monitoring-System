import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PengemudiTable from "@/components/Tables/PengemudiTable";
import Search from "@/components/SearchBar/SearchBar"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Pengemudi List | DMS Dipyo",
  description: "Daftar bus yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Pengemudi" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 h-screen">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
        <Search placeholder="Cari pengemudi..." buttonHref="/dashboard/pengemudi/add" buttonLabel="Tambah Pengemudi" />
        <PengemudiTable />
        </Suspense>
       
      </div>
    </div>
  );
};

export default TablesPage;
