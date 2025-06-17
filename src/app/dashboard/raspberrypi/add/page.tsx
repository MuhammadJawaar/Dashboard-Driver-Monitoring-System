import { Metadata } from "next";
import AddRaspberryPiForm from "@/components/Forms/AddRaspberryPiForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tambah Raspberry Pi | DMS Dipyo",
  description: "Add Raspberry Pi details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="flex w-full flex-col gap-9">
        <Suspense>
          <AddRaspberryPiForm /> {/* Kirim props ke Client Component */}
        </Suspense>
      </div>
    </div>
  );
}
