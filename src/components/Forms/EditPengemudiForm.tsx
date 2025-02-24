"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Pengemudi } from "@/types/pengemudi";
import { getPengemudiById, updatePengemudi } from "@/lib/ApiCall/pengemudi";

const fetcher = async (pengemudiId: string): Promise<Pengemudi> => {
  return await getPengemudiById(pengemudiId);
};

export default function EditPengemudiForm() {
  const router = useRouter();
  const params = useParams();
  const pengemudiId = params?.id as string;

  const { data: formData, error, isLoading, mutate } = useSWR(pengemudiId, fetcher);
  const [updatedData, setUpdatedData] = useState<Partial<Pengemudi>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: name === "nomor_telepon" ? value : value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePengemudi(pengemudiId, updatedData);
      mutate();
      toast.success("Pengemudi berhasil diperbarui!");
      router.push("/dashboard/pengemudi");
    } catch (error) {
      toast.error("Gagal memperbarui pengemudi!");
      console.error("Error updating pengemudi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!pengemudiId) return <p className="text-center text-red-500">Pengemudi ID tidak ditemukan!</p>;
  if (isLoading) return <p className="text-center">Fetching pengemudi data...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching pengemudi data</p>;

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Edit Pengemudi
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:p-6.5">
        <div className="grid gap-4 sm:grid-cols-1">
          {/* Nama */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={updatedData.nama ?? formData?.nama ?? ""}
              onChange={handleChange}
              placeholder="Masukkan nama pengemudi"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Alamat */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              value={updatedData.alamat ?? formData?.alamat ?? ""}
              onChange={handleChange}
              placeholder="Masukkan alamat"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="nomor_telepon"
              value={updatedData.nomor_telepon ?? formData?.nomor_telepon ?? ""}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={
                updatedData.tanggal_lahir
                  ? new Date(updatedData.tanggal_lahir).toISOString().split("T")[0]
                  : formData?.tanggal_lahir
                  ? new Date(formData.tanggal_lahir).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        {/* Submit Button */}
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
