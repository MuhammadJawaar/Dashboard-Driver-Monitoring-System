import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import Search from "@/components/SearchBar/SearchBar"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Daftar Bus | DMS Dipyo",
  description: "Daftar bus yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Bus" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex h-screen flex-col gap-0">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
          <Search
            placeholder="Cari bus..."
            buttonHref="/dashboard/bus/add"
            buttonLabel="Tambah Bus"
          />
          <TableThree />
        </Suspense>
      </div>
    </div>
  );
};

export default TablesPage;
