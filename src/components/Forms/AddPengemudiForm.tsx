"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createPengemudi } from "@/lib/ApiCall/pengemudi";
import { PengemudiInput } from "@/types/pengemudi";

export default function AddPengemudiForm() {
  const router = useRouter();
  const [pengemudiData, setPengemudiData] = useState<PengemudiInput>({
    nama: "",
    tanggal_lahir: null,
    nomor_telepon: "",
    alamat: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validasi nomor telepon harus minimal 10 karakter
    if (name === "nomor_telepon") {
      if (value.length < 10) {
        setError("Nomor telepon harus minimal 10 karakter");
      } else {
        setError(null);
      }
    }

    setPengemudiData((prev) => ({
      ...prev,
      [name]: name === "tanggal_lahir" ? new Date(value) : value, // Konversi tanggal
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Cek jika ada error sebelum submit
    if (error) {
      setLoading(false);
      return;
    }

    try {
      await createPengemudi(pengemudiData);
      toast.success("Pengemudi berhasil ditambahkan!");
      router.push("/dashboard/pengemudi");
    } catch (error) {
      toast.error("Gagal menambahkan pengemudi!");
      console.error("Error adding pengemudi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Tambah Pengemudi
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:p-6.5">
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {/* Nama */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nama Pengemudi
            </label>
            <input
              type="text"
              name="nama"
              value={pengemudiData.nama || ""}
              onChange={handleChange}
              placeholder="Masukkan nama pengemudi"
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
              value={pengemudiData.tanggal_lahir ? pengemudiData.tanggal_lahir.toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="nomor_telepon"
              value={pengemudiData.nomor_telepon || ""}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Alamat */}
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              value={pengemudiData.alamat || ""}
              onChange={handleChange}
              placeholder="Masukkan alamat"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || error !== null}
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
