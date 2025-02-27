"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getRaspberryPiById, updateRaspberryPi } from "@/lib/ApiCall/raspberryPi";
import { Bus } from "@/types/bus";
import { Pengemudi } from "@/types/pengemudi";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EditRaspberryPiFormProps {
  raspberryId?: string;
}

export default function EditRaspberryPiForm({ raspberryId }: EditRaspberryPiFormProps) {
  const router = useRouter();
  const params = useParams();

  const id = raspberryId || (Array.isArray(params.id) ? params.id[0] : params.id) || "";
  const [raspberryData, setRaspberryData] = useState({
    id_pengemudi: "",
    id_bus: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: busData, error: busError } = useSWR("/api/bus", fetcher);
  const buses: Bus[] = busData?.buses || [];

  const { data: pengemudiData, error: pengemudiError } = useSWR("/api/pengemudi", fetcher);
  const pengemudis: Pengemudi[] = pengemudiData?.pengemudi || [];

  useEffect(() => {
    async function fetchRaspberry() {
      if (!id) return;
      try {
        const data = await getRaspberryPiById(id);
        setRaspberryData({
          id_bus: data.id_bus ?? "",
          id_pengemudi: data.id_pengemudi ?? "",
        });
        setIsLoading(false);
      } catch (error) {
        toast.error("Gagal mengambil data Raspberry Pi!");
        setIsLoading(false);
      }
    }

    fetchRaspberry();
  }, [id]);

  if (busError || pengemudiError) {
    toast.error("Gagal mengambil data bus atau pengemudi!");
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRaspberryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("ID Raspberry Pi tidak ditemukan!");
      return;
    }
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await updateRaspberryPi(id, raspberryData);
      toast.success("Raspberry Pi berhasil diperbarui!");
      router.push("/dashboard/raspberrypi");
    } catch (error) {
      toast.error("Gagal memperbarui Raspberry Pi. Silakan coba lagi!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Edit Raspberry Pi
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:p-6.5">
        <div className="w-full">
          <label className="block text-sm font-medium text-black dark:text-white">
            Pilih Bus (Plat Bus)
          </label>
          <select
            name="id_bus"
            value={raspberryData.id_bus ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Pilih Bus</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.plat_bus ?? "Plat Tidak Diketahui"}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black dark:text-white">
            Pilih Pengemudi (Nama)
          </label>
          <select
            name="id_pengemudi"
            value={raspberryData.id_pengemudi ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Pilih Pengemudi</option>
            {pengemudis.map((pengemudi) => (
              <option key={pengemudi.id} value={pengemudi.id}>
                {pengemudi.nama ?? "Nama Tidak Diketahui"}
              </option>
            ))}
          </select>
        </div>

        {/* 🔥 Tombol Submit dengan animasi loading */}
        <button
          type="submit"
          disabled={isUpdating}
          className="flex w-full justify-center rounded bg-primary p-3 text-base font-medium text-white transition-all hover:bg-opacity-90 disabled:bg-opacity-50 sm:text-sm"
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
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
