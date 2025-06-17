import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HistoriPelanggaranHarianTable from "@/components/Tables/HistoriPelanggaranHarianTable";
import Search from "@/components/SearchBar/SearchBarPelanggaranHarian"; // Import Search
import { Suspense } from "react";

export const metadata = {
  title: "Histori Pelanggaran | DMS Dipyo",
  description: "Daftar histori pelanggaran dalam sistem",
};

const HistoriPelanggaranPage = () => {
  return (

    <div className="p-6 ">
      <Breadcrumb pageName="Histori Pelanggaran Harian" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 min-h-screen ">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Suspense>
          <Search placeholder="Cari pengemudi..." />
          <HistoriPelanggaranHarianTable />
        </Suspense>
      </div>
    </div>
  );
};

export default HistoriPelanggaranPage;