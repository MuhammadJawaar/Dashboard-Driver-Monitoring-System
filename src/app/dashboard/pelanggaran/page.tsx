import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HistoriPelanggaranTable from "@/components/Tables/HistoriPelanggaranTable";
import Search from "@/components/SearchBar/SearchBarPelanggaran"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Histori Pelanggaran | DMS Dipyo",
  description: "Daftar histori pelanggaran dalam sistem",
};

const HistoriPelanggaranPage = () => {
  return (
    <div className="p-6 ">
      <Breadcrumb pageName="Histori Pelanggaran" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex min-h-screen flex-col gap-0 ">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
          <Search placeholder="Cari pelanggaran..." />
          <HistoriPelanggaranTable />
        </Suspense>
      </div>
    </div>
  );
};

export default HistoriPelanggaranPage;
