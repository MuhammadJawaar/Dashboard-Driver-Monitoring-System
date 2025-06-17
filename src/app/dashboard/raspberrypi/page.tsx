import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RaspberryPiTable from "@/components/Tables/RaspberryPiTable";
import Search from "@/components/SearchBar/SearchBar"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Raspberry Pi List | DMS Dipyo",
  description: "Daftar Raspberry Pi yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Raspberry Pi" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 h-screen">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
          <Search placeholder="Cari Raspberry Pi..." buttonHref="/dashboard/raspberrypi/add" buttonLabel="Tambah Raspberry Pi" />
          <RaspberryPiTable />
        </Suspense>
      </div>
    </div>
  );
};

export default TablesPage;
