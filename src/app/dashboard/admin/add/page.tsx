import { Metadata } from "next";
import AddAdminForm from "@/components/Forms/AddAdminForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tambah Admin | DMS Dipyo",
  description: "Add Admin details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="flex w-full flex-col gap-9">
        <Suspense>
          <AddAdminForm /> {/* Kirim props ke Client Component */}
        </Suspense>
      </div>
    </div>
  );
}
