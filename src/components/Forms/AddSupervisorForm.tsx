"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import { createSupervisor } from "@/lib/ApiCall/supervisor";
import { SupervisorInput } from "@/types/supervisor";

export default function AddSupervisorForm() {
  const router = useRouter();
  const [supervisorData, setSupervisorData] = useState<SupervisorInput>({
    nama: "",
    nomor_telepon: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nomor_telepon" && value.length < 10) {
      setError("Nomor telepon harus minimal 10 karakter");
    } else {
      setError(null);
    }

    setSupervisorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (error) {
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(supervisorData.password, 10);
      const newData = { ...supervisorData, password: hashedPassword };

      await createSupervisor(newData);
      toast.success("Supervisor berhasil ditambahkan!");
      router.push("/dashboard/supervisor");
    } catch (error: any) {
      console.error("Error adding supervisor:", error);

      // Tangkap pesan error dari API
      const errorMessage =
        error.response?.data?.error ||
        "Gagal menambahkan supervisor. Silakan coba lagi!";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Tambah Supervisor
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 sm:p-6.5">
        <div className="w-full">
          <label className="block text-sm font-medium text-black dark:text-white">
            Nama
          </label>
          <input
            type="text"
            name="nama"
            value={supervisorData.nama ?? ""}
            onChange={handleChange}
            placeholder="Masukkan nama"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black dark:text-white">
            Nomor Telepon
          </label>
          <input
            type="tel"
            name="nomor_telepon"
            value={supervisorData.nomor_telepon ?? ""}
            onChange={handleChange}
            placeholder="Masukkan nomor telepon"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={supervisorData.email ?? ""}
            onChange={handleChange}
            placeholder="Masukkan email"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        </div>

        <div className="w-full relative">
          <label className="block text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={supervisorData.password ?? ""}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-sm text-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || error !== null}
          className="flex w-full justify-center rounded bg-primary p-3 text-base font-medium text-white transition-all hover:bg-opacity-90 disabled:bg-opacity-50 sm:text-sm"
        >
          {loading ? (
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
