"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createBus } from "@/lib/ApiCall/bus";

export default function AddBusForm() {
  const router = useRouter();
  const [busData, setBusData] = useState({
    plat_bus: "",
    kapasitas: 0,
    merek: "",
    tahun_pembuatan: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusData((prev) => ({
      ...prev,
      [name]: name === "kapasitas" || name === "tahun_pembuatan" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBus(busData);
      toast.success("Bus berhasil ditambahkan!");
      router.push("/dashboard/bus");
    } catch (error) {
      toast.error("Gagal menambahkan bus!");
      console.error("Error adding bus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Tambah Bus
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:p-6.5">
        {/* Mobile View */}
        <div className="grid gap-4 sm:grid-cols-1 lg:hidden">
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Plat Bus
            </label>
            <input
              type="text"
              name="plat_bus"
              value={busData.plat_bus}
              onChange={handleChange}
              placeholder="Masukkan plat bus"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Kapasitas
            </label>
            <input
              type="number"
              name="kapasitas"
              value={busData.kapasitas}
              onChange={handleChange}
              placeholder="Masukkan kapasitas"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Merek
            </label>
            <input
              type="text"
              name="merek"
              value={busData.merek}
              onChange={handleChange}
              placeholder="Masukkan merek bus"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Tahun Pembuatan
            </label>
            <input
              type="number"
              name="tahun_pembuatan"
              value={busData.tahun_pembuatan}
              onChange={handleChange}
              placeholder="Masukkan tahun pembuatan"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Plat Bus
            </label>
            <input
              type="text"
              name="plat_bus"
              value={busData.plat_bus}
              onChange={handleChange}
              placeholder="Masukkan plat bus"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Kapasitas
            </label>
            <input
              type="number"
              name="kapasitas"
              value={busData.kapasitas}
              onChange={handleChange}
              placeholder="Masukkan kapasitas"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Merek
            </label>
            <input
              type="text"
              name="merek"
              value={busData.merek}
              onChange={handleChange}
              placeholder="Masukkan merek bus"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Tahun Pembuatan
            </label>
            <input
              type="number"
              name="tahun_pembuatan"
              value={busData.tahun_pembuatan}
              onChange={handleChange}
              placeholder="Masukkan tahun pembuatan"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded bg-primary p-3 text-base font-medium text-white transition-all hover:bg-opacity-90 disabled:bg-opacity-50 sm:text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}