import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminTable from "@/components/Tables/AdminTable";
import Search from "@/components/SearchBar/SearchBar"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Admin Dashboard",
  description: "Daftar Admin yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Admin" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 h-screen">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
        <Search placeholder="Cari Admin..." buttonHref="/dashboard/admin/add" buttonLabel="Tambah Admin" />
        <AdminTable />
        </Suspense>
       
      </div>
    </div>
  );
};

export default TablesPage;
