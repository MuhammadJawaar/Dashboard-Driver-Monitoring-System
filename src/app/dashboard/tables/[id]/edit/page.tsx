import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  console.log(id);

  interface Bus {
    id: string;
    plat_bus: string;
    merek: string;
    tahun_pembuatan: string;
  }

  async function getBusData(): Promise<Bus> {
    const res = await fetch(`http://localhost:3000/api/bus/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch bus data");
    }
    return res.json();
  }

  const busData = await getBusData();

  return (
    <DefaultLayout>
      <div className="flex h-screen sm:grid-cols-2">
        <div className="w-full flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Edit Bus</h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                {/* Default Input (ReadOnly) */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    ID Bus
                  </label>
                  <input
                    type="text"
                    value={busData.id}
                    readOnly
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 px-5 py-3 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Default Input - Active saat Fokus */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Plat Bus
                  </label>
                  <input
                    type="text"
                    defaultValue={busData.plat_bus}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition 
                    focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Default Input - Active saat Fokus */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Merek
                  </label>
                  <input
                    type="text"
                    defaultValue={busData.merek}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition 
                    focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* Default Input - Active saat Fokus */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Tahun Pembuatan
                  </label>
                  <input
                    type="text"
                    defaultValue={busData.tahun_pembuatan}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition 
                    focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
