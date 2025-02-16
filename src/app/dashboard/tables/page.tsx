import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import Search from "@/components/SearchBar/SearchBar"; // Import Search

export const metadata = {
  title: "Bus List | Admin Dashboard",
  description: "Daftar bus yang tersedia dalam sistem",
};

const TablesPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Bus" />
      {/* Hilangkan celah antara search dan tabel */}
      <div className="flex flex-col gap-0 h-screen">
        {/* Search bar ditempatkan langsung di atas tabel tanpa padding bawah */}
        <Search placeholder="Cari bus..." />
        {/* Table */}
        <TableThree />
      </div>
    </div>
  );
};

export default TablesPage;
