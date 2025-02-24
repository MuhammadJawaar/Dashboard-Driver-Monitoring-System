import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SupervisorTable from "@/components/Tables/SupervisorTable";
import Search from "@/components/SearchBar/SearchBar"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Pengemudi List | Admin Dashboard",
  description: "Daftar bus yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Supervisor" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 h-screen">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
        <Search placeholder="Cari Supervisor..." buttonHref="/dashboard/supervisor/add" buttonLabel="Tambah Supervisor" />
        <SupervisorTable />
        </Suspense>
       
      </div>
    </div>
  );
};

export default TablesPage;
