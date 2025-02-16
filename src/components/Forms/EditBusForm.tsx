"use client";

import useSWR from "swr";
import { Bus } from "@/types/bus";
import { getBusDataId, updateBusData } from "@/lib/ApiCall/bus";
import { useState } from "react";
import { useRouter } from "next/navigation";

const fetcher = async (busId: string): Promise<Bus> => {
  return await getBusDataId(busId);
};

export default function EditBusForm({ busId }: { busId: string }) {
  const router = useRouter();
  const { data: formData, error, isLoading, mutate } = useSWR(busId, fetcher);

  const [updatedData, setUpdatedData] = useState<Partial<Bus>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: name === "kapasitas" || name === "tahun_pembuatan" ? Number(value) || null : value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBusData(busId, updatedData);
      mutate(); // Refresh data setelah update

      setMessage({ text: "Bus berhasil diperbarui!", type: "success" });
    } catch (error) {
      setMessage({ text: "Gagal memperbarui bus!", type: "error" });
      console.error("Error updating bus:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
    if (message?.type === "success") {
      router.push("/dashboard/tables"); // Redirect jika berhasil
    }
  };

  if (isLoading) return <p className="text-center">Fetching bus data...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching bus data</p>;

  return (
    <div className="relative rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Edit Bus</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6.5">
        {/* ID Bus (ReadOnly) */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">ID Bus</label>
          <input
            type="text"
            value={formData?.id || ""}
            readOnly
            className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Plat Bus */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Plat Bus</label>
          <input
            type="text"
            name="plat_bus"
            value={updatedData.plat_bus ?? formData?.plat_bus ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Kapasitas Bus */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Kapasitas</label>
          <input
            type="number"
            name="kapasitas"
            value={updatedData.kapasitas ?? formData?.kapasitas ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Merek */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Merek</label>
          <input
            type="text"
            name="merek"
            value={updatedData.merek ?? formData?.merek ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Tahun Pembuatan */}
        <div className="mb-4.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">Tahun Pembuatan</label>
          <input
            type="number"
            name="tahun_pembuatan"
            value={updatedData.tahun_pembuatan ?? formData?.tahun_pembuatan ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>

      {/* Pop-up Notifikasi */}
      {message && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
            <p className={`text-center text-lg font-semibold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
            <button
              onClick={handleCloseMessage}
              className="mt-3 w-full rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
