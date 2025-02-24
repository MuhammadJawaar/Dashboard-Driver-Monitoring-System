import { Metadata } from "next";
import AddPengemudiForm from "@/components/Forms/AddPengemudiForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add Pengemudi | Next.js Admin Dashboard",
  description: "Add Pengemudi details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">
        <Suspense>
        <AddPengemudiForm  /> {/* Kirim props ke Client Component */}
        </Suspense>
      </div>
    </div>
  );
}
